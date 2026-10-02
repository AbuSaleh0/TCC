import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@tcc.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regData, setRegData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [regSuccess, setRegSuccess] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setRegSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setRegSuccess('Registration successful! You can now login with your credentials.');
      setIsRegistering(false);
      setEmail(regData.email);
      setPassword(regData.password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '460px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Transport Company Computerisation (TCC)
          </h1>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Software Engineering Laboratory Project (CS387)
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {regSuccess && (
          <div style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }}>
            {regSuccess}
          </div>
        )}

        {!isRegistering ? (
          <div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Demo Accounts (For Viva / Lab Demonstration):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@tcc.com', 'Admin@123')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', padding: '4px' }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('staff@tcc.com', 'Staff@123')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', padding: '4px' }}
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer@tcc.com', 'Customer@123')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', padding: '4px' }}
                >
                  Customer
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '12px' }}
              >
                New Customer? Register Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={regData.name}
                onChange={e => setRegData({ ...regData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                value={regData.company}
                onChange={e => setRegData({ ...regData, company: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={regData.email}
                onChange={e => setRegData({ ...regData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={regData.phone}
                onChange={e => setRegData({ ...regData, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={regData.password}
                onChange={e => setRegData({ ...regData, password: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '8px' }}>
                Complete Registration
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsRegistering(false)}
                style={{ padding: '8px 14px' }}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
