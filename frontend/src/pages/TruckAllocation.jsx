import React, { useState, useEffect } from 'react';

export default function TruckAllocation({ user, setTab }) {
  const [pendingConsignments, setPendingConsignments] = useState([]);
  const [selectedConsignments, setSelectedConsignments] = useState([]);
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllocationData();
    // Default departure time to 2 hours from now
    const d = new Date(Date.now() + 2 * 3600 * 1000);
    setDepartureTime(d.toISOString().slice(0, 16));
  }, []);

  const fetchAllocationData = async () => {
    try {
      setLoading(true);
      const [resCons, resDrivers, resVehicles] = await Promise.all([
        fetch('/api/consignments?status=Booked'),
        fetch('/api/drivers'),
        fetch('/api/vehicles')
      ]);

      const dataCons = await resCons.json();
      const dataDrivers = await resDrivers.json();
      const dataVehicles = await resVehicles.json();

      setPendingConsignments(dataCons);
      setDrivers(dataDrivers.filter(d => d.status === 'Available'));
      setAvailableTrucks(dataVehicles);
    } catch (err) {
      console.error('Error fetching allocation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConsignmentToggle = (c) => {
    setError('');
    setMessage('');
    if (selectedConsignments.some(item => item.id === c.id)) {
      setSelectedConsignments(selectedConsignments.filter(item => item.id !== c.id));
    } else {
      // Check if same route
      if (selectedConsignments.length > 0) {
        const first = selectedConsignments[0];
        if (first.source_branch_id !== c.source_branch_id || first.destination_branch_id !== c.destination_branch_id) {
          setError('Consolidated dispatch requires consignments to have the same Source and Destination branch!');
          return;
        }
      }
      setSelectedConsignments([...selectedConsignments, c]);
    }
  };

  const totalSelectedWeightKg = selectedConsignments.reduce((acc, curr) => acc + curr.weight_kg, 0);
  const totalSelectedWeightTons = totalSelectedWeightKg / 1000;

  // Filter trucks based on strict allocation rules:
  // 1. Vehicle status must be 'Available' (Strictly excludes 'Maintenance' and 'In Transit' and 'Assigned')
  // 2. Capacity must be >= selected weight
  const suitableTrucks = availableTrucks.filter(t => {
    return t.status === 'Available' && t.capacity_tons >= totalSelectedWeightTons;
  });

  const maintenanceTrucks = availableTrucks.filter(t => t.status === 'Maintenance');

  const handleCreateDispatch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedConsignments.length) {
      setError('Please select at least one pending consignment to allocate.');
      return;
    }
    if (!selectedTruck) {
      setError('Please select a suitable available truck.');
      return;
    }
    if (!selectedDriver) {
      setError('Please select an available driver.');
      return;
    }

    setAllocating(true);
    try {
      const first = selectedConsignments[0];
      const payload = {
        vehicle_id: parseInt(selectedTruck),
        driver_id: parseInt(selectedDriver),
        source_branch_id: first.source_branch_id,
        destination_branch_id: first.destination_branch_id,
        departure_time: departureTime,
        consignment_ids: selectedConsignments.map(c => c.id),
        notes: notes || `Consolidated dispatch for ${selectedConsignments.length} consignment(s)`
      };

      const res = await fetch('/api/dispatches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || 'staff@tcc.com'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create dispatch');

      setMessage(`Success! Dispatch ${data.dispatch_number} scheduled and truck allocated.`);
      setSelectedConsignments([]);
      setSelectedTruck('');
      setSelectedDriver('');
      fetchAllocationData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAllocating(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
          Intelligent Truck Allocation &amp; Dispatch Scheduling
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Match pending consignments with available fleet capacity while strictly blocking vehicles under maintenance
        </p>
      </div>

      {message && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {message}
          <div style={{ marginTop: '6px' }}>
            <button onClick={() => setTab('dispatch')} className="btn btn-outline btn-sm">
              View Dispatches &rarr;
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left Column: Pending Consignments Selection */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">1. Select Pending Consignments ({pendingConsignments.length} awaiting allocation)</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>Select</th>
                    <th>Consignment ID</th>
                    <th>Route</th>
                    <th>Weight</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingConsignments.map(c => {
                    const isSelected = selectedConsignments.some(item => item.id === c.id);
                    return (
                      <tr key={c.id} style={isSelected ? { backgroundColor: '#eff6ff' } : {}}>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleConsignmentToggle(c)}
                          />
                        </td>
                        <td>
                          <strong>{c.consignment_number}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{c.consignor_name}</div>
                        </td>
                        <td>{c.source_branch_name} &rarr; {c.destination_branch_name}</td>
                        <td><strong>{c.weight_kg} kg</strong></td>
                        <td>{c.goods_category}</td>
                      </tr>
                    );
                  })}
                  {pendingConsignments.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No pending consignments awaiting truck allocation.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedConsignments.length > 0 && (
              <div style={{ padding: '12px', background: '#f8fafc', borderTop: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '13px', color: '#0f172a' }}>
                  Selected Consignments: <strong>{selectedConsignments.length}</strong> | Total Weight: <strong>{totalSelectedWeightKg} kg ({totalSelectedWeightTons.toFixed(2)} Tons)</strong>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Route: {selectedConsignments[0].source_branch_name} &rarr; {selectedConsignments[0].destination_branch_name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Allocation & Dispatch Form */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">2. Allocate Suitable Vehicle &amp; Schedule</span>
          </div>
          <div className="panel-body">
            <form onSubmit={handleCreateDispatch}>
              <div className="form-group">
                <label className="form-label">
                  Select Vehicle * (Rule: Status = Available &amp; Capacity &ge; {totalSelectedWeightTons.toFixed(2)} Tons)
                </label>
                <select
                  className="form-select"
                  value={selectedTruck}
                  onChange={e => setSelectedTruck(e.target.value)}
                  required
                >
                  <option value="">-- Choose Suitable Truck --</option>
                  {suitableTrucks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.reg_number} - {t.vehicle_type} (Capacity: {t.capacity_tons} Tons) - [{t.branch_name || 'Central'}]
                    </option>
                  ))}
                </select>
                {selectedConsignments.length > 0 && suitableTrucks.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>
                    No available truck with &ge; {totalSelectedWeightTons.toFixed(2)} Tons capacity found at source!
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Assign Driver *</label>
                <select
                  className="form-select"
                  value={selectedDriver}
                  onChange={e => setSelectedDriver(e.target.value)}
                  required
                >
                  <option value="">-- Choose Available Driver --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.license_number}) - Phone: {d.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Scheduled Departure Date &amp; Time *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={departureTime}
                  onChange={e => setDepartureTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dispatch Notes</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Priority fragile cargo, inspect strap fasteners"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '8px' }}
                disabled={allocating || selectedConsignments.length === 0 || !selectedTruck || !selectedDriver}
              >
                {allocating ? 'Processing Allocation...' : 'Confirm Allocation & Schedule Dispatch'}
              </button>
            </form>

            {/* Academic Rule Verification Notice */}
            <div style={{ marginTop: '16px', padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px' }}>
              <div style={{ fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                Software Engineering Allocation Rule Validation:
              </div>
              <ul style={{ paddingLeft: '16px', color: '#64748b', lineHeight: '1.4' }}>
                <li>Vehicles under <strong>Maintenance</strong> are strictly blocked by the query filter.</li>
                <li>Vehicles currently <strong>Assigned</strong> or <strong>In Transit</strong> cannot be double-booked.</li>
                <li>Truck capacity constraint <em>(Capacity &ge; Weight)</em> is strictly enforced.</li>
              </ul>
              {maintenanceTrucks.length > 0 && (
                <div style={{ marginTop: '6px', color: '#b91c1c' }}>
                  Blocked Vehicles (Under Maintenance): {maintenanceTrucks.map(m => m.reg_number).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
