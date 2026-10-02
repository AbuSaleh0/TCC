import React, { useState, useEffect } from 'react';

export default function FuelMaintenance({ user }) {
  const [activeTab, setActiveTab] = useState('maintenance'); // 'maintenance' or 'fuel'
  const [maintenance, setMaintenance] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);

  const [maintData, setMaintData] = useState({
    vehicle_id: '',
    maintenance_type: 'Brake & Suspension Overhaul',
    service_date: new Date().toISOString().slice(0, 10),
    next_service_date: '',
    cost: 8500,
    status: 'In Maintenance',
    remarks: 'Routine inspection discovered worn brake pads'
  });

  const [fuelData, setFuelData] = useState({
    vehicle_id: '',
    date: new Date().toISOString().slice(0, 10),
    liters: 150,
    cost: 14250,
    odometer: 115000,
    remarks: 'High-speed diesel refuel'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resM, resF, resV] = await Promise.all([
        fetch('/api/maintenance'),
        fetch('/api/fuel-logs'),
        fetch('/api/vehicles')
      ]);
      const dataM = await resM.json();
      const dataF = await resF.json();
      const dataV = await resV.json();

      setMaintenance(dataM);
      setFuelLogs(dataF);
      setVehicles(dataV);
      if (dataV.length > 0) {
        setMaintData(prev => ({ ...prev, vehicle_id: dataV[0].id }));
        setFuelData(prev => ({ ...prev, vehicle_id: dataV[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMaintenance = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        },
        body: JSON.stringify(maintData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Maintenance record saved! Note: Vehicle status updated to "Maintenance" (Blocked from allocation).');
      setShowMaintModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteMaintenance = async (id) => {
    try {
      const res = await fetch(`/api/maintenance/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(data.message);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddFuel = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/fuel-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        },
        body: JSON.stringify(fuelData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Fuel log entry recorded successfully!');
      setShowFuelModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Fuel Logs &amp; Fleet Maintenance (DFD Store D5)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Track vehicle operating expenses, service records, and enforce maintenance safety lockouts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowMaintModal(true)} className="btn btn-danger btn-sm">
            + Log Maintenance (Locks Truck)
          </button>
          <button onClick={() => setShowFuelModal(true)} className="btn btn-outline btn-sm">
            + Log Fuel Expense
          </button>
        </div>
      </div>

      {message && (
        <div style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '13px' }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`btn ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-outline'}`}
        >
          Maintenance Records &amp; Lockouts ({maintenance.length})
        </button>
        <button
          onClick={() => setActiveTab('fuel')}
          className={`btn ${activeTab === 'fuel' ? 'btn-primary' : 'btn-outline'}`}
        >
          Fuel Logs ({fuelLogs.length})
        </button>
      </div>

      {activeTab === 'maintenance' ? (
        <div className="panel">
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Vehicle</th>
                    <th>Service Type</th>
                    <th>Service Date</th>
                    <th>Next Due Date</th>
                    <th>Cost (₹)</th>
                    <th>Remarks</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenance.map(m => (
                    <tr key={m.id}>
                      <td>#{m.id}</td>
                      <td>
                        <strong>{m.reg_number}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{m.vehicle_type}</div>
                      </td>
                      <td>{m.maintenance_type}</td>
                      <td>{m.service_date}</td>
                      <td>{m.next_service_date || 'N/A'}</td>
                      <td><strong>₹{m.cost}</strong></td>
                      <td style={{ fontSize: '12px', color: '#475569' }}>{m.remarks || 'None'}</td>
                      <td>
                        <span className={`badge badge-${m.status === 'Completed' ? 'completed' : 'maintenance'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        {m.status === 'In Maintenance' && (
                          <button
                            onClick={() => handleCompleteMaintenance(m.id)}
                            className="btn btn-success btn-sm"
                            title="Mark repairs completed and restore vehicle to Available"
                          >
                            Mark Completed
                          </button>
                        )}
                        {m.status === 'Completed' && (
                          <span style={{ fontSize: '11px', color: '#15803d' }}>Restored</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Fuel Quantity (Liters)</th>
                    <th>Total Cost (₹)</th>
                    <th>Rate/Liter</th>
                    <th>Odometer Reading</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.map(f => (
                    <tr key={f.id}>
                      <td>#{f.id}</td>
                      <td><strong>{f.reg_number}</strong></td>
                      <td>{f.date}</td>
                      <td>{f.liters} L</td>
                      <td><strong>₹{f.cost}</strong></td>
                      <td>₹{(f.cost / f.liters).toFixed(2)}/L</td>
                      <td>{f.odometer} km</td>
                      <td>{f.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Maintenance Modal */}
      {showMaintModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <span className="panel-title">Log Maintenance &amp; Lock Vehicle</span>
              <button onClick={() => setShowMaintModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleAddMaintenance}>
              <div className="panel-body">
                {error && <div style={{ color: '#b91c1c', marginBottom: '8px' }}>{error}</div>}
                <div className="form-group">
                  <label className="form-label">Select Vehicle *</label>
                  <select
                    className="form-select"
                    value={maintData.vehicle_id}
                    onChange={e => setMaintData({ ...maintData, vehicle_id: e.target.value })}
                    required
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.reg_number} - {v.vehicle_type} (Status: {v.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Maintenance / Service Type *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={maintData.maintenance_type}
                    onChange={e => setMaintData({ ...maintData, maintenance_type: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Service Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={maintData.service_date}
                    onChange={e => setMaintData({ ...maintData, service_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Next Service Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={maintData.next_service_date}
                    onChange={e => setMaintData({ ...maintData, next_service_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Service Cost (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    className="form-input"
                    value={maintData.cost}
                    onChange={e => setMaintData({ ...maintData, cost: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Diagnostic Remarks</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    value={maintData.remarks}
                    onChange={e => setMaintData({ ...maintData, remarks: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowMaintModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-danger">Confirm &amp; Lock Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Fuel Modal */}
      {showFuelModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="panel-title">Record Fuel Expense</span>
              <button onClick={() => setShowFuelModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleAddFuel}>
              <div className="panel-body">
                <div className="form-group">
                  <label className="form-label">Select Vehicle *</label>
                  <select
                    className="form-select"
                    value={fuelData.vehicle_id}
                    onChange={e => setFuelData({ ...fuelData, vehicle_id: e.target.value })}
                    required
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.reg_number} - {v.vehicle_type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={fuelData.date}
                    onChange={e => setFuelData({ ...fuelData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity in Liters *</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={fuelData.liters}
                    onChange={e => setFuelData({ ...fuelData, liters: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Cost (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    className="form-input"
                    value={fuelData.cost}
                    onChange={e => setFuelData({ ...fuelData, cost: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Odometer Reading (km) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={fuelData.odometer}
                    onChange={e => setFuelData({ ...fuelData, odometer: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowFuelModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Fuel Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
