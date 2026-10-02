import React, { useState, useEffect } from 'react';

export default function Billing({ user }) {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_mode: 'UPI',
    reference_number: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const url = user?.role === 'CUSTOMER' && user.customerProfile?.id
        ? `/api/invoices?customer_id=${user.customerProfile.id}`
        : '/api/invoices';

      const res = await fetch(url);
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (inv) => {
    setSelectedInvoice(inv);
    setPaymentData({
      amount: inv.total_amount,
      payment_mode: 'UPI',
      reference_number: `TXN-${Date.now().toString().slice(-6)}`,
      notes: 'Freight settlement payment'
    });
    setShowPaymentModal(true);
    setMessage('');
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        },
        body: JSON.stringify({
          invoice_id: selectedInvoice.id,
          amount: parseFloat(paymentData.amount),
          payment_mode: paymentData.payment_mode,
          reference_number: paymentData.reference_number,
          notes: paymentData.notes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(`Payment recorded! Payment receipt: ${data.payment_number}, Status: ${data.new_payment_status}`);
      setShowPaymentModal(false);
      fetchInvoices();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenPrint = async (inv) => {
    try {
      const res = await fetch(`/api/invoices/${inv.id}`);
      const data = await res.json();
      setSelectedInvoice(data.invoice);
      setShowPrintModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Freight Billing, Invoicing &amp; Payment Settlement
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Generate computerized invoices, record customer payments, and print formal transport receipts
          </p>
        </div>
      </div>

      {message && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '13px' }}>
          {message}
        </div>
      )}

      {/* Invoices Table */}
      <div className="panel">
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Consignment ID</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Weight / Dist</th>
                  <th>Goods Type</th>
                  <th>Subtotal</th>
                  <th>GST (18%)</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><strong>{inv.invoice_number}</strong></td>
                    <td>{inv.consignment_number}</td>
                    <td>{inv.customer_name || inv.consignor_name}</td>
                    <td>{inv.source_branch} &rarr; {inv.destination_branch}</td>
                    <td>{inv.weight_kg} kg / {inv.distance_km} km</td>
                    <td>{inv.goods_category}</td>
                    <td>₹{inv.subtotal}</td>
                    <td>₹{inv.tax_amount}</td>
                    <td><strong>₹{inv.total_amount}</strong></td>
                    <td>
                      <span className={`badge badge-${inv.payment_status.toLowerCase()}`}>
                        {inv.payment_status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenPrint(inv)}
                          className="btn btn-outline btn-sm"
                          title="View and Print Invoice"
                        >
                          Print Bill
                        </button>
                        {user?.role !== 'CUSTOMER' && inv.payment_status !== 'Paid' && (
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="btn btn-success btn-sm"
                            title="Record Customer Payment"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="panel-title">Record Payment for {selectedInvoice.invoice_number}</span>
              <button onClick={() => setShowPaymentModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleRecordPayment}>
              <div className="panel-body">
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '13px' }}>
                  <div>Consignment: <strong>{selectedInvoice.consignment_number}</strong></div>
                  <div>Customer: <strong>{selectedInvoice.customer_name || selectedInvoice.consignor_name}</strong></div>
                  <div>Invoice Total: <strong style={{ color: '#2563eb' }}>₹{selectedInvoice.total_amount}</strong></div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={paymentData.amount}
                    onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Mode *</label>
                  <select
                    className="form-select"
                    value={paymentData.payment_mode}
                    onChange={e => setPaymentData({ ...paymentData, payment_mode: e.target.value })}
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Net Banking">Net Banking / NEFT</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Cheque">Bank Cheque</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reference / Transaction Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={paymentData.reference_number}
                    onChange={e => setPaymentData({ ...paymentData, reference_number: e.target.value })}
                    placeholder="e.g. UPI-REF-449102"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks / Notes</label>
                  <input
                    type="text"
                    className="form-input"
                    value={paymentData.notes}
                    onChange={e => setPaymentData({ ...paymentData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-success">Settle Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal / View */}
      {showPrintModal && selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', background: '#ffffff', padding: '24px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>Printable Freight Bill</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                  🖨️ Print Invoice
                </button>
                <button onClick={() => setShowPrintModal(false)} className="btn btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>

            {/* Formal Invoice Layout */}
            <div style={{ border: '2px solid #0f172a', padding: '20px', fontFamily: 'serif' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px', margin: 0 }}>
                  TRANSPORT COMPANY COMPUTERISATION (TCC)
                </h1>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                  CENTRAL TRANSPORT CORP &bull; ROAD LOGISTICS DIVISION
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Central Office: Plot 45, Transport Nagar, New Delhi &bull; GSTIN: 07TCCLOG1234F1Z9
                </div>
                <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>
                  CONSIGNMENT FREIGHT INVOICE / BILL OF LADING
                </div>
              </div>

              {/* Invoice Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px', marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px' }}>
                <div>
                  <div><strong>Invoice Number:</strong> {selectedInvoice.invoice_number}</div>
                  <div><strong>Consignment ID:</strong> {selectedInvoice.consignment_number}</div>
                  <div><strong>Invoice Date:</strong> {selectedInvoice.created_at ? selectedInvoice.created_at.slice(0, 10) : 'Current'}</div>
                  <div><strong>Payment Status:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{selectedInvoice.payment_status}</span></div>
                </div>
                <div>
                  <div><strong>Origin Branch:</strong> {selectedInvoice.source_branch}</div>
                  <div><strong>Destination Branch:</strong> {selectedInvoice.destination_branch}</div>
                  <div><strong>Total Distance:</strong> {selectedInvoice.distance_km} KM</div>
                  <div><strong>Consignment Weight:</strong> {selectedInvoice.weight_kg} KG</div>
                </div>
              </div>

              {/* Consignor & Consignee */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px', marginBottom: '16px', background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>CONSIGNOR (SENDER):</div>
                  <div>{selectedInvoice.consignor_name}</div>
                  <div>Phone: {selectedInvoice.consignor_phone}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>CONSIGNEE (RECEIVER):</div>
                  <div>{selectedInvoice.consignee_name}</div>
                  <div>Phone: {selectedInvoice.consignee_phone}</div>
                </div>
              </div>

              {/* Charge Breakdown Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ background: '#e2e8f0' }}>
                    <th style={{ border: '1px solid #0f172a', padding: '6px', textAlign: 'left' }}>Item Description</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px', textAlign: 'center' }}>Category</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px', textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Base Handling &amp; Documentation Charge</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center' }}>Fixed</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'right' }}>₹{selectedInvoice.charge_base || 450}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Weight Surcharge ({selectedInvoice.weight_kg} kg @ standard tariff)</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center' }}>Weight</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'right' }}>₹{selectedInvoice.charge_weight || 0}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Distance Haulage ({selectedInvoice.distance_km} km)</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center' }}>Transit</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'right' }}>₹{selectedInvoice.charge_distance || 0}</td>
                  </tr>
                  {selectedInvoice.charge_category > 0 && (
                    <tr>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Special Category Hazard/Fragile Handling Surcharge</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center' }}>{selectedInvoice.goods_category}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'right' }}>₹{selectedInvoice.charge_category}</td>
                    </tr>
                  )}
                  <tr style={{ fontWeight: 'bold' }}>
                    <td colSpan="2" style={{ border: '1px solid #0f172a', padding: '6px', textAlign: 'right' }}>Subtotal:</td>
                    <td style={{ border: '1px solid #0f172a', padding: '6px', textAlign: 'right' }}>₹{selectedInvoice.subtotal}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ border: '1px solid #0f172a', padding: '6px', textAlign: 'right' }}>Goods &amp; Services Tax (GST @ 18%):</td>
                    <td style={{ border: '1px solid #0f172a', padding: '6px', textAlign: 'right' }}>₹{selectedInvoice.tax_amount}</td>
                  </tr>
                  <tr style={{ background: '#f1f5f9', fontWeight: 'bold', fontSize: '13px' }}>
                    <td colSpan="2" style={{ border: '2px solid #0f172a', padding: '8px', textAlign: 'right' }}>NET PAYABLE AMOUNT:</td>
                    <td style={{ border: '2px solid #0f172a', padding: '8px', textAlign: 'right', color: '#0f172a' }}>₹{selectedInvoice.total_amount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', fontSize: '11px' }}>
                <div style={{ textAlign: 'center', width: '180px', borderTop: '1px solid #0f172a', paddingTop: '4px' }}>
                  Consignor / Agent Signature
                </div>
                <div style={{ textAlign: 'center', width: '180px', borderTop: '1px solid #0f172a', paddingTop: '4px' }}>
                  Authorised Branch Officer (TCC)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
