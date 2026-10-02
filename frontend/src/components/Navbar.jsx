import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="top-header no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="page-title">
          Transport Company Computerisation (TCC) System
        </span>
        <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '3px', border: '1px solid #cbd5e1' }}>
          CS387 SE Lab Project
        </span>
      </div>

      <div className="header-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#334155' }}>
              Logged in as: <strong>{user.username}</strong>
            </span>
            <span className={`role-pill role-${user.role.toLowerCase()}`}>
              {user.role}
            </span>
            <button
              onClick={onLogout}
              className="btn btn-outline btn-sm"
              title="Sign out of current account"
            >
              Logout
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '12px', color: '#64748b' }}>Not Logged In</span>
        )}
      </div>
    </header>
  );
}
