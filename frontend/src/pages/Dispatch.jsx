import React, { useState, useEffect } from 'react';

export default function Dispatch({ user, setTab }) {
  const [dispatches, setDispatches] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('dispatches'); // 'dispatches' or 'trips'
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchDispatchData();
  }, []);

  const fetchDispatchData = async () => {
    try {
      setLoading(true);
      const [resDisp, resTrips] = await Promise.all([
        fetch('/api/dispatches'),
        fetch('/api/trips')
      ]);

      const dataDisp = await resDisp.json();
      const dataTrips = await resTrips.json();

      setDispatches(dataDisp);
      setTrips(dataTrips);
    } catch (err) {
      console.error('Error fetching dispatch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (dispatchId, newStatus) => {
    setActionMessage('');
    try {
      const res = await fetch(`/api/dispatches/${dispatchId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update dispatch status');

      setActionMessage(data.message);
      fetchDispatchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Dispatch Scheduling &amp; Trip Operations
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Manage scheduled vehicle departures, trigger transit runs, and record delivery completions
          </p>
        </div>
        <button onClick={() => setTab('truck-allocation')} className="btn btn-primary btn-sm">
          + New Dispatch Schedule
        </button>
      </div>

      {actionMessage && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '13px' }}>
          {actionMessage}
        </div>
      )}

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => setActiveSubTab('dispatches')}
          className={`btn ${activeSubTab === 'dispatches' ? 'btn-primary' : 'btn-outline'}`}
        >
          Scheduled Dispatches ({dispatches.length})
        </button>
        <button
          onClick={() => setActiveSubTab('trips')}
          className={`btn ${activeSubTab === 'trips' ? 'btn-primary' : 'btn-outline'}`}
        >
          Active / Historical Trips ({trips.length})
        </button>
      </div>

      {activeSubTab === 'dispatches' ? (
        <div className="panel">
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dispatch ID</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Route</th>
                    <th>Departure Time</th>
                    <th>Consignments</th>
                    <th>Status</th>
                    <th>Operational Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatches.map(d => (
                    <tr key={d.id}>
                      <td><strong>{d.dispatch_number}</strong></td>
                      <td>
                        <strong>{d.reg_number}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{d.vehicle_type}</div>
                      </td>
                      <td>{d.driver_name}</td>
                      <td>{d.source_branch_name} &rarr; {d.destination_branch_name}</td>
                      <td style={{ fontSize: '12px' }}>{d.departure_time}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: '700', color: '#2563eb' }}>{d.consignment_count}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${d.status.toLowerCase()}`}>
                          {d.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {d.status === 'Scheduled' && (
                            <button
                              onClick={() => handleUpdateStatus(d.id, 'Dispatched')}
                              className="btn btn-primary btn-sm"
                              title="Mark departed from branch"
                            >
                              Depart / Start Trip
                            </button>
                          )}
                          {d.status === 'Dispatched' && (
                            <button
                              onClick={() => handleUpdateStatus(d.id, 'Completed')}
                              className="btn btn-success btn-sm"
                              title="Mark arrived and delivered"
                            >
                              Arrive &amp; Complete
                            </button>
                          )}
                          {d.status === 'Completed' && (
                            <span style={{ fontSize: '11px', color: '#15803d', fontWeight: '600' }}>
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dispatches.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No dispatches scheduled yet.
                      </td>
                    </tr>
                  )}
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
                    <th>Trip ID</th>
                    <th>Linked Dispatch</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Current / Final Location</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.trip_number}</strong></td>
                      <td>{t.dispatch_number}</td>
                      <td>{t.reg_number}</td>
                      <td>{t.driver_name}</td>
                      <td>{t.current_location || 'En-route'}</td>
                      <td style={{ fontSize: '12px' }}>{t.start_time || 'Pending'}</td>
                      <td style={{ fontSize: '12px' }}>{t.end_time || 'In Progress'}</td>
                      <td>
                        <span className={`badge badge-${t.status.toLowerCase().replace(/\s+/g, '')}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {trips.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No trips recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
