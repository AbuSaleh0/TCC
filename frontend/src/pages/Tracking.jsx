import React, { useState, useEffect } from 'react';

const STAGES = [
  'Booked',
  'Truck Assigned',
  'Dispatch Scheduled',
  'In Transit',
  'Arrived',
  'Delivered',
  'Completed'
];

export default function Tracking({ user, initialConsignmentNumber }) {
  const [consignments, setConsignments] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(initialConsignmentNumber || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update modal / form
  const [newStatus, setNewStatus] = useState('In Transit');
  const [checkpointLocation, setCheckpointLocation] = useState('');
  const [checkpointNotes, setCheckpointNotes] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    fetchConsignmentsList();
  }, []);

  useEffect(() => {
    if (initialConsignmentNumber) {
      setSelectedNumber(initialConsignmentNumber);
      fetchTrackingDetails(initialConsignmentNumber);
    }
  }, [initialConsignmentNumber]);

  const fetchConsignmentsList = async () => {
    try {
      const res = await fetch('/api/consignments');
      const data = await res.json();
      setConsignments(data);
      if (!selectedNumber && data.length > 0) {
        setSelectedNumber(data[0].consignment_number);
        fetchTrackingDetails(data[0].consignment_number);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrackingDetails = async (cNum) => {
    if (!cNum) return;
    setLoading(true);
    setError('');
    setUpdateMsg('');
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(cNum)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tracking details not found');
      setTrackingData(data);
      // Pre-set next logical status
      const currentIdx = STAGES.indexOf(data.consignment.status);
      if (currentIdx >= 0 && currentIdx < STAGES.length - 1) {
        setNewStatus(STAGES[currentIdx + 1]);
      }
    } catch (err) {
      setError(err.message);
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!trackingData?.consignment) return;

    try {
      const res = await fetch('/api/tracking/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        },
        body: JSON.stringify({
          consignment_id: trackingData.consignment.id,
          status: newStatus,
          location: checkpointLocation || 'Transit Checkpoint',
          notes: checkpointNotes || 'Simulated checkpoint update'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUpdateMsg(`Status successfully updated to "${newStatus}"!`);
      setCheckpointLocation('');
      setCheckpointNotes('');
      fetchTrackingDetails(trackingData.consignment.consignment_number);
      fetchConsignmentsList();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStageIndex = (status) => STAGES.indexOf(status);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
          Simulated Consignment &amp; Fleet Tracking
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Real-time status progression without external GPS hardware dependencies (CS387 Lab Simulation)
        </p>
      </div>

      {/* Consignment Selection Bar */}
      <div className="panel" style={{ marginBottom: '16px' }}>
        <div className="panel-body" style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
            Select Consignment ID:
          </label>
          <select
            className="form-select"
            style={{ maxWidth: '320px' }}
            value={selectedNumber}
            onChange={(e) => {
              setSelectedNumber(e.target.value);
              fetchTrackingDetails(e.target.value);
            }}
          >
            <option value="">-- Choose Consignment --</option>
            {consignments.map(c => (
              <option key={c.id} value={c.consignment_number}>
                {c.consignment_number} ({c.consignor_name} &rarr; {c.consignee_name} [{c.status}])
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchTrackingDetails(selectedNumber)}
            className="btn btn-primary btn-sm"
          >
            Refresh Tracking
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {updateMsg && (
        <div style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
          {updateMsg}
        </div>
      )}

      {trackingData?.consignment && (
        <div>
          {/* Milestone Step Progress Bar */}
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="panel-header">
              <span className="panel-title">
                Consignment Lifecycle: <strong>{trackingData.consignment.consignment_number}</strong>
              </span>
              <span className={`badge badge-${trackingData.consignment.status.toLowerCase().replace(/\s+/g, '')}`}>
                Current Status: {trackingData.consignment.status}
              </span>
            </div>
            <div className="panel-body">
              {/* Stepper */}
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '20px 10px 10px' }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '4%',
                  right: '4%',
                  height: '3px',
                  backgroundColor: '#e2e8f0',
                  zIndex: 1
                }} />

                {STAGES.map((st, idx) => {
                  const currentIdx = getStageIndex(trackingData.consignment.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={st} style={{ textAlign: 'center', zIndex: 2, position: 'relative', width: '80px' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: isDone ? '#2563eb' : '#ffffff',
                        border: `2px solid ${isDone ? '#2563eb' : '#cbd5e1'}`,
                        color: isDone ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: isCurrent ? '700' : '500',
                        color: isCurrent ? '#2563eb' : (isDone ? '#0f172a' : '#94a3b8'),
                        marginTop: '6px'
                      }}>
                        {st}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            {/* Timeline Audit History */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Simulated Checkpoint Milestones</span>
              </div>
              <div className="panel-body" style={{ padding: '16px' }}>
                <div style={{ borderLeft: '2px solid #cbd5e1', paddingLeft: '16px', marginLeft: '6px' }}>
                  {trackingData.history.map((h, i) => (
                    <div key={h.id} style={{ position: 'relative', marginBottom: '16px' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-23px',
                        top: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: i === trackingData.history.length - 1 ? '#2563eb' : '#94a3b8',
                        border: '2px solid #ffffff'
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{h.status}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{h.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                        Location: <strong>{h.location}</strong>
                      </div>
                      {h.notes && (
                        <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                          &ldquo;{h.notes}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                  {trackingData.history.length === 0 && (
                    <div style={{ color: '#64748b', fontSize: '12px' }}>No checkpoint logs found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Consignment Details & Staff Update Form */}
            <div>
              <div className="panel" style={{ marginBottom: '16px' }}>
                <div className="panel-header">
                  <span className="panel-title">Consignment Specifications</span>
                </div>
                <div className="panel-body" style={{ fontSize: '12px', lineHeight: '1.7' }}>
                  <div><strong>Consignor:</strong> {trackingData.consignment.consignor_name} ({trackingData.consignment.consignor_phone})</div>
                  <div><strong>Consignee:</strong> {trackingData.consignment.consignee_name} ({trackingData.consignment.consignee_phone})</div>
                  <div><strong>Origin:</strong> {trackingData.consignment.source_branch_name}</div>
                  <div><strong>Destination:</strong> {trackingData.consignment.destination_branch_name}</div>
                  <div><strong>Weight / Distance:</strong> {trackingData.consignment.weight_kg} kg / {trackingData.consignment.distance_km} km</div>
                  <div><strong>Category:</strong> {trackingData.consignment.goods_category}</div>
                  <div><strong>Total Freight:</strong> ₹{trackingData.consignment.charge_total} ({trackingData.consignment.payment_mode})</div>
                </div>
              </div>

              {/* Staff / Admin Simulated Checkpoint Trigger */}
              {user?.role !== 'CUSTOMER' && (
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Update Checkpoint (Staff Simulation)</span>
                  </div>
                  <div className="panel-body">
                    <form onSubmit={handleUpdateStatus}>
                      <div className="form-group">
                        <label className="form-label">Advance Status To:</label>
                        <select
                          className="form-select"
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value)}
                        >
                          {STAGES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Current Checkpoint / Location:</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Panipat Toll Barrier / Highway Checkpoint"
                          value={checkpointLocation}
                          onChange={e => setCheckpointLocation(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Inspection / Log Notes:</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Driver verified cargo seals intact"
                          value={checkpointNotes}
                          onChange={e => setCheckpointNotes(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '7px' }}>
                        Post Checkpoint Update
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
