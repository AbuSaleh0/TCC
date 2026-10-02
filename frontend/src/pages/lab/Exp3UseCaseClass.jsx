import React, { useState } from 'react';

export default function Exp3UseCaseClass() {
  const [activeTab, setActiveTab] = useState('usecase'); // 'usecase' or 'class'

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 3: Use Case Diagram &amp; Domain Class Diagram
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Actors: Customer, Driver/Staff, Administrator &bull; Structural modeling directly corresponding to actual system entities
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('usecase')}
          className={`btn ${activeTab === 'usecase' ? 'btn-primary' : 'btn-outline'}`}
        >
          Use Case Diagram
        </button>
        <button
          onClick={() => setActiveTab('class')}
          className={`btn ${activeTab === 'class' ? 'btn-primary' : 'btn-outline'}`}
        >
          Domain Class Diagram
        </button>
      </div>

      {activeTab === 'usecase' ? (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">System Use Case Diagram</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 920 540" style={{ width: '100%', maxWidth: '900px', height: 'auto' }}>
              {/* Boundary Box */}
              <rect x="220" y="20" width="480" height="500" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" rx="8" />
              <text x="460" y="45" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">Transport Company Computerisation System</text>

              {/* ACTOR 1: CUSTOMER (Left Top) */}
              <g transform="translate(60, 90)">
                <circle cx="40" cy="20" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="34" x2="40" y2="70" stroke="#0f172a" strokeWidth="2" />
                <line x1="15" y1="46" x2="65" y2="46" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="70" x2="20" y2="105" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="70" x2="60" y2="105" stroke="#0f172a" strokeWidth="2" />
                <text x="40" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">CUSTOMER</text>
              </g>

              {/* ACTOR 2: DRIVER / STAFF (Right Top) */}
              <g transform="translate(780, 90)">
                <circle cx="40" cy="20" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="34" x2="40" y2="70" stroke="#0f172a" strokeWidth="2" />
                <line x1="15" y1="46" x2="65" y2="46" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="70" x2="20" y2="105" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="70" x2="60" y2="105" stroke="#0f172a" strokeWidth="2" />
                <text x="40" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">DRIVER / STAFF</text>
              </g>

              {/* ACTOR 3: ADMINISTRATOR (Left Bottom) */}
              <g transform="translate(60, 340)">
                <circle cx="40" cy="20" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="34" x2="40" y2="70" stroke="#0f172a" strokeWidth="2" />
                <line x1="15" y1="46" x2="65" y2="46" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="70" x2="20" y2="105" stroke="#0f172a" strokeWidth="2" />
                <line x1="40" y1="70" x2="60" y2="105" stroke="#0f172a" strokeWidth="2" />
                <text x="40" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">ADMINISTRATOR</text>
              </g>

              {/* USE CASES (Ellipses) */}
              {/* UC1: Login */}
              <ellipse cx="460" cy="80" rx="90" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="460" y="85" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Role-Based Login</text>

              {/* UC2: Book Consignment */}
              <ellipse cx="360" cy="145" rx="95" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="360" y="150" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Book Consignment</text>

              {/* UC3: Track Consignment */}
              <ellipse cx="360" cy="210" rx="95" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="360" y="215" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Track Consignment</text>

              {/* UC4: Allocate Truck */}
              <ellipse cx="560" cy="145" rx="95" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="560" y="150" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Allocate Truck &amp; Dispatch</text>

              {/* UC5: Update Transit Checkpoint */}
              <ellipse cx="560" cy="210" rx="95" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="560" y="215" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Update Transit Status</text>

              {/* UC6: Log Fuel & Maintenance */}
              <ellipse cx="560" cy="275" rx="95" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="560" y="280" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Log Fuel &amp; Maintenance</text>

              {/* UC7: Generate Invoice & Payment */}
              <ellipse cx="360" cy="275" rx="95" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="360" y="280" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Settle Freight Bill</text>

              {/* UC8: Manage Fleet & Tariffs */}
              <ellipse cx="460" cy="355" rx="100" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="460" y="360" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">Manage Fleet &amp; Tariffs</text>

              {/* UC9: View Analytical Reports */}
              <ellipse cx="460" cy="425" rx="100" ry="24" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.5" />
              <text x="460" y="430" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">View Reports &amp; Audit Logs</text>

              {/* ASSOCIATIONS (Lines) */}
              {/* Customer lines */}
              <line x1="120" y1="130" x2="370" y2="85" stroke="#334155" strokeWidth="1.2" />
              <line x1="120" y1="140" x2="265" y2="145" stroke="#334155" strokeWidth="1.2" />
              <line x1="120" y1="150" x2="265" y2="210" stroke="#334155" strokeWidth="1.2" />
              <line x1="120" y1="160" x2="270" y2="270" stroke="#334155" strokeWidth="1.2" />

              {/* Driver/Staff lines */}
              <line x1="800" y1="130" x2="550" y2="85" stroke="#334155" strokeWidth="1.2" />
              <line x1="800" y1="140" x2="655" y2="145" stroke="#334155" strokeWidth="1.2" />
              <line x1="800" y1="150" x2="655" y2="210" stroke="#334155" strokeWidth="1.2" />
              <line x1="800" y1="160" x2="655" y2="270" stroke="#334155" strokeWidth="1.2" />

              {/* Admin lines */}
              <line x1="120" y1="390" x2="400" y2="95" stroke="#334155" strokeWidth="1.2" />
              <line x1="120" y1="400" x2="360" y2="355" stroke="#334155" strokeWidth="1.2" />
              <line x1="120" y1="410" x2="360" y2="425" stroke="#334155" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">System Domain Class Diagram</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 940 560" style={{ width: '100%', maxWidth: '920px', height: 'auto' }}>
              {/* Class: Consignment */}
              <g transform="translate(30, 30)">
                <rect x="0" y="0" width="220" height="210" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="220" height="28" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text x="110" y="19" textAnchor="middle" fontSize="12" fontWeight="bold">Consignment</text>
                <text x="10" y="48" fontSize="10" fill="#334155">- id: int</text>
                <text x="10" y="64" fontSize="10" fill="#334155">- consignmentNumber: String</text>
                <text x="10" y="80" fontSize="10" fill="#334155">- weightKg: double</text>
                <text x="10" y="96" fontSize="10" fill="#334155">- distanceKm: double</text>
                <text x="10" y="112" fontSize="10" fill="#334155">- goodsCategory: String</text>
                <text x="10" y="128" fontSize="10" fill="#334155">- status: ConsignmentStatus</text>
                <line x1="0" y1="138" x2="220" y2="138" stroke="#cbd5e1" />
                <text x="10" y="156" fontSize="10" fill="#0369a1">+ calculateCharge(): double</text>
                <text x="10" y="172" fontSize="10" fill="#0369a1">+ updateStatus(status): void</text>
                <text x="10" y="188" fontSize="10" fill="#0369a1">+ getInvoice(): Invoice</text>
              </g>

              {/* Class: Vehicle */}
              <g transform="translate(360, 30)">
                <rect x="0" y="0" width="220" height="190" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="220" height="28" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text x="110" y="19" textAnchor="middle" fontSize="12" fontWeight="bold">Vehicle</text>
                <text x="10" y="48" fontSize="10" fill="#334155">- id: int</text>
                <text x="10" y="64" fontSize="10" fill="#334155">- regNumber: String</text>
                <text x="10" y="80" fontSize="10" fill="#334155">- capacityTons: double</text>
                <text x="10" y="96" fontSize="10" fill="#334155">- status: VehicleStatus</text>
                <text x="10" y="112" fontSize="10" fill="#334155">- currentBranchId: int</text>
                <line x1="0" y1="122" x2="220" y2="122" stroke="#cbd5e1" />
                <text x="10" y="140" fontSize="10" fill="#0369a1">+ isAllocatable(weight): bool</text>
                <text x="10" y="156" fontSize="10" fill="#0369a1">+ lockForMaintenance(): void</text>
                <text x="10" y="172" fontSize="10" fill="#0369a1">+ releaseToAvailable(): void</text>
              </g>

              {/* Class: Dispatch */}
              <g transform="translate(690, 30)">
                <rect x="0" y="0" width="220" height="180" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="220" height="28" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text x="110" y="19" textAnchor="middle" fontSize="12" fontWeight="bold">Dispatch</text>
                <text x="10" y="48" fontSize="10" fill="#334155">- id: int</text>
                <text x="10" y="64" fontSize="10" fill="#334155">- dispatchNumber: String</text>
                <text x="10" y="80" fontSize="10" fill="#334155">- departureTime: DateTime</text>
                <text x="10" y="96" fontSize="10" fill="#334155">- status: DispatchStatus</text>
                <line x1="0" y1="108" x2="220" y2="108" stroke="#cbd5e1" />
                <text x="10" y="126" fontSize="10" fill="#0369a1">+ addConsignment(c): void</text>
                <text x="10" y="142" fontSize="10" fill="#0369a1">+ markDispatched(): void</text>
                <text x="10" y="158" fontSize="10" fill="#0369a1">+ completeDelivery(): void</text>
              </g>

              {/* Class: Invoice */}
              <g transform="translate(30, 300)">
                <rect x="0" y="0" width="220" height="180" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="220" height="28" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text x="110" y="19" textAnchor="middle" fontSize="12" fontWeight="bold">Invoice</text>
                <text x="10" y="48" fontSize="10" fill="#334155">- invoiceNumber: String</text>
                <text x="10" y="64" fontSize="10" fill="#334155">- subtotal: double</text>
                <text x="10" y="80" fontSize="10" fill="#334155">- taxAmount: double</text>
                <text x="10" y="96" fontSize="10" fill="#334155">- totalAmount: double</text>
                <text x="10" y="112" fontSize="10" fill="#334155">- paymentStatus: Status</text>
                <line x1="0" y1="122" x2="220" y2="122" stroke="#cbd5e1" />
                <text x="10" y="140" fontSize="10" fill="#0369a1">+ addPayment(pay): void</text>
                <text x="10" y="156" fontSize="10" fill="#0369a1">+ printBill(): Document</text>
              </g>

              {/* Class: Driver */}
              <g transform="translate(360, 300)">
                <rect x="0" y="0" width="220" height="160" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="220" height="28" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text x="110" y="19" textAnchor="middle" fontSize="12" fontWeight="bold">Driver</text>
                <text x="10" y="48" fontSize="10" fill="#334155">- name: String</text>
                <text x="10" y="64" fontSize="10" fill="#334155">- licenseNumber: String</text>
                <text x="10" y="80" fontSize="10" fill="#334155">- phone: String</text>
                <text x="10" y="96" fontSize="10" fill="#334155">- status: DriverStatus</text>
                <line x1="0" y1="108" x2="220" y2="108" stroke="#cbd5e1" />
                <text x="10" y="126" fontSize="10" fill="#0369a1">+ assignTrip(t): void</text>
                <text x="10" y="142" fontSize="10" fill="#0369a1">+ finishTrip(): void</text>
              </g>

              {/* Class: MaintenanceRecord */}
              <g transform="translate(690, 300)">
                <rect x="0" y="0" width="220" height="170" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="220" height="28" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text x="110" y="19" textAnchor="middle" fontSize="12" fontWeight="bold">MaintenanceRecord</text>
                <text x="10" y="48" fontSize="10" fill="#334155">- vehicleId: int</text>
                <text x="10" y="64" fontSize="10" fill="#334155">- maintenanceType: String</text>
                <text x="10" y="80" fontSize="10" fill="#334155">- cost: double</text>
                <text x="10" y="96" fontSize="10" fill="#334155">- status: String</text>
                <line x1="0" y1="108" x2="220" y2="108" stroke="#cbd5e1" />
                <text x="10" y="126" fontSize="10" fill="#0369a1">+ triggerLockout(): void</text>
                <text x="10" y="142" fontSize="10" fill="#0369a1">+ resolveAndRestore(): void</text>
              </g>

              {/* RELATIONSHIP LINES */}
              {/* Consignment 1 --- 1 Invoice */}
              <line x1="140" y1="240" x2="140" y2="300" stroke="#0f172a" strokeWidth="1.5" />
              <text x="145" y="270" fontSize="10" fill="#64748b">1 : 1</text>

              {/* Vehicle 1 --- * Dispatch */}
              <line x1="580" y1="100" x2="690" y2="100" stroke="#0f172a" strokeWidth="1.5" />
              <text x="635" y="90" fontSize="10" fill="#64748b">1 : *</text>

              {/* Vehicle 1 --- * Maintenance */}
              <line x1="580" y1="160" x2="750" y2="300" stroke="#0f172a" strokeWidth="1.5" />
              <text x="660" y="220" fontSize="10" fill="#64748b">1 : *</text>

              {/* Driver 1 --- * Dispatch */}
              <line x1="580" y1="360" x2="720" y2="210" stroke="#0f172a" strokeWidth="1.5" />
              <text x="660" y="300" fontSize="10" fill="#64748b">1 : *</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
