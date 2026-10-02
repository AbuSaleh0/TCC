import React from 'react';

export default function Sidebar({ currentTab, setTab, user }) {
  const role = user?.role || 'CUSTOMER';

  const navItems = [
    // Main Operations
    { id: 'dashboard', label: 'Dashboard', roles: ['ADMIN', 'STAFF', 'CUSTOMER'] },
    { id: 'bookings', label: role === 'CUSTOMER' ? 'My Consignments' : 'Consignments & Booking', roles: ['ADMIN', 'STAFF', 'CUSTOMER'] },
    { id: 'truck-allocation', label: 'Truck Allocation', roles: ['ADMIN', 'STAFF'] },
    { id: 'dispatch', label: 'Dispatch & Trips', roles: ['ADMIN', 'STAFF'] },
    { id: 'tracking', label: 'Simulated Tracking', roles: ['ADMIN', 'STAFF', 'CUSTOMER'] },
    { id: 'billing', label: 'Invoices & Billing', roles: ['ADMIN', 'STAFF', 'CUSTOMER'] },

    // Fleet & Master Data
    { id: 'vehicles', label: 'Vehicle Management', roles: ['ADMIN', 'STAFF'] },
    { id: 'drivers', label: 'Drivers & Staff', roles: ['ADMIN', 'STAFF'] },
    { id: 'branches', label: 'Branch Network', roles: ['ADMIN'] },
    { id: 'customers', label: 'Customers', roles: ['ADMIN', 'STAFF'] },
    { id: 'fuel-maintenance', label: 'Fuel & Maintenance', roles: ['ADMIN', 'STAFF'] },

    // Management & Audit
    { id: 'reports', label: 'Operational Reports', roles: ['ADMIN'] },
    { id: 'audit-logs', label: 'Audit Trail', roles: ['ADMIN'] },

    // Academic Section
    { id: 'lab-experiments', label: 'SE Lab (Exp 1 - 10)', roles: ['ADMIN', 'STAFF', 'CUSTOMER'], highlight: true }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="sidebar no-print">
      <div className="sidebar-header">
        <div className="sidebar-title">TCC AUTOMATION</div>
        <div className="sidebar-subtitle">Transport System v1.0</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {visibleItems.map(item => (
          <div
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            style={item.highlight ? { color: '#60a5fa', fontWeight: 'bold' } : {}}
          >
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">{user?.username}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`role-pill role-${role.toLowerCase()}`}>{role}</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{user?.email}</span>
        </div>
      </div>
    </aside>
  );
}
