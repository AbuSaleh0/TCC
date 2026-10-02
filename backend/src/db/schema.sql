-- Transport Company Computerisation (TCC) System Schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('ADMIN', 'STAFF', 'CUSTOMER')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branch_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    gst_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    assigned_branch_id INTEGER,
    status TEXT CHECK(status IN ('Available', 'On Trip', 'Off Duty')) DEFAULT 'Available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reg_number TEXT UNIQUE NOT NULL,
    vehicle_type TEXT NOT NULL,
    capacity_tons REAL NOT NULL,
    current_branch_id INTEGER,
    status TEXT CHECK(status IN ('Available', 'Assigned', 'In Transit', 'Idle', 'Maintenance')) DEFAULT 'Available',
    driver_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tariffs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    base_rate REAL NOT NULL DEFAULT 500,
    rate_per_km REAL NOT NULL DEFAULT 12,
    rate_per_kg REAL NOT NULL DEFAULT 2.5,
    fragile_multiplier REAL NOT NULL DEFAULT 1.25,
    hazardous_multiplier REAL NOT NULL DEFAULT 1.5,
    perishable_multiplier REAL NOT NULL DEFAULT 1.3,
    tax_percentage REAL NOT NULL DEFAULT 18,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consignment_number TEXT UNIQUE NOT NULL,
    customer_id INTEGER,
    consignor_name TEXT NOT NULL,
    consignor_phone TEXT NOT NULL,
    consignee_name TEXT NOT NULL,
    consignee_phone TEXT NOT NULL,
    source_branch_id INTEGER NOT NULL,
    destination_branch_id INTEGER NOT NULL,
    weight_kg REAL NOT NULL,
    distance_km REAL NOT NULL,
    goods_category TEXT NOT NULL,
    payment_mode TEXT DEFAULT 'To-Pay',
    charge_base REAL NOT NULL,
    charge_weight REAL NOT NULL,
    charge_distance REAL NOT NULL,
    charge_category REAL NOT NULL,
    charge_tax REAL NOT NULL,
    charge_total REAL NOT NULL,
    status TEXT CHECK(status IN ('Booked', 'Truck Assigned', 'Dispatch Scheduled', 'In Transit', 'Arrived', 'Delivered', 'Completed')) DEFAULT 'Booked',
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (source_branch_id) REFERENCES branches(id),
    FOREIGN KEY (destination_branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS dispatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispatch_number TEXT UNIQUE NOT NULL,
    vehicle_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    source_branch_id INTEGER NOT NULL,
    destination_branch_id INTEGER NOT NULL,
    departure_time DATETIME NOT NULL,
    status TEXT CHECK(status IN ('Scheduled', 'Dispatched', 'Completed', 'Cancelled')) DEFAULT 'Scheduled',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (source_branch_id) REFERENCES branches(id),
    FOREIGN KEY (destination_branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS dispatch_consignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispatch_id INTEGER NOT NULL,
    consignment_id INTEGER NOT NULL,
    FOREIGN KEY (dispatch_id) REFERENCES dispatches(id) ON DELETE CASCADE,
    FOREIGN KEY (consignment_id) REFERENCES consignments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_number TEXT UNIQUE NOT NULL,
    dispatch_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    current_location TEXT,
    status TEXT CHECK(status IN ('Scheduled', 'In Progress', 'Completed')) DEFAULT 'Scheduled',
    odometer_start REAL,
    odometer_end REAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispatch_id) REFERENCES dispatches(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS tracking_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consignment_id INTEGER NOT NULL,
    trip_id INTEGER,
    status TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consignment_id) REFERENCES consignments(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT UNIQUE NOT NULL,
    consignment_id INTEGER UNIQUE NOT NULL,
    customer_id INTEGER,
    subtotal REAL NOT NULL,
    tax_amount REAL NOT NULL,
    total_amount REAL NOT NULL,
    payment_status TEXT CHECK(payment_status IN ('Pending', 'Partial', 'Paid')) DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consignment_id) REFERENCES consignments(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    payment_number TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    payment_mode TEXT CHECK(payment_mode IN ('Cash', 'Net Banking', 'UPI', 'Cheque')) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fuel_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    date DATE NOT NULL,
    liters REAL NOT NULL,
    cost REAL NOT NULL,
    odometer REAL NOT NULL,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS maintenance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    maintenance_type TEXT NOT NULL,
    service_date DATE NOT NULL,
    next_service_date DATE,
    cost REAL NOT NULL,
    status TEXT CHECK(status IN ('In Maintenance', 'Completed')) DEFAULT 'In Maintenance',
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
