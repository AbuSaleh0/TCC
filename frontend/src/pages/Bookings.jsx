import React, { useState, useEffect } from 'react';

export default function Bookings({ user, setTab, setSelectedConsignment }) {
  const [consignments, setConsignments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    consignor_name: user?.role === 'CUSTOMER' ? user.username : '',
    consignor_phone: user?.role === 'CUSTOMER' ? (user.customerProfile?.phone || '+91-9811002233') : '',
    consignee_name: '',
    consignee_phone: '',
    source_branch_id: '',
    destination_branch_id: '',
    weight_kg: 500,
    distance_km: 250,
    goods_category: 'General Goods',
    payment_mode: 'To-Pay'
  });

  const [calculation, setCalculation] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  // Recalculate charges whenever weight, distance, or category changes
  useEffect(() => {
    if (formData.weight_kg > 0 && formData.distance_km > 0) {
      fetchTariffCalculation();
    }
  }, [formData.weight_kg, formData.distance_km, formData.goods_category]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const url = user?.role === 'CUSTOMER' && user.customerProfile?.id
        ? `/api/consignments?customer_id=${user.customerProfile.id}`
        : '/api/consignments';

      const [resCons, resBranches] = await Promise.all([
        fetch(url),
        fetch('/api/branches')
      ]);

      const dataCons = await resCons.json();
      const dataBranches = await resBranches.json();

      setConsignments(dataCons);
      setBranches(dataBranches);

      if (dataBranches.length >= 2) {
        setFormData(prev => ({
          ...prev,
          source_branch_id: dataBranches[0].id,
          destination_branch_id: dataBranches[1].id
        }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTariffCalculation = async () => {
    try {
      const res = await fetch('/api/tariffs/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight_kg: formData.weight_kg,
          distance_km: formData.distance_km,
          goods_category: formData.goods_category
        })
      });
      const data = await res.json();
      setCalculation(data);
    } catch (err) {
      console.error('Error calculating tariff:', err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.source_branch_id === formData.destination_branch_id) {
      setError('Source and Destination branches cannot be the same!');
      return;
    }

    try {
      const payload = {
        ...formData,
        customer_id: user?.customerProfile?.id || null
      };

      const res = await fetch('/api/consignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create booking');

      setBookingSuccess(data);
      setShowModal(false);
      fetchInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredConsignments = consignments.filter(c => {
    const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchSearch = searchTerm === '' ||
      c.consignment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.consignor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.consignee_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            {user?.role === 'CUSTOMER' ? 'My Consignments' : 'Consignment Booking & Management'}
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Register new freight, compute tariff-based freight charges, and issue booking orders
          </p>
        </div>
        <button onClick={() => { setShowModal(true); setBookingSuccess(null); setError(''); }} className="btn btn-primary">
          + Book New Consignment
        </button>
      </div>

      {bookingSuccess && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          <strong>Consignment Booked Successfully!</strong>
          <div style={{ marginTop: '4px', fontSize: '13px' }}>
            Consignment ID: <strong>{bookingSuccess.consignment_number}</strong> |
            Invoice Number: <strong>{bookingSuccess.invoice_number}</strong> |
            Total Charge: <strong>₹{bookingSuccess.calculation?.charge_total}</strong>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-body" style={{ padding: '10px 14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Consignment ID (e.g. TCC-2026-0001), Consignor, or Consignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ width: '200px' }}>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Truck Assigned">Truck Assigned</option>
              <option value="Dispatch Scheduled">Dispatch Scheduled</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consignments Table */}
      <div className="panel">
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Consignment ID</th>
                  <th>Booking Date</th>
                  <th>Consignor</th>
                  <th>Consignee</th>
                  <th>Origin &rarr; Destination</th>
                  <th>Weight / Dist</th>
                  <th>Goods Type</th>
                  <th>Charge (₹)</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsignments.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.consignment_number}</strong></td>
                    <td style={{ fontSize: '11px', color: '#64748b' }}>
                      {c.booking_date ? c.booking_date.slice(0, 16) : 'N/A'}
                    </td>
                    <td>
                      <div>{c.consignor_name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{c.consignor_phone}</div>
                    </td>
                    <td>
                      <div>{c.consignee_name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{c.consignee_phone}</div>
                    </td>
                    <td>
                      <div>{c.source_branch_name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>&darr; {c.destination_branch_name}</div>
                    </td>
                    <td>
                      {c.weight_kg} kg
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{c.distance_km} km</div>
                    </td>
                    <td>{c.goods_category}</td>
                    <td><strong>₹{c.charge_total}</strong></td>
                    <td>
                      <span className={`badge badge-${c.payment_mode === 'Paid' ? 'paid' : 'pending'}`}>
                        {c.payment_mode}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${c.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => {
                            if (setSelectedConsignment) setSelectedConsignment(c.consignment_number);
                            setTab('tracking');
                          }}
                          className="btn btn-outline btn-sm"
                          title="View Simulated Tracking"
                        >
                          Track
                        </button>
                        {user?.role !== 'CUSTOMER' && c.status === 'Booked' && (
                          <button
                            onClick={() => setTab('truck-allocation')}
                            className="btn btn-primary btn-sm"
                            title="Allocate Available Truck"
                          >
                            Allocate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredConsignments.length === 0 && (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      No consignments match the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <span className="panel-title">Book New Consignment</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleBookingSubmit}>
              <div className="panel-body">
                {error && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px', borderRadius: '4px', fontSize: '12px', marginBottom: '12px' }}>
                    {error}
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Consignor Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.consignor_name}
                      onChange={e => setFormData({ ...formData, consignor_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Consignor Phone *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.consignor_phone}
                      onChange={e => setFormData({ ...formData, consignor_phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Consignee Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.consignee_name}
                      onChange={e => setFormData({ ...formData, consignee_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Consignee Phone *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.consignee_phone}
                      onChange={e => setFormData({ ...formData, consignee_phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Source Branch *</label>
                    <select
                      className="form-select"
                      value={formData.source_branch_id}
                      onChange={e => setFormData({ ...formData, source_branch_id: e.target.value })}
                      required
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Destination Branch *</label>
                    <select
                      className="form-select"
                      value={formData.destination_branch_id}
                      onChange={e => setFormData({ ...formData, destination_branch_id: e.target.value })}
                      required
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weight (kg) *</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      className="form-input"
                      value={formData.weight_kg}
                      onChange={e => setFormData({ ...formData, weight_kg: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Distance (km) *</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      className="form-input"
                      value={formData.distance_km}
                      onChange={e => setFormData({ ...formData, distance_km: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Goods Category *</label>
                    <select
                      className="form-select"
                      value={formData.goods_category}
                      onChange={e => setFormData({ ...formData, goods_category: e.target.value })}
                    >
                      <option value="General Goods">General Goods (Standard)</option>
                      <option value="Fragile">Fragile (+25% surcharge)</option>
                      <option value="Hazardous">Hazardous (+50% surcharge)</option>
                      <option value="Perishable">Perishable (+35% surcharge)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Mode *</label>
                    <select
                      className="form-select"
                      value={formData.payment_mode}
                      onChange={e => setFormData({ ...formData, payment_mode: e.target.value })}
                    >
                      <option value="To-Pay">To-Pay (Pay on Delivery)</option>
                      <option value="Paid">Paid (Cash / Settled Now)</option>
                    </select>
                  </div>
                </div>

                {/* Tariff Charge Breakdown Box */}
                {calculation && (
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                      Tariff Calculation Breakdown:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '12px' }}>
                      <div>Base Rate: <strong>₹{calculation.charge_base}</strong></div>
                      <div>Weight Charge: <strong>₹{calculation.charge_weight}</strong></div>
                      <div>Distance Charge: <strong>₹{calculation.charge_distance}</strong></div>
                      <div>Category Surcharge: <strong>₹{calculation.charge_category}</strong></div>
                      <div>GST (18%): <strong>₹{calculation.charge_tax}</strong></div>
                      <div style={{ color: '#1e293b' }}>Total Charge: <strong style={{ fontSize: '14px', color: '#2563eb' }}>₹{calculation.charge_total}</strong></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm & Create Consignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
