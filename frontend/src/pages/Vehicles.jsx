import React, { useState, useEffect } from 'react';

export default function Vehicles({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    reg_number: '',
    vehicle_type: 'Medium Cargo Truck (10-Wheeler)',
    capacity_tons: 10.0,
    current_branch_id: '',
    status: 'Available',
    driver_id: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehiclesData();
  }, []);

  const fetchVehiclesData = async () => {
    try {
      const [resV, resB, resD] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/branches'),
        fetch('/api/drivers')
      ]);
      const dataV = await resV.json();
      const dataB = await resB.json();
      const dataD = await resD.json();

      setVehicles(dataV);
      setBranches(dataB);
      setDrivers(dataD);
      if (dataB.length > 0) {
        setFormData(prev => ({ ...prev, current_branch_id: dataB[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'admin@tcc.com'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Vehicle added successfully!');
      setShowModal(false);
      setFormData({
        reg_number: '',
        vehicle_type: 'Medium Cargo Truck (10-Wheeler)',
        capacity_tons: 10.0,
        current_branch_id: branches[0]?.id || '',
        status: 'Available',
        driver_id: ''
      });
      fetchVehiclesData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Fleet &amp; Vehicle Management
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Maintain truck inventory, capacity thresholds, location assignments, and operational states
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
            + Add New Vehicle
          </button>
        )}
      </div>

      {message && (
        <div style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '13px' }}>
          {message}
        </div>
      )}

      <div className="panel">
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle ID</th>
                  <th>Registration No.</th>
                  <th>Vehicle Type</th>
                  <th>Capacity (Tons)</th>
                  <th>Current Branch</th>
                  <th>Assigned Driver</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td>#{v.id}</td>
                    <td><strong>{v.reg_number}</strong></td>
                    <td>{v.vehicle_type}</td>
                    <td><strong>{v.capacity_tons} Tons</strong> ({v.capacity_tons * 1000} kg)</td>
                    <td>{v.branch_name || 'Central Hub'}</td>
                    <td>{v.driver_name || 'None'}</td>
                    <td>
                      <span className={`badge badge-${v.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <span className="panel-title">Add Vehicle to Fleet</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleAddVehicle}>
              <div className="panel-body">
                {error && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px', borderRadius: '4px', fontSize: '12px', marginBottom: '12px' }}>
                    {error}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Registration Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. DL-01-AX-9999"
                    value={formData.reg_number}
                    onChange={e => setFormData({ ...formData, reg_number: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Type *</label>
                  <select
                    className="form-select"
                    value={formData.vehicle_type}
                    onChange={e => setFormData({ ...formData, vehicle_type: e.target.value })}
                  >
                    <option value="Light Transport Truck (6-Wheeler)">Light Transport Truck (6-Wheeler)</option>
                    <option value="Medium Cargo Truck (10-Wheeler)">Medium Cargo Truck (10-Wheeler)</option>
                    <option value="Heavy Freight Truck (14-Wheeler)">Heavy Freight Truck (14-Wheeler)</option>
                    <option value="Heavy Duty Truck (16-Wheeler)">Heavy Duty Truck (16-Wheeler)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity (Tons) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    className="form-input"
                    value={formData.capacity_tons}
                    onChange={e => setFormData({ ...formData, capacity_tons: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assigned Branch *</label>
                  <select
                    className="form-select"
                    value={formData.current_branch_id}
                    onChange={e => setFormData({ ...formData, current_branch_id: e.target.value })}
                    required
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Idle">Idle</option>
                    <option value="Maintenance">Maintenance (Blocks allocation)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
