import React, { useState, useEffect } from 'react';

export default function Dashboard({ user, setTab }) {
  const [stats, setStats] = useState(null);
  const [recentConsignments, setRecentConsignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resStats, resConsignments] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/consignments')
      ]);

      const dataStats = await resStats.json();
      const dataConsignments = await resConsignments.json();

      setStats(dataStats);
      setRecentConsignments(dataConsignments.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#64748b' }}>Loading dashboard data from database...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Operations Overview
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Real-time status and operational metrics from Central SQLite Database
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setTab('bookings')} className="btn btn-primary btn-sm">
            + New Booking
          </button>
          {user?.role !== 'CUSTOMER' && (
            <button onClick={() => setTab('truck-allocation')} className="btn btn-outline btn-sm">
              Allocate Trucks
            </button>
          )}
          <button onClick={() => setTab('tracking')} className="btn btn-outline btn-sm">
            Track Consignment
          </button>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Total Consignments</div>
          <div className="stat-value">{stats?.totalConsignments || 0}</div>
          <div className="stat-hint">Active & completed shipments</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Available Vehicles</div>
          <div className="stat-value" style={{ color: '#15803d' }}>
            {stats?.availableVehicles || 0}
          </div>
          <div className="stat-hint">Ready for immediate allocation</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Vehicles In Transit</div>
          <div className="stat-value" style={{ color: '#b45309' }}>
            {stats?.inTransitVehicles || 0}
          </div>
          <div className="stat-hint">Active on highway routes</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Under Maintenance</div>
          <div className="stat-value" style={{ color: '#b91c1c' }}>
            {stats?.maintenanceVehicles || 0}
          </div>
          <div className="stat-hint">Blocked from allocation</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</div>
          <div className="stat-hint">Settled freight receipts</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Pending Payments</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>
            {stats?.pendingPayments || 0}
          </div>
          <div className="stat-hint">Unpaid customer invoices</div>
        </div>
      </div>

      {/* Recent Consignments Table */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Recent Consignments</span>
          <button onClick={() => setTab('bookings')} className="btn btn-outline btn-sm">
            View All ({recentConsignments.length})
          </button>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Consignment ID</th>
                  <th>Consignor</th>
                  <th>Consignee</th>
                  <th>Route (From → To)</th>
                  <th>Weight (kg)</th>
                  <th>Category</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentConsignments.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.consignment_number}</strong>
                    </td>
                    <td>{c.consignor_name}</td>
                    <td>{c.consignee_name}</td>
                    <td>
                      {c.source_branch_name} → {c.destination_branch_name}
                    </td>
                    <td>{c.weight_kg} kg</td>
                    <td>{c.goods_category}</td>
                    <td>₹{c.charge_total}</td>
                    <td>
                      <span className={`badge badge-${c.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentConsignments.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No consignments booked yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Architecture and Info Panel */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">System Workflow Verification</span>
        </div>
        <div className="panel-body" style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
          <p>
            <strong>Core Operational Pipeline:</strong> Consignment Booking (auto ID <code>TCC-2026-XXXX</code>) &rarr; Tariff Charge Calculation &rarr; Truck Allocation (capacity validation &amp; maintenance block) &rarr; Consolidated Dispatch &rarr; Simulated Milestone Tracking &rarr; Billing &amp; Invoicing &rarr; Payment Settlement.
          </p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
              Database: <strong>SQLite (DatabaseSync)</strong>
            </span>
            <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
              DFD Stores: <strong>D1 to D7</strong>
            </span>
            <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
              Academic Module: <strong>CS387 Exp 1&ndash;10</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
