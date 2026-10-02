import React, { useState } from 'react';

export default function Exp7StateMachine() {
  const [activeTab, setActiveTab] = useState('consignment'); // 'consignment' or 'vehicle'

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 7: State Machine Diagrams
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Dynamic lifecycle state transitions for Core Consignment and Transport Fleet Entities
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('consignment')}
          className={`btn ${activeTab === 'consignment' ? 'btn-primary' : 'btn-outline'}`}
        >
          1. Consignment Lifecycle State Machine
        </button>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`btn ${activeTab === 'vehicle' ? 'btn-primary' : 'btn-outline'}`}
        >
          2. Vehicle Fleet State Machine
        </button>
      </div>

      {activeTab === 'consignment' ? (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">State Machine Diagram: Consignment Lifecycle Progression</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '20px', textAlign: 'center' }}>
            <svg viewBox="0 0 940 420" style={{ width: '100%', maxWidth: '920px', height: 'auto' }}>
              <defs>
                <marker id="sm-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
                </marker>
              </defs>

              {/* Initial State */}
              <circle cx="40" cy="120" r="12" fill="#0f172a" />
              <line x1="52" y1="120" x2="90" y2="120" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />

              {/* State 1: Booked */}
              <rect x="90" y="96" width="100" height="48" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="140" y="125" textAnchor="middle" fontSize="11" fontWeight="bold">Booked</text>

              <line x1="190" y1="120" x2="230" y2="120" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />
              <text x="210" y="112" textAnchor="middle" fontSize="8" fill="#64748b">allocate()</text>

              {/* State 2: Truck Assigned */}
              <rect x="230" y="96" width="115" height="48" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="287" y="125" textAnchor="middle" fontSize="11" fontWeight="bold">Truck Assigned</text>

              <line x1="345" y1="120" x2="385" y2="120" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />
              <text x="365" y="112" textAnchor="middle" fontSize="8" fill="#64748b">schedule()</text>

              {/* State 3: Dispatch Scheduled */}
              <rect x="385" y="96" width="135" height="48" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="452" y="125" textAnchor="middle" fontSize="11" fontWeight="bold">Dispatch Scheduled</text>

              <line x1="520" y1="120" x2="560" y2="120" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />
              <text x="540" y="112" textAnchor="middle" fontSize="8" fill="#64748b">depart()</text>

              {/* State 4: In Transit */}
              <rect x="560" y="96" width="100" height="48" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="610" y="125" textAnchor="middle" fontSize="11" fontWeight="bold">In Transit</text>

              <line x1="660" y1="120" x2="700" y2="120" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />
              <text x="680" y="112" textAnchor="middle" fontSize="8" fill="#64748b">arrive()</text>

              {/* State 5: Arrived */}
              <rect x="700" y="96" width="90" height="48" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="745" y="125" textAnchor="middle" fontSize="11" fontWeight="bold">Arrived</text>

              <line x1="745" y1="144" x2="745" y2="230" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="745" y1="230" x2="680" y2="230" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />
              <text x="750" y="185" textAnchor="start" fontSize="8" fill="#64748b">deliver()</text>

              {/* State 6: Delivered */}
              <rect x="575" y="206" width="105" height="48" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="627" y="235" textAnchor="middle" fontSize="11" fontWeight="bold">Delivered</text>

              <line x1="575" y1="230" x2="500" y2="230" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />
              <text x="537" y="222" textAnchor="middle" fontSize="8" fill="#64748b">settleBill()</text>

              {/* State 7: Completed */}
              <rect x="390" y="206" width="110" height="48" rx="8" fill="#ffffff" stroke="#15803d" strokeWidth="2" />
              <text x="445" y="235" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#15803d">Completed</text>

              {/* Final State */}
              <line x1="390" y1="230" x2="330" y2="230" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#sm-arrow)" />
              <circle cx="310" cy="230" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="310" cy="230" r="8" fill="#0f172a" />

              {/* Alternate Exception State: Cancelled */}
              <rect x="90" y="260" width="100" height="42" rx="8" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.5" />
              <text x="140" y="286" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b91c1c">Cancelled</text>
              <line x1="140" y1="144" x2="140" y2="260" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#sm-arrow)" />
              <text x="145" y="200" fontSize="8" fill="#b91c1c">cancelBooking()</text>
            </svg>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">State Machine Diagram: Vehicle Fleet Status Transitions</span>
          </div>
          <div className="panel-body" style={{ background: '#f8fafc', padding: '20px', textAlign: 'center' }}>
            <svg viewBox="0 0 900 400" style={{ width: '100%', maxWidth: '880px', height: 'auto' }}>
              <defs>
                <marker id="veh-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
                </marker>
              </defs>

              {/* STATE 1: AVAILABLE (Central Core) */}
              <rect x="360" y="140" width="140" height="54" rx="8" fill="#ffffff" stroke="#15803d" strokeWidth="2.5" />
              <text x="430" y="172" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#15803d">Available</text>

              {/* STATE 2: ASSIGNED */}
              <rect x="650" y="40" width="130" height="50" rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="715" y="70" textAnchor="middle" fontSize="12" fontWeight="bold">Assigned</text>

              {/* STATE 3: IN TRANSIT */}
              <rect x="650" y="240" width="130" height="50" rx="8" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
              <text x="715" y="270" textAnchor="middle" fontSize="12" fontWeight="bold">In Transit</text>

              {/* STATE 4: IDLE */}
              <rect x="360" y="320" width="140" height="48" rx="8" fill="#ffffff" stroke="#64748b" strokeWidth="2" />
              <text x="430" y="350" textAnchor="middle" fontSize="12" fontWeight="bold">Idle</text>

              {/* STATE 5: MAINTENANCE (BLOCKED STATE) */}
              <rect x="60" y="140" width="150" height="54" rx="8" fill="#fee2e2" stroke="#b91c1c" strokeWidth="2.5" />
              <text x="135" y="166" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b91c1c">Maintenance</text>
              <text x="135" y="182" textAnchor="middle" fontSize="9" fill="#b91c1c">[Allocation Blocked]</text>

              {/* TRANSITIONS */}
              {/* Available -> Assigned */}
              <path d="M 480 140 Q 560 65 650 65" fill="none" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#veh-arrow)" />
              <text x="560" y="85" textAnchor="middle" fontSize="9" fill="#0f172a">allocateTruck()</text>

              {/* Assigned -> In Transit */}
              <line x1="715" y1="90" x2="715" y2="240" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#veh-arrow)" />
              <text x="725" y="165" textAnchor="start" fontSize="9" fill="#0f172a">departFromBranch()</text>

              {/* In Transit -> Available (on delivery complete) */}
              <path d="M 650 265 Q 560 265 480 194" fill="none" stroke="#15803d" strokeWidth="1.5" markerEnd="url(#veh-arrow)" />
              <text x="560" y="240" textAnchor="middle" fontSize="9" fill="#15803d" fontWeight="bold">deliveryConfirmed()</text>

              {/* Available <-> Idle */}
              <path d="M 410 194 L 410 320" fill="none" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#veh-arrow)" />
              <text x="400" y="260" textAnchor="end" fontSize="9" fill="#64748b">noBookings()</text>

              <path d="M 450 320 L 450 194" fill="none" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#veh-arrow)" />
              <text x="460" y="260" textAnchor="start" fontSize="9" fill="#64748b">recommission()</text>

              {/* Available -> Maintenance */}
              <path d="M 360 155 L 210 155" fill="none" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#veh-arrow)" />
              <text x="285" y="145" textAnchor="middle" fontSize="9" fill="#b91c1c" fontWeight="bold">logMaintenance()</text>

              {/* Maintenance -> Available */}
              <path d="M 210 180 L 360 180" fill="none" stroke="#15803d" strokeWidth="2" markerEnd="url(#veh-arrow)" />
              <text x="285" y="196" textAnchor="middle" fontSize="9" fill="#15803d" fontWeight="bold">completeService()</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
