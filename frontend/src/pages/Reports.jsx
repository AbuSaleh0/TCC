import React, { useState, useEffect } from 'react';

export default function Reports() {
  const [revenueData, setRevenueData] = useState(null);
  const [consignmentData, setConsignmentData] = useState(null);
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [resRev, resCons, resFleet] = await Promise.all([
        fetch('/api/reports/revenue'),
        fetch('/api/reports/consignments'),
        fetch('/api/reports/fleet')
      ]);

      const dRev = await resRev.json();
      const dCons = await resCons.json();
      const dFleet = await resFleet.json();

      setRevenueData(dRev);
      setConsignmentData(dCons);
      setFleetData(dFleet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
          Operational Reports &amp; MIS Analytics (DFD Store D7)
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Aggregated performance indicators derived directly from operational database records
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* 1. Revenue Report */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">1. Revenue Summary by Month</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Settled Transactions</th>
                  <th>Gross Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {revenueData?.monthly?.map((m, i) => (
                  <tr key={i}>
                    <td><strong>{m.month || 'Current Period'}</strong></td>
                    <td>{m.transactions} settlements</td>
                    <td><strong style={{ color: '#15803d' }}>₹{m.revenue?.toLocaleString('en-IN')}</strong></td>
                  </tr>
                ))}
                {(!revenueData?.monthly || revenueData.monthly.length === 0) && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '12px' }}>No revenue records.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Payment Modes */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">2. Revenue by Payment Channel</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment Mode</th>
                  <th>Receipt Count</th>
                  <th>Total Collected (₹)</th>
                </tr>
              </thead>
              <tbody>
                {revenueData?.byMode?.map((b, i) => (
                  <tr key={i}>
                    <td><strong>{b.payment_mode}</strong></td>
                    <td>{b.count} receipts</td>
                    <td>₹{b.total?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Consignments by Status */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">3. Consignment Distribution by Status</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Consignments</th>
                  <th>Freight Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {consignmentData?.byStatus?.map((s, i) => (
                  <tr key={i}>
                    <td><span className={`badge badge-${s.status.toLowerCase().replace(/\s+/g, '')}`}>{s.status}</span></td>
                    <td><strong>{s.count}</strong></td>
                    <td>₹{s.total_value?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Fleet Availability Status */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">4. Fleet Status &amp; Capacity Utilization</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fleet Status</th>
                  <th>Truck Count</th>
                  <th>Aggregate Capacity</th>
                </tr>
              </thead>
              <tbody>
                {fleetData?.fleetStatus?.map((f, i) => (
                  <tr key={i}>
                    <td><span className={`badge badge-${f.status.toLowerCase().replace(/\s+/g, '')}`}>{f.status}</span></td>
                    <td><strong>{f.count} Trucks</strong></td>
                    <td>{f.total_capacity} Tons</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
