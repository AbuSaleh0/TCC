import React, { useState, useEffect } from 'react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            System Audit Trail &amp; Activity Log
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Chronological, immutable audit record of critical system transactions and user actions
          </p>
        </div>
        <button onClick={fetchLogs} className="btn btn-outline btn-sm">
          Refresh Logs
        </button>
      </div>

      <div className="panel">
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Log ID</th>
                  <th>Timestamp</th>
                  <th>User / Actor</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Event Description</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td>#{l.id}</td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>{l.timestamp}</td>
                    <td><strong>{l.user_email}</strong></td>
                    <td><span className="badge badge-assigned">{l.module}</span></td>
                    <td><code>{l.action}</code></td>
                    <td style={{ fontSize: '12px' }}>{l.description}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No audit events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
