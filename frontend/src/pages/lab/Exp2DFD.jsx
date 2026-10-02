import React, { useState } from 'react';

export default function Exp2DFD() {
  const [activeSubTab, setActiveSubTab] = useState('dfd1'); // 'dfd0', 'dfd1', 'dict', 'structure'

  const dataDictionary = [
    { name: 'Consignment_ID', type: 'VARCHAR(20)', source: 'Customer / Staff', dest: 'D3 Booking & Dispatch Records', desc: 'Unique sequential alphanumeric tracking identifier', example: 'TCC-2026-0001' },
    { name: 'Consignor_Details', type: 'RECORD', source: 'Customer', dest: 'D3 Booking & Dispatch Records', desc: 'Name, phone number, and origin address of sender', example: 'Metro Retail HQ, +91-9811223344' },
    { name: 'Consignee_Details', type: 'RECORD', source: 'Customer', dest: 'D3 Booking & Dispatch Records', desc: 'Name, phone number, and delivery destination address', example: 'Chandigarh Supermart' },
    { name: 'Weight_Kg', type: 'DECIMAL(10,2)', source: 'Weighing Scale / Staff', dest: 'D3 Booking & Dispatch Records', desc: 'Total cargo mass in kilograms', example: '2400.00' },
    { name: 'Distance_Km', type: 'DECIMAL(10,2)', source: 'Route Table / Staff', dest: 'D3 Booking & Dispatch Records', desc: 'Inter-branch highway distance in kilometers', example: '250.00' },
    { name: 'Goods_Category', type: 'VARCHAR(30)', source: 'Customer', dest: 'D3 Booking & Dispatch Records', desc: 'Cargo classification for tariff multiplier', example: 'Fragile / Perishable' },
    { name: 'Tariff_Rates', type: 'RECORD', source: 'Admin', dest: 'D3 Booking & Dispatch Records', desc: 'Configurable base, per-km, per-kg and tax rates', example: 'Base: 450, Per-km: 10, GST: 18%' },
    { name: 'Freight_Charge', type: 'DECIMAL(10,2)', source: 'Process 6.0 (Billing)', dest: 'D6 Billing & Financial Records', desc: 'Calculated pre-tax freight cost', example: '8950.00' },
    { name: 'Invoice_Number', type: 'VARCHAR(20)', source: 'Process 6.0 (Billing)', dest: 'D6 Billing & Financial Records', desc: 'System-generated unique bill identifier', example: 'INV-2026-0001' },
    { name: 'Vehicle_Reg_No', type: 'VARCHAR(20)', source: 'Admin / Fleet Ops', dest: 'D2 Vehicle & Fleet Records', desc: 'Motor vehicle registration plate number', example: 'DL-01-AX-4412' },
    { name: 'Vehicle_Capacity', type: 'DECIMAL(6,2)', source: 'Admin / Manufacturer', dest: 'D2 Vehicle & Fleet Records', desc: 'Maximum safe haulage capacity in metric tons', example: '16.00 Tons' },
    { name: 'Vehicle_Status', type: 'ENUM', source: 'Process 2.0 / 4.0 / 5.0', dest: 'D2 Vehicle & Fleet Records', desc: 'Current operational state of transport truck', example: 'Available / Maintenance / In Transit' },
    { name: 'Driver_License_No', type: 'VARCHAR(30)', source: 'Driver / Staff', dest: 'D2 Vehicle & Fleet Records', desc: 'Government verified commercial transport license', example: 'DL-042018001234' },
    { name: 'Dispatch_ID', type: 'VARCHAR(20)', source: 'Process 3.0 (Dispatch)', dest: 'D3 Booking & Dispatch Records', desc: 'Unique schedule number for consolidated truck departure', example: 'DISP-2026-0001' },
    { name: 'Trip_Status', type: 'ENUM', source: 'Driver / Staff', dest: 'D4 Trip Records', desc: 'Transit progression state of dispatched truck', example: 'Scheduled / In Progress / Completed' },
    { name: 'Tracking_Location', type: 'VARCHAR(100)', source: 'Staff / Checkpoint', dest: 'D4 Trip Records', desc: 'Simulated geographical milestone checkpoint', example: 'Karnal Toll Plaza (NH-44)' },
    { name: 'Maintenance_Cost', type: 'DECIMAL(10,2)', source: 'Workshop / Staff', dest: 'D5 Fuel & Maintenance Records', desc: 'Incurred service, repairs, or spare parts expenditure', example: '18500.00' },
    { name: 'Payment_Receipt_No', type: 'VARCHAR(20)', source: 'Process 7.0 (Payment)', dest: 'D6 Billing & Financial Records', desc: 'Unique transaction settlement reference', example: 'PAY-2026-0001' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 2: Data Flow Diagrams (DFD Level 0 &amp; Level 1), Data Dictionary &amp; Module Structure Chart
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Strictly preserves 8 Processes (1.0 to 8.0) and 7 Data Stores (D1 to D7) from source engineering specifications
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveSubTab('dfd1')}
          className={`btn ${activeSubTab === 'dfd1' ? 'btn-primary' : 'btn-outline'}`}
        >
          DFD Level 1 (8 Processes &amp; Stores D1-D7)
        </button>
        <button
          onClick={() => setActiveSubTab('dfd0')}
          className={`btn ${activeSubTab === 'dfd0' ? 'btn-primary' : 'btn-outline'}`}
        >
          DFD Level 0
        </button>
        <button
          onClick={() => setActiveSubTab('dict')}
          className={`btn ${activeSubTab === 'dict' ? 'btn-primary' : 'btn-outline'}`}
        >
          Data Dictionary (18 Entries)
        </button>
        <button
          onClick={() => setActiveSubTab('structure')}
          className={`btn ${activeSubTab === 'structure' ? 'btn-primary' : 'btn-outline'}`}
        >
          Module Structure Chart
        </button>
      </div>

      {/* DFD LEVEL 1 VIEW */}
      {activeSubTab === 'dfd1' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">DFD Level 1: Functional Decomposition (8 Processes &amp; 7 Data Stores)</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 960 620" style={{ width: '100%', maxWidth: '940px', height: 'auto' }}>
              <defs>
                <marker id="dfd-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
                </marker>
              </defs>

              {/* EXTERNAL ENTITIES (Rectangles) */}
              {/* Customer */}
              <rect x="20" y="80" width="130" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="85" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">CUSTOMER</text>
              <text x="85" y="132" textAnchor="middle" fontSize="10" fill="#64748b">External Entity</text>

              {/* Driver / Staff */}
              <rect x="810" y="80" width="130" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="875" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">DRIVER / STAFF</text>
              <text x="875" y="132" textAnchor="middle" fontSize="10" fill="#64748b">External Entity</text>

              {/* Administrator */}
              <rect x="415" y="530" width="150" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="490" y="560" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">ADMINISTRATOR</text>
              <text x="490" y="575" textAnchor="middle" fontSize="10" fill="#64748b">External Entity</text>

              {/* PROCESSES (Circles / Ellipses) */}
              {/* 1.0 Customer Registration */}
              <circle cx="250" cy="80" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="250" y="74" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">1.0</text>
              <text x="250" y="88" textAnchor="middle" fontSize="9" fill="#1e293b">Customer</text>
              <text x="250" y="99" textAnchor="middle" fontSize="9" fill="#1e293b">Registration</text>

              {/* 2.0 Vehicle & Driver */}
              <circle cx="730" cy="80" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="730" y="74" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2.0</text>
              <text x="730" y="88" textAnchor="middle" fontSize="9" fill="#1e293b">Vehicle &amp;</text>
              <text x="730" y="99" textAnchor="middle" fontSize="9" fill="#1e293b">Driver Mgmt</text>

              {/* 3.0 Booking & Dispatch */}
              <circle cx="250" cy="230" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="250" y="224" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">3.0</text>
              <text x="250" y="238" textAnchor="middle" fontSize="9" fill="#1e293b">Booking &amp;</text>
              <text x="250" y="249" textAnchor="middle" fontSize="9" fill="#1e293b">Dispatch Mgmt</text>

              {/* 4.0 Trip Tracking */}
              <circle cx="730" cy="230" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="730" y="224" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">4.0</text>
              <text x="730" y="238" textAnchor="middle" fontSize="9" fill="#1e293b">Trip Tracking &amp;</text>
              <text x="730" y="249" textAnchor="middle" fontSize="9" fill="#1e293b">Logistics Mgmt</text>

              {/* 5.0 Fuel & Maintenance */}
              <circle cx="730" cy="380" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="730" y="374" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">5.0</text>
              <text x="730" y="388" textAnchor="middle" fontSize="9" fill="#1e293b">Fuel &amp; Maint.</text>
              <text x="730" y="399" textAnchor="middle" fontSize="9" fill="#1e293b">Management</text>

              {/* 6.0 Billing & Invoicing */}
              <circle cx="250" cy="380" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="250" y="374" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">6.0</text>
              <text x="250" y="388" textAnchor="middle" fontSize="9" fill="#1e293b">Billing &amp;</text>
              <text x="250" y="399" textAnchor="middle" fontSize="9" fill="#1e293b">Invoicing Mgmt</text>

              {/* 7.0 Payment Processing */}
              <circle cx="250" cy="510" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="250" y="504" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">7.0</text>
              <text x="250" y="518" textAnchor="middle" fontSize="9" fill="#1e293b">Payment</text>
              <text x="250" y="529" textAnchor="middle" fontSize="9" fill="#1e293b">Processing</text>

              {/* 8.0 Performance Analysis */}
              <circle cx="730" cy="510" r="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="730" y="504" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">8.0</text>
              <text x="730" y="518" textAnchor="middle" fontSize="9" fill="#1e293b">Performance &amp;</text>
              <text x="730" y="529" textAnchor="middle" fontSize="9" fill="#1e293b">Report Gen</text>

              {/* DATA STORES (Open ended rectangles D1 to D7) */}
              {/* D1 Customer Records */}
              <g transform="translate(420, 60)">
                <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="30" height="36" fill="#f1f5f9" />
                <text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">D1</text>
                <text x="85" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Customer Records</text>
              </g>

              {/* D2 Vehicle & Fleet Records */}
              <g transform="translate(420, 130)">
                <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="30" height="36" fill="#f1f5f9" />
                <text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">D2</text>
                <text x="85" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Vehicle &amp; Fleet</text>
              </g>

              {/* D3 Booking & Dispatch Records */}
              <g transform="translate(420, 200)">
                <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="30" height="36" fill="#f1f5f9" />
                <text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">D3</text>
                <text x="85" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Booking &amp; Dispatch</text>
              </g>

              {/* D4 Trip Records */}
              <g transform="translate(420, 270)">
                <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="30" height="36" fill="#f1f5f9" />
                <text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">D4</text>
                <text x="85" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Trip Records</text>
              </g>

              {/* D5 Fuel & Maintenance */}
              <g transform="translate(420, 340)">
                <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="30" height="36" fill="#f1f5f9" />
                <text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">D5</text>
                <text x="85" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Fuel &amp; Maintenance</text>
              </g>

              {/* D6 Billing & Financial Records */}
              <g transform="translate(420, 410)">
                <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="30" height="36" fill="#f1f5f9" />
                <text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">D6</text>
                <text x="85" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Billing &amp; Finance</text>
              </g>

              {/* D7 Performance Reports */}
              <g transform="translate(420, 480)">
                <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" strokeWidth="1.5" />
                <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" strokeWidth="1.5" />
                <rect x="0" y="0" width="30" height="36" fill="#f1f5f9" />
                <text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">D7</text>
                <text x="85" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">Performance Reports</text>
              </g>

              {/* CONNECTING ARROWS */}
              {/* Customer to 1.0 */}
              <line x1="150" y1="80" x2="208" y2="80" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* 1.0 to D1 */}
              <line x1="292" y1="80" x2="420" y2="78" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />

              {/* Customer to 3.0 Booking */}
              <line x1="100" y1="150" x2="215" y2="210" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* 3.0 to D3 */}
              <line x1="292" y1="225" x2="420" y2="218" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />

              {/* 3.0 to 6.0 */}
              <line x1="250" y1="272" x2="250" y2="338" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* 6.0 to D6 */}
              <line x1="292" y1="380" x2="420" y2="428" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />

              {/* 6.0 to 7.0 Payment */}
              <line x1="250" y1="422" x2="250" y2="468" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* 7.0 to D6 */}
              <line x1="292" y1="510" x2="420" y2="440" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />

              {/* Driver/Staff to 2.0 */}
              <line x1="810" y1="80" x2="772" y2="80" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* 2.0 to D2 */}
              <line x1="688" y1="90" x2="560" y2="140" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />

              {/* Driver/Staff to 4.0 Tracking */}
              <line x1="850" y1="150" x2="765" y2="210" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* 4.0 to D4 */}
              <line x1="688" y1="240" x2="560" y2="280" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />

              {/* Driver/Staff to 5.0 Fuel */}
              <line x1="860" y1="150" x2="765" y2="360" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* 5.0 to D5 */}
              <line x1="688" y1="380" x2="560" y2="355" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />

              {/* 8.0 Reports reads D1-D6, writes D7 */}
              <line x1="688" y1="510" x2="560" y2="498" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
              {/* Admin interacts with 8.0 */}
              <line x1="565" y1="550" x2="695" y2="525" stroke="#0f172a" strokeWidth="1.2" markerEnd="url(#dfd-arrow)" />
            </svg>
          </div>
        </div>
      )}

      {/* DFD LEVEL 0 VIEW */}
      {activeSubTab === 'dfd0' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">DFD Level 0: Global Boundary Process Representation</span>
          </div>
          <div className="panel-body">
            <p style={{ marginBottom: '12px', fontSize: '13px' }}>
              Level 0 encapsulates the entire Transport Company Computerisation System as a unified single process (0.0) communicating directly with external system actors:
            </p>
            <table className="data-table" style={{ marginBottom: '16px' }}>
              <thead>
                <tr><th>External Entity</th><th>Incoming Data Flows (To System)</th><th>Outgoing Data Flows (From System)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Customer</strong></td>
                  <td>Booking Requests, Cargo Specifications, Payment Credentials, Tracking Queries</td>
                  <td>Consignment Notes (TCC-2026-XXXX), GST Invoices, Checkpoint Status Reports</td>
                </tr>
                <tr>
                  <td><strong>Driver / Staff</strong></td>
                  <td>Trip Checkpoint Logs, Odometer Readings, Fuel Slips, Maintenance Job Orders</td>
                  <td>Dispatch Manifests, Route Itinerary, Assigned Vehicle Specifications</td>
                </tr>
                <tr>
                  <td><strong>Administrator</strong></td>
                  <td>Configurable Tariff Rate Cards, Branch Setups, Vehicle Capacity Master Data</td>
                  <td>Aggregated Revenue Summaries, Fleet Capacity Reports, System Audit Trail</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DATA DICTIONARY VIEW */}
      {activeSubTab === 'dict' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Comprehensive Transport Data Dictionary (18 Standardized Items)</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data Item Name</th>
                    <th>Type</th>
                    <th>Source Entity</th>
                    <th>Destination Store</th>
                    <th>Functional Definition</th>
                    <th>Example Value</th>
                  </tr>
                </thead>
                <tbody>
                  {dataDictionary.map((item, idx) => (
                    <tr key={idx}>
                      <td><code>{item.name}</code></td>
                      <td>{item.type}</td>
                      <td>{item.source}</td>
                      <td>{item.dest}</td>
                      <td style={{ fontSize: '12px' }}>{item.desc}</td>
                      <td><span style={{ fontSize: '11px', color: '#0369a1', background: '#e0f2fe', padding: '1px 5px', borderRadius: '3px' }}>{item.example}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE STRUCTURE CHART VIEW */}
      {activeSubTab === 'structure' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Hierarchical Module Structure Chart</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '20px', textAlign: 'center' }}>
            <svg viewBox="0 0 860 380" style={{ width: '100%', maxWidth: '840px', height: 'auto' }}>
              {/* Root Module */}
              <rect x="330" y="20" width="200" height="46" fill="#1e293b" stroke="#0f172a" rx="4" />
              <text x="430" y="48" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">TCC EXECUTIVE SYSTEM</text>

              {/* Lines to Tier 1 Modules */}
              <line x1="430" y1="66" x2="430" y2="95" stroke="#475569" strokeWidth="2" />
              <line x1="110" y1="95" x2="750" y2="95" stroke="#475569" strokeWidth="2" />

              {/* Tier 1 Drops */}
              <line x1="110" y1="95" x2="110" y2="125" stroke="#475569" strokeWidth="2" />
              <line x1="270" y1="95" x2="270" y2="125" stroke="#475569" strokeWidth="2" />
              <line x1="430" y1="95" x2="430" y2="125" stroke="#475569" strokeWidth="2" />
              <line x1="590" y1="95" x2="590" y2="125" stroke="#475569" strokeWidth="2" />
              <line x1="750" y1="95" x2="750" y2="125" stroke="#475569" strokeWidth="2" />

              {/* Tier 1 Modules */}
              <rect x="30" y="125" width="160" height="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="3" />
              <text x="110" y="151" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">1.0 User &amp; Master Data</text>

              <rect x="190" y="125" width="160" height="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="3" />
              <text x="270" y="151" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">2.0 Booking &amp; Tariffs</text>

              <rect x="350" y="125" width="160" height="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="3" />
              <text x="430" y="151" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">3.0 Truck &amp; Dispatch</text>

              <rect x="510" y="125" width="160" height="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="3" />
              <text x="590" y="151" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">4.0 Transit &amp; Fleet Maint.</text>

              <rect x="670" y="125" width="160" height="42" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="3" />
              <text x="750" y="151" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">5.0 Billing &amp; MIS</text>

              {/* Sub-functions */}
              <g fontSize="10" fill="#475569" textAnchor="middle">
                {/* 1.0 children */}
                <rect x="35" y="195" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="110" y="212">Auth &amp; Customer Records</text>
                <rect x="35" y="230" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="110" y="247">Branch &amp; Driver Network</text>

                {/* 2.0 children */}
                <rect x="195" y="195" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="270" y="212">Auto ID Generator</text>
                <rect x="195" y="230" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="270" y="247">Dynamic Tariff Engine</text>

                {/* 3.0 children */}
                <rect x="355" y="195" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="430" y="212">Capacity Allocator</text>
                <rect x="355" y="230" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="430" y="247">Consolidated Dispatch</text>

                {/* 4.0 children */}
                <rect x="515" y="195" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="590" y="212">Simulated Checkpoints</text>
                <rect x="515" y="230" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="590" y="247">Maintenance Lockout</text>

                {/* 5.0 children */}
                <rect x="675" y="195" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="750" y="212">GST Invoicing &amp; Print</text>
                <rect x="675" y="230" width="150" height="26" fill="#f1f5f9" stroke="#cbd5e1" />
                <text x="750" y="247">Revenue &amp; Audit Logs</text>
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
