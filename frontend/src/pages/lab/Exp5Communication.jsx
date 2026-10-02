import React, { useState } from 'react';

export default function Exp5Communication() {
  const [activeWorkflow, setActiveWorkflow] = useState('booking'); // 'booking' or 'dispatch'

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 5: Object Communication Diagrams (Collaboration Diagrams)
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Structural links showing message sequencing and object collaboration in transport workflows
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveWorkflow('booking')}
          className={`btn ${activeWorkflow === 'booking' ? 'btn-primary' : 'btn-outline'}`}
        >
          1. Booking Communication Diagram
        </button>
        <button
          onClick={() => setActiveWorkflow('dispatch')}
          className={`btn ${activeWorkflow === 'dispatch' ? 'btn-primary' : 'btn-outline'}`}
        >
          2. Truck Allocation &amp; Dispatch Communication Diagram
        </button>
      </div>

      {activeWorkflow === 'booking' ? (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Communication Diagram: Consignment Booking Workflow</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 880 440" style={{ width: '100%', maxWidth: '860px', height: 'auto' }}>
              <defs>
                <marker id="comm-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
                </marker>
              </defs>

              {/* OBJECTS */}
              {/* Object 1: Customer */}
              <rect x="50" y="160" width="160" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="130" y="195" textAnchor="middle" fontSize="12" fontWeight="bold"><u>c : Customer</u></text>

              {/* Object 2: Booking Controller */}
              <rect x="360" y="160" width="180" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="450" y="195" textAnchor="middle" fontSize="12" fontWeight="bold"><u>:ConsignmentController</u></text>

              {/* Object 3: Tariff Calculator */}
              <rect x="360" y="20" width="180" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="450" y="55" textAnchor="middle" fontSize="12" fontWeight="bold"><u>:TariffEngine</u></text>

              {/* Object 4: Consignment Record */}
              <rect x="680" y="80" width="170" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="765" y="115" textAnchor="middle" fontSize="12" fontWeight="bold"><u>consign : Consignment</u></text>

              {/* Object 5: Invoice */}
              <rect x="680" y="260" width="170" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="765" y="295" textAnchor="middle" fontSize="12" fontWeight="bold"><u>inv : Invoice</u></text>

              {/* LINKS */}
              {/* c --- Controller */}
              <line x1="210" y1="190" x2="360" y2="190" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 250 180 L 320 180" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow)" />
              <text x="285" y="172" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">1: submitBooking()</text>
              <path d="M 320 205 L 250 205" fill="none" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#comm-arrow)" />
              <text x="285" y="222" textAnchor="middle" fontSize="10" fill="#64748b">5: returnReceipt()</text>

              {/* Controller --- TariffEngine */}
              <line x1="450" y1="160" x2="450" y2="80" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 435 140 L 435 100" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow)" />
              <text x="425" y="122" textAnchor="end" fontSize="10" fill="#2563eb" fontWeight="600">2: computeCharges()</text>

              {/* Controller --- Consignment */}
              <line x1="540" y1="180" x2="680" y2="120" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 570 155 L 635 125" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow)" />
              <text x="610" y="145" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">3: create(TCC-2026-XXXX)</text>

              {/* Controller --- Invoice */}
              <line x1="540" y1="200" x2="680" y2="280" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 570 230 L 635 265" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow)" />
              <text x="615" y="240" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">4: generateBill(calc)</text>
            </svg>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Communication Diagram: Truck Allocation &amp; Dispatch Workflow</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 880 440" style={{ width: '100%', maxWidth: '860px', height: 'auto' }}>
              <defs>
                <marker id="comm-arrow-2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
                </marker>
              </defs>

              {/* Staff */}
              <rect x="50" y="170" width="160" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="130" y="205" textAnchor="middle" fontSize="12" fontWeight="bold"><u>s : BranchStaff</u></text>

              {/* Allocation Manager */}
              <rect x="360" y="170" width="180" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="450" y="205" textAnchor="middle" fontSize="12" fontWeight="bold"><u>:DispatchManager</u></text>

              {/* Vehicle */}
              <rect x="360" y="30" width="180" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="450" y="65" textAnchor="middle" fontSize="12" fontWeight="bold"><u>v : Vehicle</u></text>

              {/* Dispatch Manifest */}
              <rect x="680" y="170" width="170" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="765" y="205" textAnchor="middle" fontSize="12" fontWeight="bold"><u>d : Dispatch</u></text>

              {/* Driver */}
              <rect x="360" y="320" width="180" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" rx="4" />
              <text x="450" y="355" textAnchor="middle" fontSize="12" fontWeight="bold"><u>dr : Driver</u></text>

              {/* LINKS */}
              <line x1="210" y1="200" x2="360" y2="200" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 245 190 L 315 190" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow-2)" />
              <text x="280" y="182" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">1: scheduleDispatch(cIds)</text>

              <line x1="450" y1="170" x2="450" y2="90" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 435 150 L 435 110" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow-2)" />
              <text x="425" y="132" textAnchor="end" fontSize="10" fill="#2563eb" fontWeight="600">2: checkCapacityAndLock()</text>

              <line x1="540" y1="200" x2="680" y2="200" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 575 190 L 645 190" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow-2)" />
              <text x="610" y="182" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">3: createManifest(DISP-2026-XXXX)</text>

              <line x1="450" y1="230" x2="450" y2="320" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M 465 250 L 465 295" fill="none" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#comm-arrow-2)" />
              <text x="475" y="275" textAnchor="start" fontSize="10" fill="#2563eb" fontWeight="600">4: assignDriverDuty()</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
