import React from 'react';

export default function Exp1SRS() {
  return (
    <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#1e293b' }}>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 1: Study a Specific Problem, Prepare SRS Document &amp; Draw Context Diagram
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Course: CS387 Software Engineering Laboratory &bull; Reference Standard: IEEE Std 830-1998
        </p>
      </div>

      {/* Context Diagram Card */}
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-header">
          <span className="panel-title">System Context Diagram (Environmental Level 0 Abstraction)</span>
        </div>
        <div className="panel-body" style={{ textAlign: 'center', background: '#f8fafc', padding: '20px' }}>
          <svg viewBox="0 0 850 360" style={{ width: '100%', maxWidth: '820px', height: 'auto' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#334155" />
              </marker>
            </defs>

            {/* Central System Process */}
            <ellipse cx="425" cy="180" rx="140" ry="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            <text x="425" y="172" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">0.0</text>
            <text x="425" y="190" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">TRANSPORT COMPANY</text>
            <text x="425" y="206" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">COMPUTERISATION SYSTEM</text>

            {/* External Entity 1: CUSTOMER */}
            <rect x="30" y="130" width="140" height="90" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
            <text x="100" y="170" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">CUSTOMER</text>
            <text x="100" y="188" textAnchor="middle" fontSize="10" fill="#64748b">(Sender / Receiver)</text>

            {/* External Entity 2: DRIVER / STAFF */}
            <rect x="680" y="130" width="140" height="90" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
            <text x="750" y="170" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">DRIVER / STAFF</text>
            <text x="750" y="188" textAnchor="middle" fontSize="10" fill="#64748b">(Branch Personnel)</text>

            {/* External Entity 3: ADMINISTRATOR */}
            <rect x="345" y="10" width="160" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
            <text x="425" y="42" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">SYSTEM ADMIN</text>
            <text x="425" y="56" textAnchor="middle" fontSize="10" fill="#64748b">(Company Management)</text>

            {/* Customer Data Flows */}
            <path d="M 170 155 L 285 155" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="227" y="145" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="600">Booking / Goods Data</text>

            <path d="M 285 195 L 170 195" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="227" y="212" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="600">Invoice / Tracking Info</text>

            {/* Staff Data Flows */}
            <path d="M 565 155 L 680 155" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="622" y="145" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="600">Trip / Manifest Dispatch</text>

            <path d="M 680 195 L 565 195" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="622" y="212" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="600">Trip Status / Fuel Logs</text>

            {/* Admin Data Flows */}
            <path d="M 405 70 L 405 110" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="365" y="95" textAnchor="end" fontSize="10" fill="#1e293b" fontWeight="600">Rate Cards / Config</text>

            <path d="M 445 110 L 445 70" fill="none" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="455" y="95" textAnchor="start" fontSize="10" fill="#1e293b" fontWeight="600">MIS &amp; Audit Reports</text>
          </svg>
        </div>
      </div>

      {/* SRS Documentation Content */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Software Requirements Specification (SRS) Document</span>
        </div>
        <div className="panel-body" style={{ background: '#ffffff', padding: '24px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>1. Introduction &amp; Overview</h4>
          <p style={{ marginBottom: '14px' }}>
            The <strong>Transport Company Computerisation (TCC) System</strong> is a centralized web software solution designed to automate end-to-end commercial road freight transport operations. It replaces error-prone physical ledger registers with a unified relational multi-branch platform, significantly improving booking throughput, fleet turnaround, billing accuracy, and executive decision-making.
          </p>

          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>2. Purpose, Scope &amp; Goals</h4>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>Purpose:</strong> Serves as the complete technical baseline specification for system architects, evaluators, and operators.</li>
            <li><strong>Core Scope:</strong> Role-based access, consignment booking, unique consignment ID auto-generation, tariff-based charges, multi-branch network management, billing, and simulated tracking.</li>
            <li><strong>Operational Goals:</strong> Eliminate paper manifests, prevent double-booking of freight vehicles, enforce maintenance safety locks, and maximize fleet capacity utilization.</li>
          </ul>

          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>3. Functional Requirements (FR)</h4>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}><strong>FR-1 (Consignment Booking):</strong> Captures consignor, consignee, route, weight, goods category, and payment mode; auto-generates <code>TCC-2026-XXXX</code>.</div>
            <div style={{ marginBottom: '8px' }}><strong>FR-2 (Tariff Charge Engine):</strong> Computes freight charge using configurable base rates, distance rates, weight rates, category multipliers, and GST.</div>
            <div style={{ marginBottom: '8px' }}><strong>FR-3 (Truck Allocation):</strong> Matches available trucks to consignments based on capacity constraint while strictly blocking maintenance vehicles.</div>
            <div style={{ marginBottom: '8px' }}><strong>FR-4 (Dispatch Scheduling):</strong> Consolidates same-route consignments into vehicle manifests and records scheduled departure timestamps.</div>
            <div style={{ marginBottom: '8px' }}><strong>FR-5 (Simulated Tracking):</strong> Maintains milestone status lifecycle (Booked &rarr; Truck Assigned &rarr; Dispatch Scheduled &rarr; In Transit &rarr; Arrived &rarr; Delivered &rarr; Completed).</div>
            <div style={{ marginBottom: '8px' }}><strong>FR-6 (Billing &amp; Invoicing):</strong> Auto-generates GST-compliant freight bills, tracks payment statuses (Pending, Partial, Paid), and renders printable receipts.</div>
            <div><strong>FR-7 (MIS Analytics):</strong> Delivers revenue summaries, fleet utilization, and comprehensive activity audit logs.</div>
          </div>

          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>4. Non-Functional Requirements (NFR)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '4px' }}>
              <strong>Security:</strong> PBKDF2 password hashing, role-based route guard authorization, and immutable transaction audit trail.
            </div>
            <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '4px' }}>
              <strong>Reliability:</strong> Relational foreign key integrity, ACID atomic operations, and robust input validation.
            </div>
            <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '4px' }}>
              <strong>Usability:</strong> Minimalist, high-contrast, uncluttered interface tailored for rapid data entry by branch counter staff.
            </div>
          </div>

          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>5. Hardware &amp; Software Environment</h4>
          <table className="data-table">
            <tbody>
              <tr><td style={{ width: '180px' }}><strong>Frontend Technologies</strong></td><td>React 18, Vite 5, Minimal Academic Vanilla CSS</td></tr>
              <tr><td><strong>Backend Runtime</strong></td><td>Node.js v22 LTS, Express.js REST Engine</td></tr>
              <tr><td><strong>Database Architecture</strong></td><td>SQLite (node:sqlite DatabaseSync with PRAGMA foreign_keys)</td></tr>
              <tr><td><strong>Client Requirements</strong></td><td>Modern Web Browser (Chrome / Edge / Firefox), 1366x768 display</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
