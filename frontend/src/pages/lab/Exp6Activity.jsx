import React from 'react';

export default function Exp6Activity() {
  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 6: System Activity Diagram
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Complete end-to-end workflow execution path with conditional decision diamonds and concurrency
        </p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">End-to-End Transport Logistics Activity Flow</span>
        </div>
        <div className="panel-body" style={{ background: '#f8fafc', padding: '20px', textAlign: 'center' }}>
          <svg viewBox="0 0 760 840" style={{ width: '100%', maxWidth: '720px', height: 'auto' }}>
            <defs>
              <marker id="act-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
              </marker>
            </defs>

            {/* START STATE */}
            <circle cx="380" cy="25" r="14" fill="#0f172a" />
            <text x="380" y="52" textAnchor="middle" fontSize="10" fontWeight="bold">Start</text>
            <line x1="380" y1="39" x2="380" y2="70" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* ACTION 1: Role-Based Login */}
            <rect x="290" y="70" width="180" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="93" textAnchor="middle" fontSize="11" fontWeight="bold">1. Role-Based Login</text>
            <line x1="380" y1="108" x2="380" y2="135" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* ACTION 2: Enter Booking Details */}
            <rect x="270" y="135" width="220" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="158" textAnchor="middle" fontSize="11" fontWeight="bold">2. Enter Consignment Details</text>
            <line x1="380" y1="173" x2="380" y2="200" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* DECISION 1: Input Valid? */}
            <polygon points="380,200 440,225 380,250 320,225" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <text x="380" y="228" textAnchor="middle" fontSize="10" fontWeight="bold">Valid Data?</text>

            {/* Invalid path (loops back) */}
            <line x1="440" y1="225" x2="550" y2="225" stroke="#b91c1c" strokeWidth="1.5" />
            <line x1="550" y1="225" x2="550" y2="154" stroke="#b91c1c" strokeWidth="1.5" />
            <line x1="550" y1="154" x2="495" y2="154" stroke="#b91c1c" strokeWidth="1.5" markerEnd="url(#act-arrow)" />
            <text x="475" y="218" fontSize="10" fill="#b91c1c" fontWeight="bold">[No: Validation Error]</text>

            {/* Valid path continues down */}
            <line x1="380" y1="250" x2="380" y2="280" stroke="#15803d" strokeWidth="1.5" markerEnd="url(#act-arrow)" />
            <text x="395" y="268" fontSize="10" fill="#15803d" fontWeight="bold">[Yes]</text>

            {/* ACTION 3: Calculate Tariff */}
            <rect x="260" y="280" width="240" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="303" textAnchor="middle" fontSize="11" fontWeight="bold">3. Compute Dynamic Tariff Charges</text>
            <line x1="380" y1="318" x2="380" y2="345" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* ACTION 4: Issue Consignment ID */}
            <rect x="250" y="345" width="260" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="368" textAnchor="middle" fontSize="11" fontWeight="bold">4. Auto-Generate ID (TCC-2026-XXXX)</text>
            <line x1="380" y1="383" x2="380" y2="410" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* DECISION 2: Truck Available & Not in Maintenance? */}
            <polygon points="380,410 460,435 380,460 300,435" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <text x="380" y="434" textAnchor="middle" fontSize="9" fontWeight="bold">Truck Available &amp;</text>
            <text x="380" y="445" textAnchor="middle" fontSize="9" fontWeight="bold">Capacity &ge; Weight?</text>

            {/* No truck available -> Wait / Queue */}
            <line x1="460" y1="435" x2="570" y2="435" stroke="#b45309" strokeWidth="1.5" />
            <line x1="570" y1="435" x2="570" y2="490" stroke="#b45309" strokeWidth="1.5" />
            <rect x="510" y="490" width="120" height="32" rx="4" fill="#fffbeb" stroke="#b45309" />
            <text x="570" y="510" textAnchor="middle" fontSize="10" fill="#b45309">Wait in Depot</text>
            <line x1="570" y1="522" x2="570" y2="560" stroke="#b45309" strokeWidth="1.5" />
            <line x1="570" y1="560" x2="495" y2="560" stroke="#b45309" strokeWidth="1.5" markerEnd="url(#act-arrow)" />
            <text x="475" y="428" fontSize="10" fill="#b45309">[No / Maintenance Block]</text>

            {/* Truck available */}
            <line x1="380" y1="460" x2="380" y2="490" stroke="#15803d" strokeWidth="1.5" markerEnd="url(#act-arrow)" />
            <text x="395" y="478" fontSize="10" fill="#15803d" fontWeight="bold">[Yes: Suitable Truck Found]</text>

            {/* ACTION 5: Allocate Truck & Schedule Dispatch */}
            <rect x="250" y="490" width="260" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="513" textAnchor="middle" fontSize="11" fontWeight="bold">5. Allocate Truck &amp; Schedule Dispatch</text>
            <line x1="380" y1="528" x2="380" y2="555" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* ACTION 6: Depart / In Transit & Post Tracking */}
            <rect x="260" y="555" width="240" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="578" textAnchor="middle" fontSize="11" fontWeight="bold">6. Depart Branch &amp; Log Checkpoints</text>
            <line x1="380" y1="593" x2="380" y2="620" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* ACTION 7: Delivery Confirmation */}
            <rect x="270" y="620" width="220" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="643" textAnchor="middle" fontSize="11" fontWeight="bold">7. Arrive &amp; Deliver at Destination</text>
            <line x1="380" y1="658" x2="380" y2="685" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* ACTION 8: Billing & Payment Settlement */}
            <rect x="250" y="685" width="260" height="38" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
            <text x="380" y="708" textAnchor="middle" fontSize="11" fontWeight="bold">8. Issue Final GST Bill &amp; Settle Payment</text>
            <line x1="380" y1="723" x2="380" y2="755" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#act-arrow)" />

            {/* END STATE */}
            <circle cx="380" cy="775" r="16" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <circle cx="380" cy="775" r="10" fill="#0f172a" />
            <text x="380" y="805" textAnchor="middle" fontSize="10" fontWeight="bold">End</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
