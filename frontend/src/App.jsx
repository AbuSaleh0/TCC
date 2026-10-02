import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Bookings from './pages/Bookings.jsx';
import TruckAllocation from './pages/TruckAllocation.jsx';
import Dispatch from './pages/Dispatch.jsx';
import Tracking from './pages/Tracking.jsx';
import Billing from './pages/Billing.jsx';
import Vehicles from './pages/Vehicles.jsx';
import Drivers from './pages/Drivers.jsx';
import Branches from './pages/Branches.jsx';
import Customers from './pages/Customers.jsx';
import FuelMaintenance from './pages/FuelMaintenance.jsx';
import Reports from './pages/Reports.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import LabExperiments from './pages/LabExperiments.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentTab, setTab] = useState('dashboard');
  const [selectedConsignment, setSelectedConsignment] = useState('');

  // Check saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('tcc_user');
    const savedToken = localStorage.getItem('tcc_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('tcc_user');
        localStorage.removeItem('tcc_token');
      }
    }
  }, []);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('tcc_user', JSON.stringify(userData));
    localStorage.setItem('tcc_token', userToken);
    setTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tcc_user');
    localStorage.removeItem('tcc_token');
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard user={user} setTab={setTab} />;
      case 'bookings':
        return <Bookings user={user} setTab={setTab} setSelectedConsignment={setSelectedConsignment} />;
      case 'truck-allocation':
        return <TruckAllocation user={user} setTab={setTab} />;
      case 'dispatch':
        return <Dispatch user={user} setTab={setTab} />;
      case 'tracking':
        return <Tracking user={user} initialConsignmentNumber={selectedConsignment} />;
      case 'billing':
        return <Billing user={user} />;
      case 'vehicles':
        return <Vehicles user={user} />;
      case 'drivers':
        return <Drivers user={user} />;
      case 'branches':
        return <Branches user={user} />;
      case 'customers':
        return <Customers user={user} />;
      case 'fuel-maintenance':
        return <FuelMaintenance user={user} />;
      case 'reports':
        return <Reports user={user} />;
      case 'audit-logs':
        return <AuditLogs user={user} />;
      case 'lab-experiments':
        return <LabExperiments user={user} />;
      default:
        return <Dashboard user={user} setTab={setTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setTab={setTab} user={user} />
      <div className="main-content">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="content-body">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
