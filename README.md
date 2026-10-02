# TCC — Transport Company Automation Software

**Transport Company Computerisation (TCC) System**
Software Engineering Lab Project — CS387

---

## 1. Project Overview

TCC is a web-based automation system for a commercial road freight transport company. It replaces manual paper-based operations with a unified multi-branch platform covering the full freight lifecycle — from customer registration and consignment booking through truck dispatch, trip tracking, billing, and payment collection.

---

## 2. Objectives

- Automate end-to-end freight transport operations across multiple branches
- Enforce business rules (e.g., maintenance vehicles cannot be allocated)
- Auto-generate consignment IDs, invoices, and payment records
- Provide role-based access for Admin, Staff, and Customer users
- Serve as a complete Software Engineering Lab demonstration project (Experiments 1–10)

---

## 3. Main Features

- Customer registration and self-service portal
- Branch network management
- Vehicle and driver fleet management
- Consignment booking with automatic tariff calculation (base rate + weight + distance + category surcharge + GST)
- Truck allocation with capacity matching and maintenance safety lock
- Dispatch scheduling with multi-consignment manifests
- Simulated trip tracking with milestone status updates
- Billing and GST-compliant invoice generation
- Payment recording (Cash, Net Banking, UPI, Cheque) with partial payment support
- Fuel log and maintenance record management
- MIS reports (revenue, consignment status, fleet utilization)
- Immutable audit log trail
- All 10 Software Engineering Lab experiments embedded in the UI

---

## 4. System Modules

| Module | Description |
|---|---|
| Authentication | Login, registration, PBKDF2 password hashing, role-based access |
| Dashboard | Live KPI stats (consignments, fleet status, revenue) |
| Customers | Customer registration and profile management |
| Branches | Branch network CRUD |
| Vehicles | Fleet management with status tracking |
| Drivers | Driver registration and assignment |
| Bookings | Consignment booking with tariff engine |
| Truck Allocation | Capacity-based truck matching, maintenance block |
| Dispatch | Multi-consignment dispatch scheduling |
| Tracking | Consignment milestone tracking |
| Billing | Invoice view, payment recording |
| Fuel & Maintenance | Fuel logs, maintenance records, vehicle status control |
| Reports | Revenue, consignment, and fleet analytics |
| Audit Logs | System-wide action audit trail |
| SE Lab Experiments | Experiments 1–10 embedded as interactive pages |

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3.1, Vite 5.4.11, Vanilla CSS |
| Backend | Node.js 22, Express 4.21.2 |
| Database | SQLite via Node.js built-in `node:sqlite` (DatabaseSync) |
| Authentication | Token-based, PBKDF2 hashing via `node:crypto` |
| Java Testing | Standalone Java + JUnit 5.10.2 (Maven) |
| Concurrent runner | `concurrently` |

> **Required runtime:** Node.js >= 22.x (for `node:sqlite` support), Java >= 17

---

## 6. Project Structure

```
TCC/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.js       # SQLite DatabaseSync connection
│   │   │   ├── schema.sql          # Full database schema (15 tables)
│   │   │   └── seed.js             # Demo data seeder / DB reset
│   │   ├── utils/
│   │   │   ├── tariffEngine.js     # Freight charge calculation logic
│   │   │   └── auditLogger.js      # Audit log writer
│   │   └── server.js               # Express REST API (all routes)
│   └── package.json
├── database/
│   └── tcc.db                      # SQLite database (pre-seeded demo data)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── lab/                # SE Lab Experiments 1–10
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── TruckAllocation.jsx
│   │   │   ├── Dispatch.jsx
│   │   │   ├── Tracking.jsx
│   │   │   ├── Billing.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   ├── Drivers.jsx
│   │   │   ├── Branches.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── FuelMaintenance.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── AuditLogs.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── java-tests/
│   ├── src/
│   │   ├── main/java/com/tcc/business/   # Java business logic classes
│   │   └── test/java/com/tcc/business/   # JUnit 5 test classes + StandaloneTestRunner
│   └── pom.xml
├── dfd akg.docx                    # DFD documentation
├── TCC_Software_Requirements_Specification.pdf
├── package.json                    # Root scripts (concurrently)
├── .gitignore
└── README.md
```

---

## 7. Prerequisites

- **Node.js >= 22.x** (required for `node:sqlite` / `DatabaseSync`)
- **npm** (bundled with Node.js)
- **Java >= 17** and **javac** in system PATH (required for Experiment 10 / Java tests only)

---

## 8. Installation

Install all dependencies from the project root:

```bash
npm run install:all
```

This installs root, backend, and frontend dependencies in one command.

Alternatively, install each manually:

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## 9. How to Start the Project

### Option A — Start both together (recommended)

From the project root:

```bash
npm run dev
```

This starts the backend and frontend concurrently.

### Option B — Start separately

**Backend** (from project root):
```bash
npm run dev:backend
```

**Frontend** (from project root):
```bash
npm run dev:frontend
```

---

## 10. URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173/ |
| Backend API | http://localhost:5000/ |
| Health Check | http://localhost:5000/api/health |

---

## 11. Database

- **Engine:** SQLite, accessed via Node.js built-in `node:sqlite` (DatabaseSync)
- **Location:** `database/tcc.db`
- **Schema:** 15 tables defined in `backend/src/db/schema.sql`
- **Pre-seeded:** The repository includes `database/tcc.db` with demo data ready for immediate use

**To reset the database to demo data:**

```bash
npm run seed
```

This re-runs `backend/src/db/seed.js`, which drops and recreates all tables with fresh demo data.

---

## 12. Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@tcc.com | Admin@123 |
| Staff | staff@tcc.com | Staff@123 |
| Customer | customer@tcc.com | Customer@123 |
| Customer | apex@customer.com | Customer@123 |
| Customer | pharma@customer.com | Customer@123 |

---

## 13. User Roles

| Role | Permissions |
|---|---|
| **ADMIN** | Full access — manage branches, vehicles, drivers, tariffs, view all reports and audit logs |
| **STAFF** | Operational access — create bookings, allocate trucks, manage dispatch, update tracking, record payments |
| **CUSTOMER** | Self-service — view own consignments, track shipments, view own invoices |

---

## 14. Main Workflow

```
Customer Booking
    → Consignment ID Generated (TCC-2026-XXXX)
    → Tariff Calculated (base + weight + distance + category surcharge + GST)
    → Invoice Auto-Created
    → Truck Allocated (capacity match, maintenance vehicles blocked)
    → Dispatch Scheduled (multi-consignment manifest)
    → Trip Started → In Transit
    → Delivered at Destination Branch
    → Payment Recorded
```

---

## 15. Software Engineering Lab Experiments

All 10 experiments are accessible from the **SE Lab** section in the application sidebar.

| # | Experiment |
|---|---|
| 1 | SRS Document + Context Diagram |
| 2 | DFD Level 0 + DFD Level 1 + Data Dictionary + Module Structure Chart |
| 3 | Use Case Diagram + Class Diagram |
| 4 | Sequence Diagram |
| 5 | Communication Diagram |
| 6 | Activity Diagram |
| 7 | State Machine Diagram |
| 8 | Function Point Analysis + Basic COCOMO |
| 9 | Intermediate COCOMO |
| 10 | Java/JUnit Automated Test Suite Execution |

DFD data stores: D1 Customer Records, D2 Vehicle & Fleet Records, D3 Booking & Dispatch Records, D4 Trip Records, D5 Fuel & Maintenance Records, D6 Billing & Financial Records, D7 Performance Reports.

---

## 16. Java/JUnit Testing

The Java test suite is located in `java-tests/`. It uses a standalone runner (no Maven required at runtime).

**Requirements:** `java` and `javac` must be available in the system PATH.

**Run via the application UI:**
Navigate to SE Lab → Experiment 10 and click "Run Java Tests".

**Run manually from the project root:**

```bash
# Compile
javac -d java-tests/bin java-tests/src/main/java/com/tcc/business/*.java java-tests/src/test/java/com/tcc/business/StandaloneTestRunner.java

# Run
java -cp java-tests/bin com.tcc.business.StandaloneTestRunner
```

**Test coverage:** 17 test cases across 4 modules:
- `ChargeCalculation` — tariff and GST calculation
- `TruckAllocation` — capacity matching and maintenance block
- `ConsignmentValidation` — booking input validation
- `COCOMOCalculation` — Basic and Intermediate COCOMO estimation

---

## 17. Troubleshooting

**Backend fails to start with `node:sqlite` error:**
Ensure Node.js version is 22 or higher. Run `node --version` to check.

**Frontend cannot reach the API:**
Ensure the backend is running on port 5000 before starting the frontend. Vite proxies `/api` requests to `http://localhost:5000`.

**Port already in use:**
Kill the process using port 5000 or 5173, then restart.

**Database is empty or missing:**
Run `npm run seed` from the project root to recreate and seed the database.

**Java tests fail with "javac not found":**
Install JDK 17+ and ensure `javac` is in your system PATH. The `java-tests/bin/` output directory will be created automatically on first compile.

---

## 18. Project Status

This is a **Software Engineering Lab academic project** (CS387) demonstrating a complete transport company automation system. It is intended for lab demonstration and manual testing. All 10 SE Lab experiments are implemented and embedded in the application UI.

The system is feature-complete and suitable for demonstration without further development.
