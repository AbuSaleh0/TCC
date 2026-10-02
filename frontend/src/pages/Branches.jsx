import React, { useState, useEffect } from 'react';

export default function Branches({ user }) {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    branch_code: '',
    name: '',
    city: '',
    address: '',
    phone: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();
      setBranches(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'admin@tcc.com'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Branch established successfully!');
      setShowModal(false);
      setFormData({ branch_code: '', name: '', city: '', address: '', phone: '', email: '' });
      fetchBranches();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Branch Network &amp; Terminal Management
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Maintain centralized branch nodes for synchronized transport logistics
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
            + Add New Branch
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
                  <th>Branch Code</th>
                  <th>Branch Name</th>
                  <th>City</th>
                  <th>Terminal Address</th>
                  <th>Contact Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.branch_code}</strong></td>
                    <td>{b.name}</td>
                    <td>{b.city}</td>
                    <td>{b.address || 'N/A'}</td>
                    <td>{b.phone}</td>
                    <td>{b.email}</td>
                    <td>
                      <span className="badge badge-available">{b.status}</span>
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
              <span className="panel-title">Add Branch Terminal</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleAddBranch}>
              <div className="panel-body">
                {error && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px', borderRadius: '4px', fontSize: '12px', marginBottom: '12px' }}>
                    {error}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Branch Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. BR-LKO-04"
                    value={formData.branch_code}
                    onChange={e => setFormData({ ...formData, branch_code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Branch Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. East Terminal (Lucknow)"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Lucknow"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Terminal Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
