import React, { useState, useEffect } from 'react';

export default function Drivers({ user }) {
  const [drivers, setDrivers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    phone: '',
    assigned_branch_id: '',
    status: 'Available'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resD, resB] = await Promise.all([
        fetch('/api/drivers'),
        fetch('/api/branches')
      ]);
      const dataD = await resD.json();
      const dataB = await resB.json();
      setDrivers(dataD);
      setBranches(dataB);
      if (dataB.length > 0) {
        setFormData(prev => ({ ...prev, assigned_branch_id: dataB[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'admin@tcc.com'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Driver registered successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        license_number: '',
        phone: '',
        assigned_branch_id: branches[0]?.id || '',
        status: 'Available'
      });
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
            Driver &amp; Crew Roster
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Manage commercial heavy-vehicle drivers, active assignments, and duty status
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
            + Register New Driver
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
                  <th>Driver ID</th>
                  <th>Driver Name</th>
                  <th>License Number</th>
                  <th>Contact Phone</th>
                  <th>Assigned Branch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id}>
                    <td>#{d.id}</td>
                    <td><strong>{d.name}</strong></td>
                    <td><code>{d.license_number}</code></td>
                    <td>{d.phone}</td>
                    <td>{d.branch_name || 'Central Hub'}</td>
                    <td>
                      <span className={`badge badge-${d.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="panel-title">Register Driver</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleAddDriver}>
              <div className="panel-body">
                {error && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px', borderRadius: '4px', fontSize: '12px', marginBottom: '12px' }}>
                    {error}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Driver Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Commercial Driving License *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. DL-042026009911"
                    value={formData.license_number}
                    onChange={e => setFormData({ ...formData, license_number: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Home Branch *</label>
                  <select
                    className="form-select"
                    value={formData.assigned_branch_id}
                    onChange={e => setFormData({ ...formData, assigned_branch_id: e.target.value })}
                    required
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
