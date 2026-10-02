import React, { useState } from 'react';

export default function Exp4Sequence() {
  const [activeSeq, setActiveSeq] = useState('booking'); // 'booking', 'allocation', 'billing'

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 4: System Sequence Diagrams
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Chronological object interaction lifelines for Core Workflows (Booking, Allocation/Dispatch, Billing/Payment)
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveSeq('booking')}
          className={`btn ${activeSeq === 'booking' ? 'btn-primary' : 'btn-outline'}`}
        >
          1. Consignment Booking Sequence
        </button>
        <button
          onClick={() => setActiveSeq('allocation')}
          className={`btn ${activeSeq === 'allocation' ? 'btn-primary' : 'btn-outline'}`}
        >
          2. Truck Allocation &amp; Dispatch Sequence
        </button>
        <button
          onClick={() => setActiveSeq('billing')}
          className={`btn ${activeSeq === 'billing' ? 'btn-primary' : 'btn-outline'}`}
        >
          3. Billing &amp; Payment Sequence
        </button>
      </div>

      {activeSeq === 'booking' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Sequence Diagram: Consignment Booking &amp; Dynamic Tariff Calculation</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 880 440" style={{ width: '100%', maxWidth: '860px', height: 'auto' }}>
              <defs>
                <marker id="seq-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
                </marker>
              </defs>

              {/* LIFELINE HEADERS */}
              <rect x="30" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="90" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">Customer / Staff</text>

              <rect x="230" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="290" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:BookingUI</text>

              <rect x="430" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="490" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:TariffEngine</text>

              <rect x="630" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="690" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:Database (SQLite)</text>

              {/* LIFELINE DASHES */}
              <line x1="90" y1="54" x2="90" y2="400" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="290" y1="54" x2="290" y2="400" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="490" y1="54" x2="490" y2="400" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="690" y1="54" x2="690" y2="400" stroke="#94a3b8" strokeDasharray="4 4" />

              {/* MESSAGES */}
              {/* 1. Enter details */}
              <line x1="90" y1="90" x2="285" y2="90" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow)" />
              <text x="190" y="82" textAnchor="middle" fontSize="10" fill="#0f172a">1: enterBookingDetails(weight, dist, cat)</text>

              {/* 2. Compute Tariff */}
              <line x1="290" y1="130" x2="485" y2="130" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow)" />
              <text x="390" y="122" textAnchor="middle" fontSize="10" fill="#0f172a">2: calculateTariff(weight, dist, cat)</text>

              {/* 3. Query Tariff */}
              <line x1="490" y1="160" x2="685" y2="160" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow)" />
              <text x="590" y="152" textAnchor="middle" fontSize="10" fill="#0f172a">3: SELECT FROM tariffs</text>

              {/* 4. Return rates */}
              <line x1="685" y1="190" x2="495" y2="190" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow)" />
              <text x="590" y="182" textAnchor="middle" fontSize="10" fill="#64748b">4: return activeTariffRules</text>

              {/* 5. Breakdown */}
              <line x1="485" y1="220" x2="295" y2="220" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow)" />
              <text x="390" y="212" textAnchor="middle" fontSize="10" fill="#64748b">5: return {`{ base, wt, dist, tax, total }`}</text>

              {/* 6. Confirm Booking */}
              <line x1="90" y1="260" x2="285" y2="260" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow)" />
              <text x="190" y="252" textAnchor="middle" fontSize="10" fill="#0f172a">6: confirmBooking()</text>

              {/* 7. Save in DB */}
              <line x1="290" y1="300" x2="685" y2="300" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow)" />
              <text x="490" y="292" textAnchor="middle" fontSize="10" fill="#0f172a">7: INSERT INTO consignments &amp; invoices (auto TCC-2026-XXXX)</text>

              {/* 8. Success ack */}
              <line x1="685" y1="340" x2="295" y2="340" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow)" />
              <text x="490" y="332" textAnchor="middle" fontSize="10" fill="#64748b">8: commit &amp; return consignmentNumber</text>

              {/* 9. Render Confirmation */}
              <line x1="285" y1="370" x2="95" y2="370" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow)" />
              <text x="190" y="362" textAnchor="middle" fontSize="10" fill="#64748b">9: displayBookingConfirmation()</text>
            </svg>
          </div>
        </div>
      )}

      {activeSeq === 'allocation' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Sequence Diagram: Truck Allocation &amp; Dispatch Manifest Generation</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 880 420" style={{ width: '100%', maxWidth: '860px', height: 'auto' }}>
              <defs>
                <marker id="seq-arrow-2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
                </marker>
              </defs>

              <rect x="30" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="90" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">Branch Staff</text>

              <rect x="230" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="290" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:AllocationModule</text>

              <rect x="430" y="20" width="130" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="495" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:DispatchController</text>

              <rect x="650" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="710" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:Database (SQLite)</text>

              <line x1="90" y1="54" x2="90" y2="380" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="290" y1="54" x2="290" y2="380" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="495" y1="54" x2="495" y2="380" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="710" y1="54" x2="710" y2="380" stroke="#94a3b8" strokeDasharray="4 4" />

              {/* 1. Select Consignments */}
              <line x1="90" y1="90" x2="285" y2="90" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-2)" />
              <text x="190" y="82" textAnchor="middle" fontSize="10">1: selectPendingConsignments()</text>

              {/* 2. Request suitable trucks */}
              <line x1="290" y1="130" x2="705" y2="130" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-2)" />
              <text x="500" y="122" textAnchor="middle" fontSize="10">2: SELECT vehicles WHERE status='Available' AND capacity &gt;= wt (Exclude 'Maintenance')</text>

              {/* 3. Return Trucks */}
              <line x1="705" y1="170" x2="295" y2="170" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow-2)" />
              <text x="500" y="162" textAnchor="middle" fontSize="10" fill="#64748b">3: return qualifiedTrucksList</text>

              {/* 4. Confirm allocation */}
              <line x1="90" y1="210" x2="490" y2="210" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-2)" />
              <text x="290" y="202" textAnchor="middle" fontSize="10">4: confirmAllocation(truckId, driverId, route)</text>

              {/* 5. Create Dispatch & Lock Truck */}
              <line x1="495" y1="250" x2="705" y2="250" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-2)" />
              <text x="600" y="242" textAnchor="middle" fontSize="10">5: INSERT dispatches, UPDATE vehicles.status='Assigned'</text>

              {/* 6. Success ack */}
              <line x1="705" y1="290" x2="495" y2="290" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow-2)" />
              <text x="600" y="282" textAnchor="middle" fontSize="10" fill="#64748b">6: return dispatchNumber</text>

              {/* 7. Ready notification */}
              <line x1="490" y1="330" x2="95" y2="330" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow-2)" />
              <text x="290" y="322" textAnchor="middle" fontSize="10" fill="#64748b">7: displayDispatchSchedule()</text>
            </svg>
          </div>
        </div>
      )}

      {activeSeq === 'billing' && (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Sequence Diagram: Freight Billing &amp; Payment Settlement</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '16px', textAlign: 'center' }}>
            <svg viewBox="0 0 880 380" style={{ width: '100%', maxWidth: '860px', height: 'auto' }}>
              <defs>
                <marker id="seq-arrow-3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
                </marker>
              </defs>

              <rect x="40" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="100" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">Customer / Counter</text>

              <rect x="280" y="20" width="130" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="345" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:BillingController</text>

              <rect x="540" y="20" width="120" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="3" />
              <text x="600" y="42" textAnchor="middle" fontSize="11" fontWeight="bold">:Database (SQLite)</text>

              <line x1="100" y1="54" x2="100" y2="340" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="345" y1="54" x2="345" y2="340" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="600" y1="54" x2="600" y2="340" stroke="#94a3b8" strokeDasharray="4 4" />

              {/* 1. Request Bill */}
              <line x1="100" y1="90" x2="340" y2="90" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-3)" />
              <text x="220" y="82" textAnchor="middle" fontSize="10">1: getInvoiceDetails(invoiceId)</text>

              {/* 2. Query Invoice */}
              <line x1="345" y1="130" x2="595" y2="130" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-3)" />
              <text x="470" y="122" textAnchor="middle" fontSize="10">2: SELECT FROM invoices WHERE id = ?</text>

              {/* 3. Return Bill */}
              <line x1="595" y1="170" x2="350" y2="170" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow-3)" />
              <text x="470" y="162" textAnchor="middle" fontSize="10" fill="#64748b">3: return invoiceRecord</text>

              {/* 4. Submit Payment */}
              <line x1="100" y1="210" x2="340" y2="210" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-3)" />
              <text x="220" y="202" textAnchor="middle" fontSize="10">4: recordPayment(amount, mode, refNo)</text>

              {/* 5. Update Status */}
              <line x1="345" y1="250" x2="595" y2="250" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#seq-arrow-3)" />
              <text x="470" y="242" textAnchor="middle" fontSize="10">5: INSERT payments, UPDATE invoices.payment_status='Paid'</text>

              {/* 6. Receipt */}
              <line x1="340" y1="290" x2="105" y2="290" stroke="#64748b" strokeDasharray="3 3" markerEnd="url(#seq-arrow-3)" />
              <text x="220" y="282" textAnchor="middle" fontSize="10" fill="#64748b">6: displayPrintableReceipt()</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
