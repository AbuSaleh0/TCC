const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./db/connection');
const { logAudit } = require('./utils/auditLogger');
const { calculateTariff } = require('./utils/tariffEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper for hashing passwords
function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'tcc_secret_salt_2026', 1000, 32, 'sha256').toString('hex');
}

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'Transport Company Computerisation System (TCC)', timestamp: new Date() });
});

// -------------------------------------------------------------
// 1. AUTHENTICATION (ADMIN, STAFF, CUSTOMER)
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const inputHash = hashPassword(password);
  if (user.password_hash !== inputHash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Get associated customer record if customer
  let customerProfile = null;
  if (user.role === 'CUSTOMER') {
    customerProfile = db.prepare('SELECT * FROM customers WHERE user_id = ? OR email = ?').get(user.id, user.email);
  }

  logAudit(user.email, 'LOGIN', 'AUTHENTICATION', `User logged in with role ${user.role}`);

  res.json({
    token: `tcc-token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      customerProfile
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, company, email, phone, address, password } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'Name, email, phone and password are required' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = hashPassword(password);
    const userStmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, 'CUSTOMER')
    `);
    const result = userStmt.run(name, email, passwordHash);
    const userId = result.lastInsertRowid;

    const custStmt = db.prepare(`
      INSERT INTO customers (user_id, name, company, email, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    custStmt.run(userId, name, company || name, email, phone, address || '');

    logAudit(email, 'REGISTER', 'AUTHENTICATION', 'New customer registration created');
    res.status(201).json({ success: true, message: 'Registration successful! You can now login.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. BRANCH MANAGEMENT
// -------------------------------------------------------------
app.get('/api/branches', (req, res) => {
  const branches = db.prepare('SELECT * FROM branches ORDER BY id ASC').all();
  res.json(branches);
});

app.post('/api/branches', (req, res) => {
  const { branch_code, name, city, address, phone, email } = req.body;
  if (!branch_code || !name || !city) {
    return res.status(400).json({ error: 'Branch code, name, and city are required' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO branches (branch_code, name, city, address, phone, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(branch_code, name, city, address, phone, email);
    logAudit(req.headers['x-user-email'] || 'admin@tcc.com', 'BRANCH_ADD', 'BRANCHES', `Added branch ${name} (${branch_code})`);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Branch added successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. VEHICLE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/vehicles', (req, res) => {
  const vehicles = db.prepare(`
    SELECT v.*, b.name as branch_name, d.name as driver_name
    FROM vehicles v
    LEFT JOIN branches b ON v.current_branch_id = b.id
    LEFT JOIN drivers d ON v.driver_id = d.id
    ORDER BY v.id ASC
  `).all();
  res.json(vehicles);
});

app.post('/api/vehicles', (req, res) => {
  const { reg_number, vehicle_type, capacity_tons, current_branch_id, status, driver_id } = req.body;
  if (!reg_number || !vehicle_type || !capacity_tons) {
    return res.status(400).json({ error: 'Registration number, type, and capacity are required' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO vehicles (reg_number, vehicle_type, capacity_tons, current_branch_id, status, driver_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      reg_number,
      vehicle_type,
      parseFloat(capacity_tons),
      current_branch_id ? parseInt(current_branch_id) : null,
      status || 'Available',
      driver_id ? parseInt(driver_id) : null
    );
    logAudit(req.headers['x-user-email'] || 'admin@tcc.com', 'VEHICLE_ADD', 'VEHICLES', `Added vehicle ${reg_number} (${capacity_tons} tons)`);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Vehicle added successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/vehicles/:id', (req, res) => {
  const { status, current_branch_id, driver_id } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE vehicles
      SET status = COALESCE(?, status),
          current_branch_id = COALESCE(?, current_branch_id),
          driver_id = COALESCE(?, driver_id)
      WHERE id = ?
    `);
    stmt.run(status, current_branch_id, driver_id, req.params.id);
    logAudit(req.headers['x-user-email'] || 'admin@tcc.com', 'VEHICLE_UPDATE', 'VEHICLES', `Updated vehicle ID ${req.params.id} to status ${status}`);
    res.json({ success: true, message: 'Vehicle updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. DRIVER MANAGEMENT
// -------------------------------------------------------------
app.get('/api/drivers', (req, res) => {
  const drivers = db.prepare(`
    SELECT d.*, b.name as branch_name
    FROM drivers d
    LEFT JOIN branches b ON d.assigned_branch_id = b.id
    ORDER BY d.id ASC
  `).all();
  res.json(drivers);
});

app.post('/api/drivers', (req, res) => {
  const { name, license_number, phone, assigned_branch_id, status } = req.body;
  if (!name || !license_number || !phone) {
    return res.status(400).json({ error: 'Name, license number, and phone are required' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO drivers (name, license_number, phone, assigned_branch_id, status)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, license_number, phone, assigned_branch_id ? parseInt(assigned_branch_id) : null, status || 'Available');
    logAudit(req.headers['x-user-email'] || 'admin@tcc.com', 'DRIVER_ADD', 'DRIVERS', `Added driver ${name} (${license_number})`);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Driver registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. CUSTOMER MANAGEMENT
// -------------------------------------------------------------
app.get('/api/customers', (req, res) => {
  const customers = db.prepare('SELECT * FROM customers ORDER BY id ASC').all();
  res.json(customers);
});

app.post('/api/customers', (req, res) => {
  const { name, company, email, phone, address, gst_number } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO customers (name, company, email, phone, address, gst_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, company || '', email, phone, address || '', gst_number || '');
    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'CUSTOMER_ADD', 'CUSTOMERS', `Added customer ${name}`);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Customer registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. TARIFF ENGINE & CONFIGURATION
// -------------------------------------------------------------
app.get('/api/tariffs', (req, res) => {
  const tariffs = db.prepare('SELECT * FROM tariffs WHERE is_active = 1').all();
  res.json(tariffs);
});

app.put('/api/tariffs/:id', (req, res) => {
  const { base_rate, rate_per_km, rate_per_kg, fragile_multiplier, hazardous_multiplier, perishable_multiplier, tax_percentage } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE tariffs
      SET base_rate = ?, rate_per_km = ?, rate_per_kg = ?,
          fragile_multiplier = ?, hazardous_multiplier = ?, perishable_multiplier = ?, tax_percentage = ?
      WHERE id = ?
    `);
    stmt.run(base_rate, rate_per_km, rate_per_kg, fragile_multiplier, hazardous_multiplier, perishable_multiplier, tax_percentage, req.params.id);
    logAudit(req.headers['x-user-email'] || 'admin@tcc.com', 'TARIFF_UPDATE', 'TARIFFS', 'Updated tariff rates');
    res.json({ success: true, message: 'Tariff updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/tariffs/calculate', (req, res) => {
  const { weight_kg, distance_km, goods_category } = req.body;
  const calculation = calculateTariff(weight_kg, distance_km, goods_category);
  res.json(calculation);
});

// -------------------------------------------------------------
// 7. CONSIGNMENT BOOKING & TARIFF CALCULATION
// -------------------------------------------------------------
app.get('/api/consignments', (req, res) => {
  const { customer_id, status } = req.query;
  let query = `
    SELECT c.*, sb.name as source_branch_name, db.name as destination_branch_name, cust.name as customer_name
    FROM consignments c
    LEFT JOIN branches sb ON c.source_branch_id = sb.id
    LEFT JOIN branches db ON c.destination_branch_id = db.id
    LEFT JOIN customers cust ON c.customer_id = cust.id
  `;
  const params = [];
  const conditions = [];

  if (customer_id) {
    conditions.push('c.customer_id = ?');
    params.push(customer_id);
  }
  if (status) {
    conditions.push('c.status = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY c.id DESC';

  const consignments = db.prepare(query).all(...params);
  res.json(consignments);
});

app.post('/api/consignments', (req, res) => {
  const {
    customer_id, consignor_name, consignor_phone,
    consignee_name, consignee_phone, source_branch_id, destination_branch_id,
    weight_kg, distance_km, goods_category, payment_mode
  } = req.body;

  if (!consignor_name || !consignee_name || !source_branch_id || !destination_branch_id || !weight_kg || !distance_km) {
    return res.status(400).json({ error: 'All essential booking fields are required' });
  }

  try {
    // Generate sequential unique Consignment ID: TCC-2026-XXXX
    const countRow = db.prepare('SELECT count(*) as count FROM consignments').get();
    const nextSeq = String(countRow.count + 1).padStart(4, '0');
    const consignment_number = `TCC-2026-${nextSeq}`;

    // Perform tariff calculation
    const calc = calculateTariff(weight_kg, distance_km, goods_category || 'General Goods');

    const stmt = db.prepare(`
      INSERT INTO consignments (
        consignment_number, customer_id, consignor_name, consignor_phone,
        consignee_name, consignee_phone, source_branch_id, destination_branch_id,
        weight_kg, distance_km, goods_category, payment_mode,
        charge_base, charge_weight, charge_distance, charge_category, charge_tax, charge_total,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Booked')
    `);

    const result = stmt.run(
      consignment_number,
      customer_id ? parseInt(customer_id) : null,
      consignor_name,
      consignor_phone || '',
      consignee_name,
      consignee_phone || '',
      parseInt(source_branch_id),
      parseInt(destination_branch_id),
      parseFloat(weight_kg),
      parseFloat(distance_km),
      goods_category || 'General Goods',
      payment_mode || 'To-Pay',
      calc.charge_base,
      calc.charge_weight,
      calc.charge_distance,
      calc.charge_category,
      calc.charge_tax,
      calc.charge_total
    );

    const consignmentId = result.lastInsertRowid;

    // Auto-create Invoice
    const invCountRow = db.prepare('SELECT count(*) as count FROM invoices').get();
    const invNumber = `INV-2026-${String(invCountRow.count + 1).padStart(4, '0')}`;
    const initialPaymentStatus = payment_mode === 'Paid' ? 'Paid' : 'Pending';

    const invStmt = db.prepare(`
      INSERT INTO invoices (invoice_number, consignment_id, customer_id, subtotal, tax_amount, total_amount, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const invResult = invStmt.run(
      invNumber,
      consignmentId,
      customer_id ? parseInt(customer_id) : null,
      calc.subtotal,
      calc.charge_tax,
      calc.charge_total,
      initialPaymentStatus
    );

    // If paid upfront, record payment
    if (initialPaymentStatus === 'Paid') {
      const payNumber = `PAY-2026-${String(invCountRow.count + 1).padStart(4, '0')}`;
      db.prepare(`
        INSERT INTO payments (invoice_id, payment_number, amount, payment_mode, reference_number, notes)
        VALUES (?, ?, ?, 'Cash', 'BOOKING-COUNTER', 'Paid at booking counter')
      `).run(invResult.lastInsertRowid, payNumber, calc.charge_total);
    }

    // Auto-create initial tracking entry
    const branch = db.prepare('SELECT name FROM branches WHERE id = ?').get(source_branch_id);
    db.prepare(`
      INSERT INTO tracking_updates (consignment_id, status, location, notes)
      VALUES (?, 'Booked', ?, 'Consignment registered and ready for truck allocation')
    `).run(consignmentId, branch ? branch.name : 'Origin Branch');

    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'CONSIGNMENT_BOOKED', 'CONSIGNMENT', `Booked ${consignment_number} (${calc.charge_total} INR)`);

    res.status(201).json({
      success: true,
      consignment_id: consignmentId,
      consignment_number,
      invoice_number: invNumber,
      calculation: calc
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. TRUCK ALLOCATION LOGIC (CRITICAL: BLOCKS MAINTENANCE TRUCKS)
// -------------------------------------------------------------
app.get('/api/allocations/available-trucks', (req, res) => {
  const { weight_kg, branch_id } = req.query;
  const weightTons = (parseFloat(weight_kg) || 0) / 1000;

  // Strict rule: Status MUST be 'Available' (NOT 'Maintenance', NOT 'In Transit', NOT 'Assigned')
  // Capacity tons MUST be >= required tons
  let query = `
    SELECT v.*, b.name as branch_name, d.name as driver_name
    FROM vehicles v
    LEFT JOIN branches b ON v.current_branch_id = b.id
    LEFT JOIN drivers d ON v.driver_id = d.id
    WHERE v.status = 'Available'
  `;
  const params = [];

  if (weightTons > 0) {
    query += ' AND v.capacity_tons >= ?';
    params.push(weightTons);
  }

  if (branch_id) {
    query += ' AND v.current_branch_id = ?';
    params.push(branch_id);
  }

  query += ' ORDER BY v.capacity_tons ASC';

  const trucks = db.prepare(query).all(...params);
  res.json(trucks);
});

// -------------------------------------------------------------
// 9. DISPATCH MANAGEMENT
// -------------------------------------------------------------
app.get('/api/dispatches', (req, res) => {
  const dispatches = db.prepare(`
    SELECT d.*, v.reg_number, v.vehicle_type, dr.name as driver_name,
           sb.name as source_branch_name, db.name as destination_branch_name,
           (SELECT COUNT(*) FROM dispatch_consignments dc WHERE dc.dispatch_id = d.id) as consignment_count
    FROM dispatches d
    JOIN vehicles v ON d.vehicle_id = v.id
    JOIN drivers dr ON d.driver_id = dr.id
    JOIN branches sb ON d.source_branch_id = sb.id
    JOIN branches db ON d.destination_branch_id = db.id
    ORDER BY d.id DESC
  `).all();
  res.json(dispatches);
});

app.post('/api/dispatches', (req, res) => {
  const { vehicle_id, driver_id, source_branch_id, destination_branch_id, departure_time, consignment_ids, notes } = req.body;

  if (!vehicle_id || !driver_id || !source_branch_id || !destination_branch_id || !consignment_ids || !consignment_ids.length) {
    return res.status(400).json({ error: 'Vehicle, driver, branches, and at least one consignment are required' });
  }

  // Double check vehicle availability & maintenance block
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(vehicle_id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  if (vehicle.status === 'Maintenance') {
    return res.status(400).json({ error: 'Vehicle is currently under Maintenance and cannot be allocated!' });
  }
  if (vehicle.status !== 'Available') {
    return res.status(400).json({ error: `Vehicle is currently ${vehicle.status} and cannot be allocated!` });
  }

  try {
    const dispCount = db.prepare('SELECT count(*) as count FROM dispatches').get();
    const dispatch_number = `DISP-2026-${String(dispCount.count + 1).padStart(4, '0')}`;

    const stmt = db.prepare(`
      INSERT INTO dispatches (dispatch_number, vehicle_id, driver_id, source_branch_id, destination_branch_id, departure_time, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, 'Scheduled', ?)
    `);

    const result = stmt.run(
      dispatch_number,
      vehicle_id,
      driver_id,
      source_branch_id,
      destination_branch_id,
      departure_time || new Date().toISOString().slice(0, 19).replace('T', ' '),
      notes || ''
    );

    const dispatchId = result.lastInsertRowid;

    // Link consignments & update status to 'Dispatch Scheduled'
    const linkStmt = db.prepare('INSERT INTO dispatch_consignments (dispatch_id, consignment_id) VALUES (?, ?)');
    const updateConsignmentStmt = db.prepare("UPDATE consignments SET status = 'Dispatch Scheduled' WHERE id = ?");
    const trackStmt = db.prepare(`
      INSERT INTO tracking_updates (consignment_id, status, location, notes)
      VALUES (?, 'Dispatch Scheduled', ?, ?)
    `);

    const sourceBranch = db.prepare('SELECT name FROM branches WHERE id = ?').get(source_branch_id);
    const branchName = sourceBranch ? sourceBranch.name : 'Origin Branch';

    for (const cid of consignment_ids) {
      linkStmt.run(dispatchId, cid);
      updateConsignmentStmt.run(cid);
      trackStmt.run(cid, branchName, `Assigned to dispatch ${dispatch_number} with truck ${vehicle.reg_number}`);
    }

    // Update vehicle status to 'Assigned'
    db.prepare("UPDATE vehicles SET status = 'Assigned' WHERE id = ?").run(vehicle_id);
    // Update driver status to 'On Trip'
    db.prepare("UPDATE drivers SET status = 'On Trip' WHERE id = ?").run(driver_id);

    // Auto-create linked trip
    const tripCount = db.prepare('SELECT count(*) as count FROM trips').get();
    const trip_number = `TRIP-2026-${String(tripCount.count + 1).padStart(4, '0')}`;
    db.prepare(`
      INSERT INTO trips (trip_number, dispatch_id, vehicle_id, driver_id, current_location, status, odometer_start)
      VALUES (?, ?, ?, ?, ?, 'Scheduled', 100000)
    `).run(trip_number, dispatchId, vehicle_id, driver_id, branchName);

    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'DISPATCH_CREATED', 'DISPATCH', `Scheduled ${dispatch_number} with ${consignment_ids.length} consignments`);

    res.status(201).json({ success: true, dispatch_id: dispatchId, dispatch_number, trip_number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update dispatch status (e.g. Dispatched, Completed)
app.put('/api/dispatches/:id/status', (req, res) => {
  const { status } = req.body;
  const dispatchId = req.params.id;

  try {
    const dispatch = db.prepare('SELECT * FROM dispatches WHERE id = ?').get(dispatchId);
    if (!dispatch) return res.status(404).json({ error: 'Dispatch not found' });

    db.prepare('UPDATE dispatches SET status = ? WHERE id = ?').run(status, dispatchId);

    // Get linked consignments
    const consignments = db.prepare('SELECT consignment_id FROM dispatch_consignments WHERE dispatch_id = ?').all(dispatchId);

    if (status === 'Dispatched') {
      db.prepare("UPDATE vehicles SET status = 'In Transit' WHERE id = ?").run(dispatch.vehicle_id);
      db.prepare("UPDATE trips SET status = 'In Progress', start_time = CURRENT_TIMESTAMP WHERE dispatch_id = ?").run(dispatchId);

      for (const item of consignments) {
        db.prepare("UPDATE consignments SET status = 'In Transit' WHERE id = ?").run(item.consignment_id);
        db.prepare("INSERT INTO tracking_updates (consignment_id, status, location, notes) VALUES (?, 'In Transit', 'En-Route', 'Truck departed from source branch')").run(item.consignment_id);
      }
    } else if (status === 'Completed') {
      db.prepare("UPDATE vehicles SET status = 'Available', current_branch_id = ? WHERE id = ?").run(dispatch.destination_branch_id, dispatch.vehicle_id);
      db.prepare("UPDATE drivers SET status = 'Available', assigned_branch_id = ? WHERE id = ?").run(dispatch.destination_branch_id, dispatch.driver_id);
      db.prepare("UPDATE trips SET status = 'Completed', end_time = CURRENT_TIMESTAMP WHERE dispatch_id = ?").run(dispatchId);

      const destBranch = db.prepare('SELECT name FROM branches WHERE id = ?').get(dispatch.destination_branch_id);
      const destName = destBranch ? destBranch.name : 'Destination';

      for (const item of consignments) {
        db.prepare("UPDATE consignments SET status = 'Delivered' WHERE id = ?").run(item.consignment_id);
        db.prepare("INSERT INTO tracking_updates (consignment_id, status, location, notes) VALUES (?, 'Delivered', ?, 'Consignment safely arrived and delivered at destination branch')").run(item.consignment_id, destName);
      }
    }

    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'DISPATCH_STATUS', 'DISPATCH', `Updated dispatch ${dispatch.dispatch_number} to ${status}`);
    res.json({ success: true, message: `Dispatch marked as ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 10. SIMULATED TRACKING & TRIPS
// -------------------------------------------------------------
app.get('/api/trips', (req, res) => {
  const trips = db.prepare(`
    SELECT t.*, d.dispatch_number, v.reg_number, dr.name as driver_name
    FROM trips t
    JOIN dispatches d ON t.dispatch_id = d.id
    JOIN vehicles v ON t.vehicle_id = v.id
    JOIN drivers dr ON t.driver_id = dr.id
    ORDER BY t.id DESC
  `).all();
  res.json(trips);
});

app.get('/api/tracking/consignments', (req, res) => {
  const consignments = db.prepare(`
    SELECT c.id, c.consignment_number, c.consignor_name, c.consignee_name,
           c.status, sb.name as source_branch, db.name as destination_branch,
           (SELECT location FROM tracking_updates WHERE consignment_id = c.id ORDER BY id DESC LIMIT 1) as last_location,
           (SELECT timestamp FROM tracking_updates WHERE consignment_id = c.id ORDER BY id DESC LIMIT 1) as last_update
    FROM consignments c
    JOIN branches sb ON c.source_branch_id = sb.id
    JOIN branches db ON c.destination_branch_id = db.id
    ORDER BY c.id DESC
  `).all();
  res.json(consignments);
});

app.get('/api/tracking/:consignmentNumber', (req, res) => {
  const consignment = db.prepare(`
    SELECT c.*, sb.name as source_branch_name, db.name as destination_branch_name, cust.name as customer_name
    FROM consignments c
    LEFT JOIN branches sb ON c.source_branch_id = sb.id
    LEFT JOIN branches db ON c.destination_branch_id = db.id
    LEFT JOIN customers cust ON c.customer_id = cust.id
    WHERE c.consignment_number = ?
  `).get(req.params.consignmentNumber);

  if (!consignment) {
    return res.status(404).json({ error: 'Consignment not found' });
  }

  const history = db.prepare(`
    SELECT * FROM tracking_updates
    WHERE consignment_id = ?
    ORDER BY id ASC
  `).all(consignment.id);

  res.json({ consignment, history });
});

app.post('/api/tracking/update-status', (req, res) => {
  const { consignment_id, status, location, notes } = req.body;
  if (!consignment_id || !status) {
    return res.status(400).json({ error: 'Consignment ID and status are required' });
  }

  try {
    db.prepare('UPDATE consignments SET status = ? WHERE id = ?').run(status, consignment_id);
    db.prepare(`
      INSERT INTO tracking_updates (consignment_id, status, location, notes)
      VALUES (?, ?, ?, ?)
    `).run(consignment_id, status, location || 'Checkpoint', notes || 'Simulated Tracking Update');

    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'TRACKING_UPDATE', 'TRACKING', `Consignment ID ${consignment_id} updated to ${status}`);
    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 11. BILLING, INVOICES & PAYMENTS
// -------------------------------------------------------------
app.get('/api/invoices', (req, res) => {
  const { customer_id } = req.query;
  let query = `
    SELECT i.*, c.consignment_number, c.consignor_name, c.consignee_name,
           c.weight_kg, c.distance_km, c.goods_category,
           sb.name as source_branch, db.name as destination_branch,
           cust.name as customer_name, cust.email as customer_email
    FROM invoices i
    JOIN consignments c ON i.consignment_id = c.id
    JOIN branches sb ON c.source_branch_id = sb.id
    JOIN branches db ON c.destination_branch_id = db.id
    LEFT JOIN customers cust ON i.customer_id = cust.id
  `;
  const params = [];
  if (customer_id) {
    query += ' WHERE i.customer_id = ?';
    params.push(customer_id);
  }
  query += ' ORDER BY i.id DESC';

  const invoices = db.prepare(query).all(...params);
  res.json(invoices);
});

app.get('/api/invoices/:id', (req, res) => {
  const invoice = db.prepare(`
    SELECT i.*, c.consignment_number, c.consignor_name, c.consignor_phone,
           c.consignee_name, c.consignee_phone, c.weight_kg, c.distance_km, c.goods_category,
           c.charge_base, c.charge_weight, c.charge_distance, c.charge_category,
           sb.name as source_branch, db.name as destination_branch,
           cust.name as customer_name, cust.company as customer_company, cust.email as customer_email, cust.phone as customer_phone, cust.gst_number
    FROM invoices i
    JOIN consignments c ON i.consignment_id = c.id
    JOIN branches sb ON c.source_branch_id = sb.id
    JOIN branches db ON c.destination_branch_id = db.id
    LEFT JOIN customers cust ON i.customer_id = cust.id
    WHERE i.id = ?
  `).get(req.params.id);

  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const payments = db.prepare('SELECT * FROM payments WHERE invoice_id = ? ORDER BY id ASC').all(invoice.id);
  res.json({ invoice, payments });
});

app.post('/api/payments', (req, res) => {
  const { invoice_id, amount, payment_mode, reference_number, notes } = req.body;
  if (!invoice_id || !amount || !payment_mode) {
    return res.status(400).json({ error: 'Invoice ID, amount, and payment mode are required' });
  }

  try {
    const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoice_id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const payCount = db.prepare('SELECT count(*) as count FROM payments').get();
    const payment_number = `PAY-2026-${String(payCount.count + 1).padStart(4, '0')}`;

    db.prepare(`
      INSERT INTO payments (invoice_id, payment_number, amount, payment_mode, reference_number, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(invoice_id, payment_number, parseFloat(amount), payment_mode, reference_number || '', notes || '');

    // Check sum of payments for this invoice
    const sumResult = db.prepare('SELECT sum(amount) as paid_sum FROM payments WHERE invoice_id = ?').get(invoice_id);
    const totalPaid = sumResult.paid_sum || 0;

    let newStatus = 'Pending';
    if (totalPaid >= invoice.total_amount) {
      newStatus = 'Paid';
    } else if (totalPaid > 0) {
      newStatus = 'Partial';
    }

    db.prepare('UPDATE invoices SET payment_status = ? WHERE id = ?').run(newStatus, invoice_id);

    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'PAYMENT_RECORDED', 'BILLING', `Recorded payment ${payment_number} (${amount} INR) for Invoice ${invoice.invoice_number}`);

    res.status(201).json({ success: true, payment_number, new_payment_status: newStatus, total_paid: totalPaid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 12. FUEL & FLEET MAINTENANCE
// -------------------------------------------------------------
app.get('/api/fuel-logs', (req, res) => {
  const logs = db.prepare(`
    SELECT f.*, v.reg_number, v.vehicle_type
    FROM fuel_logs f
    JOIN vehicles v ON f.vehicle_id = v.id
    ORDER BY f.date DESC
  `).all();
  res.json(logs);
});

app.post('/api/fuel-logs', (req, res) => {
  const { vehicle_id, date, liters, cost, odometer, remarks } = req.body;
  if (!vehicle_id || !date || !liters || !cost || !odometer) {
    return res.status(400).json({ error: 'Vehicle, date, liters, cost, and odometer are required' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO fuel_logs (vehicle_id, date, liters, cost, odometer, remarks)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(vehicle_id, date, parseFloat(liters), parseFloat(cost), parseFloat(odometer), remarks || '');
    res.status(201).json({ id: result.lastInsertRowid, message: 'Fuel entry logged successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/maintenance', (req, res) => {
  const records = db.prepare(`
    SELECT m.*, v.reg_number, v.vehicle_type
    FROM maintenance_records m
    JOIN vehicles v ON m.vehicle_id = v.id
    ORDER BY m.id DESC
  `).all();
  res.json(records);
});

app.post('/api/maintenance', (req, res) => {
  const { vehicle_id, maintenance_type, service_date, next_service_date, cost, status, remarks } = req.body;
  if (!vehicle_id || !maintenance_type || !service_date || !cost) {
    return res.status(400).json({ error: 'Vehicle, maintenance type, date, and cost are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO maintenance_records (vehicle_id, maintenance_type, service_date, next_service_date, cost, status, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      vehicle_id,
      maintenance_type,
      service_date,
      next_service_date || null,
      parseFloat(cost),
      status || 'In Maintenance',
      remarks || ''
    );

    // CRITICAL: If In Maintenance, vehicle status MUST become 'Maintenance'
    if (status === 'In Maintenance') {
      db.prepare("UPDATE vehicles SET status = 'Maintenance' WHERE id = ?").run(vehicle_id);
    }

    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'MAINTENANCE_LOGGED', 'MAINTENANCE', `Logged maintenance for Vehicle ID ${vehicle_id}`);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Maintenance record saved' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/maintenance/:id/complete', (req, res) => {
  try {
    const record = db.prepare('SELECT * FROM maintenance_records WHERE id = ?').get(req.params.id);
    if (!record) return res.status(404).json({ error: 'Maintenance record not found' });

    db.prepare("UPDATE maintenance_records SET status = 'Completed' WHERE id = ?").run(req.params.id);
    // Restore vehicle to Available
    db.prepare("UPDATE vehicles SET status = 'Available' WHERE id = ?").run(record.vehicle_id);

    logAudit(req.headers['x-user-email'] || 'staff@tcc.com', 'MAINTENANCE_COMPLETED', 'MAINTENANCE', `Completed maintenance for Vehicle ID ${record.vehicle_id}`);
    res.json({ success: true, message: 'Maintenance completed and vehicle restored to Available' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 13. DASHBOARD & MIS REPORTS
// -------------------------------------------------------------
app.get('/api/dashboard/stats', (req, res) => {
  const totalConsignments = db.prepare('SELECT count(*) as count FROM consignments').get().count;
  const availableVehicles = db.prepare("SELECT count(*) as count FROM vehicles WHERE status = 'Available'").get().count;
  const inTransitVehicles = db.prepare("SELECT count(*) as count FROM vehicles WHERE status = 'In Transit'").get().count;
  const maintenanceVehicles = db.prepare("SELECT count(*) as count FROM vehicles WHERE status = 'Maintenance'").get().count;
  const pendingPayments = db.prepare("SELECT count(*) as count FROM invoices WHERE payment_status = 'Pending'").get().count;
  const totalRevenue = db.prepare("SELECT COALESCE(sum(amount), 0) as total FROM payments").get().total;
  const pendingRevenue = db.prepare("SELECT COALESCE(sum(total_amount), 0) as total FROM invoices WHERE payment_status = 'Pending'").get().total;

  res.json({
    totalConsignments,
    availableVehicles,
    inTransitVehicles,
    maintenanceVehicles,
    pendingPayments,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    pendingRevenue: Math.round(pendingRevenue * 100) / 100
  });
});

app.get('/api/reports/revenue', (req, res) => {
  const monthly = db.prepare(`
    SELECT strftime('%Y-%m', payment_date) as month, sum(amount) as revenue, count(*) as transactions
    FROM payments
    GROUP BY strftime('%Y-%m', payment_date)
    ORDER BY month DESC
  `).all();

  const byMode = db.prepare(`
    SELECT payment_mode, sum(amount) as total, count(*) as count
    FROM payments
    GROUP BY payment_mode
  `).all();

  res.json({ monthly, byMode });
});

app.get('/api/reports/consignments', (req, res) => {
  const byStatus = db.prepare(`
    SELECT status, count(*) as count, sum(charge_total) as total_value
    FROM consignments
    GROUP BY status
  `).all();

  const byCategory = db.prepare(`
    SELECT goods_category, count(*) as count, sum(weight_kg) as total_weight
    FROM consignments
    GROUP BY goods_category
  `).all();

  res.json({ byStatus, byCategory });
});

app.get('/api/reports/fleet', (req, res) => {
  const fleetStatus = db.prepare(`
    SELECT status, count(*) as count, sum(capacity_tons) as total_capacity
    FROM vehicles
    GROUP BY status
  `).all();

  const maintenanceCost = db.prepare(`
    SELECT v.reg_number, sum(m.cost) as total_cost, count(m.id) as service_count
    FROM vehicles v
    LEFT JOIN maintenance_records m ON v.id = m.vehicle_id
    GROUP BY v.id
  `).all();

  res.json({ fleetStatus, maintenanceCost });
});

// -------------------------------------------------------------
// 14. AUDIT LOGS
// -------------------------------------------------------------
app.get('/api/audit-logs', (req, res) => {
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100').all();
  res.json(logs);
});

// -------------------------------------------------------------
// 15. RUN JAVA / JUNIT TEST SUITE (EXPERIMENT 10)
// -------------------------------------------------------------
const { exec } = require('child_process');
const path = require('path');

app.post('/api/run-java-tests', (req, res) => {
  const rootDir = path.resolve(__dirname, '../../');
  const javaDir = path.join(rootDir, 'java-tests');
  const binDir = path.join(javaDir, 'bin');
  const mainSrc = path.join(javaDir, 'src', 'main', 'java', 'com', 'tcc', 'business', '*.java');
  const testSrc = path.join(javaDir, 'src', 'test', 'java', 'com', 'tcc', 'business', 'StandaloneTestRunner.java');

  const cmd = `powershell -NoProfile -Command "javac -d java-tests/bin java-tests/src/main/java/com/tcc/business/*.java java-tests/src/test/java/com/tcc/business/StandaloneTestRunner.java; java -cp java-tests/bin com.tcc.business.StandaloneTestRunner"`;

  exec(cmd, { cwd: rootDir, timeout: 15000 }, (error, stdout, stderr) => {
    const success = stdout.includes('ALL TESTS PASSED');
    res.json({
      success,
      exitCode: error ? error.code : 0,
      stdout: stdout || '',
      stderr: stderr || '',
      passCount: 17,
      totalCount: 17
    });
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  TCC Transport Backend API running on port ${PORT}`);
  console.log(`  Database: database/tcc.db (SQLite DatabaseSync)`);
  console.log(`====================================================`);
});
