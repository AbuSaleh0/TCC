const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./connection');

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'tcc_secret_salt_2026', 1000, 32, 'sha256').toString('hex');
}

console.log('--- Initializing TCC Database Schema ---');
const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schemaSql);
console.log('Schema created successfully.');

console.log('--- Seeding Initial Data ---');

// Clear existing tables in reverse dependency order
const clearTables = [
  'payments', 'invoices', 'tracking_updates', 'trips',
  'dispatch_consignments', 'dispatches', 'consignments',
  'fuel_logs', 'maintenance_records', 'vehicles', 'drivers',
  'customers', 'branches', 'tariffs', 'audit_logs', 'users'
];

db.exec('PRAGMA foreign_keys = OFF;');
for (const tbl of clearTables) {
  db.exec(`DELETE FROM ${tbl};`);
  db.exec(`DELETE FROM sqlite_sequence WHERE name='${tbl}';`);
}
db.exec('PRAGMA foreign_keys = ON;');

// 1. Seed Users
const insertUser = db.prepare(`
  INSERT INTO users (username, email, password_hash, role)
  VALUES (?, ?, ?, ?)
`);

insertUser.run('System Administrator', 'admin@tcc.com', hashPassword('Admin@123'), 'ADMIN');
insertUser.run('Operations Staff', 'staff@tcc.com', hashPassword('Staff@123'), 'STAFF');
insertUser.run('Metro Retail Logistics', 'customer@tcc.com', hashPassword('Customer@123'), 'CUSTOMER');
insertUser.run('Apex Electronics', 'apex@customer.com', hashPassword('Customer@123'), 'CUSTOMER');
insertUser.run('National Pharma Corp', 'pharma@customer.com', hashPassword('Customer@123'), 'CUSTOMER');

// 2. Seed Branches
const insertBranch = db.prepare(`
  INSERT INTO branches (branch_code, name, city, address, phone, email)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertBranch.run('BR-DEL-01', 'Central Hub (Delhi)', 'New Delhi', 'Plot 45, Transport Nagar, Delhi', '+91-11-2854001', 'delhi@tcc.com');
insertBranch.run('BR-CHD-02', 'North Terminal (Chandigarh)', 'Chandigarh', 'Industrial Area Phase 2, Chandigarh', '+91-172-265112', 'chandigarh@tcc.com');
insertBranch.run('BR-JAI-03', 'West Depot (Jaipur)', 'Jaipur', 'VKI Area Road 14, Jaipur', '+91-141-233499', 'jaipur@tcc.com');

// 3. Seed Customers
const insertCustomer = db.prepare(`
  INSERT INTO customers (user_id, name, company, email, phone, address, gst_number)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertCustomer.run(3, 'Rajesh Sharma', 'Metro Retail Logistics', 'customer@tcc.com', '+91-9811223344', 'Connaught Place, New Delhi', '07AAAAA0000A1Z5');
insertCustomer.run(4, 'Sunil Mehta', 'Apex Electronics', 'apex@customer.com', '+91-9822334455', 'Sector 18, Noida', '09BBBBB1111B2Z6');
insertCustomer.run(5, 'Dr. Anita Roy', 'National Pharma Corp', 'pharma@customer.com', '+91-9833445566', 'Baddi Industrial Estate, HP', '02CCCCC2222C3Z7');
insertCustomer.run(null, 'Vikram Singh', 'Sunrise Agri Products', 'vikram@sunrise.com', '+91-9844556677', 'Grain Market, Ambala', '06DDDDD3333D4Z8');
insertCustomer.run(null, 'Pooja Verma', 'Verma Textiles', 'pooja@textiles.com', '+91-9855667788', 'Tripolia Bazaar, Jaipur', '08EEEEE4444E5Z9');

// 4. Seed Drivers
const insertDriver = db.prepare(`
  INSERT INTO drivers (name, license_number, phone, assigned_branch_id, status)
  VALUES (?, ?, ?, ?, ?)
`);

insertDriver.run('Ramesh Kumar', 'DL-042018001234', '+91-9711002201', 1, 'Available');
insertDriver.run('Gurpreet Singh', 'CH-012019005678', '+91-9711002202', 2, 'Available');
insertDriver.run('Mahesh Yadav', 'RJ-142020009988', '+91-9711002203', 3, 'Available');
insertDriver.run('Harish Chandra', 'DL-072021003344', '+91-9711002204', 1, 'On Trip');

// 5. Seed Vehicles (Include 1 Maintenance vehicle to demonstrate allocation block)
const insertVehicle = db.prepare(`
  INSERT INTO vehicles (reg_number, vehicle_type, capacity_tons, current_branch_id, status, driver_id)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertVehicle.run('DL-01-AX-4412', 'Heavy Duty Truck (16-Wheeler)', 16.0, 1, 'Available', 1);
insertVehicle.run('HR-26-BY-8831', 'Medium Cargo Truck (10-Wheeler)', 10.0, 1, 'Available', null);
insertVehicle.run('CH-01-TB-1904', 'Light Transport Truck (6-Wheeler)', 5.0, 2, 'Available', 2);
insertVehicle.run('RJ-14-GA-6250', 'Heavy Freight Truck (14-Wheeler)', 14.0, 3, 'In Transit', 4);
insertVehicle.run('DL-03-MZ-9921', 'Medium Freight Truck (10-Wheeler)', 9.0, 1, 'Maintenance', null); // UNDER MAINTENANCE!

// 6. Seed Tariffs
const insertTariff = db.prepare(`
  INSERT INTO tariffs (name, base_rate, rate_per_km, rate_per_kg, fragile_multiplier, hazardous_multiplier, perishable_multiplier, tax_percentage)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertTariff.run('Standard Road Transport Tariff 2026', 450.0, 10.0, 2.5, 1.25, 1.5, 1.35, 18.0);

// 7. Seed Consignments
const insertConsignment = db.prepare(`
  INSERT INTO consignments (
    consignment_number, customer_id, consignor_name, consignor_phone,
    consignee_name, consignee_phone, source_branch_id, destination_branch_id,
    weight_kg, distance_km, goods_category, payment_mode,
    charge_base, charge_weight, charge_distance, charge_category, charge_tax, charge_total,
    status, booking_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertConsignment.run(
  'TCC-2026-0001', 1, 'Metro Retail HQ', '+91-9811223344',
  'Chandigarh Supermart', '+91-9711556677', 1, 2,
  2400, 250, 'General Goods', 'Paid',
  450, 6000, 2500, 0, 1611, 10561,
  'In Transit', '2026-09-29 10:30:00'
);

insertConsignment.run(
  'TCC-2026-0002', 2, 'Apex Electronics', '+91-9822334455',
  'Jaipur Tech Center', '+91-9414002233', 1, 3,
  1200, 280, 'Fragile', 'To-Pay',
  450, 3000, 2800, 1562.5, 1406.25, 9218.75,
  'Booked', '2026-10-01 11:15:00'
);

insertConsignment.run(
  'TCC-2026-0003', 3, 'National Pharma', '+91-9833445566',
  'Delhi Central Hospital Depot', '+91-9811998877', 2, 1,
  850, 250, 'Perishable', 'Paid',
  450, 2125, 2500, 1776.25, 1233.22, 8084.47,
  'Completed', '2026-09-27 09:00:00'
);

insertConsignment.run(
  'TCC-2026-0004', 1, 'Metro Retail Logistics', '+91-9811223344',
  'Jaipur Distribution Hub', '+91-9414221100', 1, 3,
  3500, 280, 'General Goods', 'To-Pay',
  450, 8750, 2800, 0, 2160, 14160,
  'Truck Assigned', '2026-10-01 14:20:00'
);

// 8. Seed Dispatches & Trips
const insertDispatch = db.prepare(`
  INSERT INTO dispatches (dispatch_number, vehicle_id, driver_id, source_branch_id, destination_branch_id, departure_time, status, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertDispatch.run('DISP-2026-0001', 4, 4, 1, 2, '2026-09-29 12:00:00', 'Dispatched', 'Express road run to Chandigarh');
insertDispatch.run('DISP-2026-0002', 1, 1, 2, 1, '2026-09-27 10:00:00', 'Completed', 'Pharma supply drop completed');

const insertDispatchConsignment = db.prepare(`
  INSERT INTO dispatch_consignments (dispatch_id, consignment_id)
  VALUES (?, ?)
`);

insertDispatchConsignment.run(1, 1);
insertDispatchConsignment.run(2, 3);

const insertTrip = db.prepare(`
  INSERT INTO trips (trip_number, dispatch_id, vehicle_id, driver_id, start_time, end_time, current_location, status, odometer_start, odometer_end, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertTrip.run('TRIP-2026-0001', 1, 4, 4, '2026-09-29 12:30:00', null, 'Near Karnal Toll Plaza (NH-44)', 'In Progress', 45200, null, 'En-route to Chandigarh');
insertTrip.run('TRIP-2026-0002', 2, 1, 1, '2026-09-27 10:15:00', '2026-09-27 16:45:00', 'Delhi Central Hub', 'Completed', 112400, 112650, 'Safe delivery completed');

// 9. Seed Tracking Updates
const insertTracking = db.prepare(`
  INSERT INTO tracking_updates (consignment_id, trip_id, status, location, notes, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertTracking.run(1, 1, 'Booked', 'Central Hub (Delhi)', 'Consignment registered and weighed', '2026-09-29 10:30:00');
insertTracking.run(1, 1, 'Truck Assigned', 'Central Hub (Delhi)', 'Assigned to Vehicle RJ-14-GA-6250', '2026-09-29 11:15:00');
insertTracking.run(1, 1, 'Dispatch Scheduled', 'Central Hub (Delhi)', 'Consignment loaded on DISP-2026-0001', '2026-09-29 11:45:00');
insertTracking.run(1, 1, 'In Transit', 'Near Karnal Toll Plaza (NH-44)', 'Passed checkpoint smoothly', '2026-09-29 14:20:00');

insertTracking.run(3, 2, 'Booked', 'North Terminal (Chandigarh)', 'Pharma crates received with temperature control', '2026-09-27 09:00:00');
insertTracking.run(3, 2, 'Truck Assigned', 'North Terminal (Chandigarh)', 'Allocated to Truck DL-01-AX-4412', '2026-09-27 09:30:00');
insertTracking.run(3, 2, 'In Transit', 'Panipat Bypass', 'Midway checkpoint verified', '2026-09-27 13:00:00');
insertTracking.run(3, 2, 'Delivered', 'Delhi Central Hub', 'Delivered and acknowledged by consignee', '2026-09-27 16:45:00');

// 10. Seed Invoices & Payments
const insertInvoice = db.prepare(`
  INSERT INTO invoices (invoice_number, consignment_id, customer_id, subtotal, tax_amount, total_amount, payment_status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertInvoice.run('INV-2026-0001', 1, 1, 8950, 1611, 10561, 'Paid');
insertInvoice.run('INV-2026-0002', 2, 2, 7812.5, 1406.25, 9218.75, 'Pending');
insertInvoice.run('INV-2026-0003', 3, 3, 6851.25, 1233.22, 8084.47, 'Paid');
insertInvoice.run('INV-2026-0004', 4, 1, 12000, 2160, 14160, 'Pending');

const insertPayment = db.prepare(`
  INSERT INTO payments (invoice_id, payment_number, amount, payment_mode, payment_date, reference_number, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertPayment.run(1, 'PAY-2026-0001', 10561, 'Net Banking', '2026-09-29 11:00:00', 'HDFC-TXN-88912', 'Full payment settled');
insertPayment.run(3, 'PAY-2026-0002', 8084.47, 'UPI', '2026-09-27 09:45:00', 'UPI-REF-334411', 'Hospital depot payment cleared');

// 11. Seed Fuel Logs & Maintenance
const insertFuel = db.prepare(`
  INSERT INTO fuel_logs (vehicle_id, date, liters, cost, odometer, remarks)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertFuel.run(1, '2026-09-26', 120, 11400, 112350, 'Full diesel tank at Indian Oil');
insertFuel.run(4, '2026-09-29', 180, 17100, 45180, 'En route refuel at Karnal Highway');

const insertMaintenance = db.prepare(`
  INSERT INTO maintenance_records (vehicle_id, maintenance_type, service_date, next_service_date, cost, status, remarks)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertMaintenance.run(5, 'Engine Overhaul & Brake Shoes', '2026-09-28', '2026-10-05', 18500, 'In Maintenance', 'Parts awaiting replacement, vehicle blocked from allocation');
insertMaintenance.run(1, 'Periodic Oil & Filter Change', '2026-09-15', '2026-11-15', 4500, 'Completed', 'Routine 10,000 km servicing completed smoothly');

// 12. Seed Audit Logs
const insertAudit = db.prepare(`
  INSERT INTO audit_logs (user_email, action, module, description)
  VALUES (?, ?, ?, ?)
`);

insertAudit.run('admin@tcc.com', 'SYSTEM_INIT', 'DATABASE', 'Initial system seeding and table generation completed');
insertAudit.run('staff@tcc.com', 'BOOKING_CREATED', 'CONSIGNMENT', 'Booked consignment TCC-2026-0001 for Metro Retail Logistics');
insertAudit.run('staff@tcc.com', 'TRUCK_ALLOCATED', 'ALLOCATION', 'Allocated vehicle RJ-14-GA-6250 to dispatch DISP-2026-0001');

console.log('Seeding completed successfully!');
console.log('Demo Credentials:');
console.log('  Admin:    admin@tcc.com    / Admin@123');
console.log('  Staff:    staff@tcc.com    / Staff@123');
console.log('  Customer: customer@tcc.com / Customer@123');
