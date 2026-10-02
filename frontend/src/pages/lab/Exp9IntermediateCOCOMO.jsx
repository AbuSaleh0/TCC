import React, { useState } from 'react';

export default function Exp9IntermediateCOCOMO() {
  const [kloc, setKloc] = useState(12.5);
  const [mode, setMode] = useState('Organic');

  // 15 Cost Drivers across 4 categories
  const [costDrivers, setCostDrivers] = useState({
    // Product
    rely: 1.00, // Required Software Reliability (Nominal)
    data: 1.08, // Database Size (High)
    cplx: 1.00, // Product Complexity (Nominal)
    // Hardware
    time: 1.00, // Execution Time Constraint (Nominal)
    stor: 1.00, // Main Storage Constraint (Nominal)
    virt: 0.87, // Virtual Machine Volatility (Low)
    turn: 1.00, // Computer Turnaround Time (Nominal)
    // Personnel
    acap: 0.86, // Analyst Capability (High)
    aexp: 0.91, // Applications Experience (High)
    pcap: 0.86, // Programmer Capability (High)
    vexp: 1.00, // Platform Experience (Nominal)
    lexp: 0.95, // Language Experience (High)
    // Project
    modp: 0.91, // Modern Programming Practices (High)
    tool: 0.91, // Use of Software Tools (High)
    sced: 1.00  // Required Development Schedule (Nominal)
  });

  const modeParams = {
    Organic: { a: 3.2, b: 1.05, c: 2.5, d: 0.38 },
    'Semi-detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
    Embedded: { a: 2.8, b: 1.20, c: 2.5, d: 0.32 }
  };

  // Compute EAF = product of all 15 cost drivers
  const eaf = Object.values(costDrivers).reduce((acc, curr) => acc * curr, 1.0);
  const roundedEaf = Math.round(eaf * 1000) / 1000;

  // Intermediate COCOMO formulas
  const params = modeParams[mode];
  const nominalEffort = params.a * Math.pow(kloc, params.b);
  const adjustedEffort = Math.round(nominalEffort * roundedEaf * 100) / 100;
  const tdev = Math.round((params.c * Math.pow(adjustedEffort, params.d)) * 100) / 100;
  const staffing = tdev > 0 ? Math.round((adjustedEffort / tdev) * 10) / 10 : 0;

  const handleDriverChange = (key, val) => {
    setCostDrivers(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 9: Intermediate COCOMO Model Program
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Calculates Effort Adjustment Factor (EAF) across 15 Cost Drivers, Adjusted Effort, Tdev, and Project Staffing
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left Column: 15 Cost Drivers Matrix */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">15 Software Cost Drivers (Effort Multipliers - EM)</span>
          </div>
          <div className="panel-body" style={{ padding: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
              {/* Product */}
              <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '4px' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px' }}>Product Attributes</strong>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>RELY (Reliability):</label>
                  <select className="form-select" value={costDrivers.rely} onChange={e => handleDriverChange('rely', e.target.value)}>
                    <option value="0.75">Very Low (0.75)</option>
                    <option value="0.88">Low (0.88)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="1.15">High (1.15)</option>
                    <option value="1.40">Very High (1.40)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>DATA (Database Size):</label>
                  <select className="form-select" value={costDrivers.data} onChange={e => handleDriverChange('data', e.target.value)}>
                    <option value="0.94">Low (0.94)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="1.08">High (1.08)</option>
                    <option value="1.16">Very High (1.16)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>CPLX (Complexity):</label>
                  <select className="form-select" value={costDrivers.cplx} onChange={e => handleDriverChange('cplx', e.target.value)}>
                    <option value="0.70">Very Low (0.70)</option>
                    <option value="0.85">Low (0.85)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="1.15">High (1.15)</option>
                    <option value="1.30">Very High (1.30)</option>
                  </select>
                </div>
              </div>

              {/* Hardware */}
              <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '4px' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px' }}>Hardware Attributes</strong>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>TIME (Execution Time):</label>
                  <select className="form-select" value={costDrivers.time} onChange={e => handleDriverChange('time', e.target.value)}>
                    <option value="1.00">Nominal (&le;50% usage: 1.00)</option>
                    <option value="1.11">High (70% usage: 1.11)</option>
                    <option value="1.30">Very High (85% usage: 1.30)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>STOR (Main Storage):</label>
                  <select className="form-select" value={costDrivers.stor} onChange={e => handleDriverChange('stor', e.target.value)}>
                    <option value="1.00">Nominal (&le;50% usage: 1.00)</option>
                    <option value="1.06">High (70% usage: 1.06)</option>
                    <option value="1.21">Very High (85% usage: 1.21)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>TURN (Turnaround Time):</label>
                  <select className="form-select" value={costDrivers.turn} onChange={e => handleDriverChange('turn', e.target.value)}>
                    <option value="0.87">Low (0.87)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="1.07">High (1.07)</option>
                  </select>
                </div>
              </div>

              {/* Personnel */}
              <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '4px' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px' }}>Personnel Attributes</strong>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>ACAP (Analyst Capability):</label>
                  <select className="form-select" value={costDrivers.acap} onChange={e => handleDriverChange('acap', e.target.value)}>
                    <option value="1.46">Very Low (1.46)</option>
                    <option value="1.19">Low (1.19)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="0.86">High (0.86)</option>
                    <option value="0.71">Very High (0.71)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>PCAP (Programmer Capability):</label>
                  <select className="form-select" value={costDrivers.pcap} onChange={e => handleDriverChange('pcap', e.target.value)}>
                    <option value="1.42">Very Low (1.42)</option>
                    <option value="1.17">Low (1.17)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="0.86">High (0.86)</option>
                    <option value="0.70">Very High (0.70)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>AEXP (App Experience):</label>
                  <select className="form-select" value={costDrivers.aexp} onChange={e => handleDriverChange('aexp', e.target.value)}>
                    <option value="1.29">Very Low (1.29)</option>
                    <option value="1.13">Low (1.13)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="0.91">High (0.91)</option>
                  </select>
                </div>
              </div>

              {/* Project */}
              <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '4px' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px' }}>Project Attributes</strong>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>MODP (Modern Practices):</label>
                  <select className="form-select" value={costDrivers.modp} onChange={e => handleDriverChange('modp', e.target.value)}>
                    <option value="1.24">Very Low (1.24)</option>
                    <option value="1.10">Low (1.10)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="0.91">High (0.91)</option>
                    <option value="0.82">Very High (0.82)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>TOOL (Software Tools):</label>
                  <select className="form-select" value={costDrivers.tool} onChange={e => handleDriverChange('tool', e.target.value)}>
                    <option value="1.24">Very Low (1.24)</option>
                    <option value="1.10">Low (1.10)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="0.91">High (0.91)</option>
                    <option value="0.83">Very High (0.83)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>SCED (Schedule Constraint):</label>
                  <select className="form-select" value={costDrivers.sced} onChange={e => handleDriverChange('sced', e.target.value)}>
                    <option value="1.23">Very Low (1.23)</option>
                    <option value="1.08">Low (1.08)</option>
                    <option value="1.00">Nominal (1.00)</option>
                    <option value="1.04">High (1.04)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & Intermediate Results */}
        <div>
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="panel-header">
              <span className="panel-title">Intermediate COCOMO Estimation Output</span>
            </div>
            <div className="panel-body">
              <div className="form-group">
                <label className="form-label">Software Sizing (KLOC):</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  className="form-input"
                  value={kloc}
                  onChange={e => setKloc(Math.max(0.1, parseFloat(e.target.value) || 0))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Development Mode:</label>
                <select
                  className="form-select"
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                >
                  <option value="Organic">Organic (a=3.2, b=1.05, c=2.5, d=0.38)</option>
                  <option value="Semi-detached">Semi-detached (a=3.0, b=1.12, c=2.5, d=0.35)</option>
                  <option value="Embedded">Embedded (a=2.8, b=1.20, c=2.5, d=0.32)</option>
                </select>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>
                  Model Results:
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                  <div>Effort Adjustment Factor (EAF = &Pi; EMi): <strong style={{ color: '#2563eb' }}>{roundedEaf}</strong></div>
                  <div>Nominal Effort (E_nom): <strong>{Math.round(nominalEffort * 100) / 100} PM</strong></div>
                  <div>Adjusted Effort (E_adj = E_nom &times; EAF): <strong style={{ color: '#15803d', fontSize: '15px' }}>{adjustedEffort} Person-Months</strong></div>
                  <div>Development Time (Tdev): <strong style={{ color: '#0f172a' }}>{tdev} Months</strong></div>
                  <div>Average Project Staffing: <strong>{staffing} Persons</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Intermediate COCOMO Mathematical Equations</span>
            </div>
            <div className="panel-body" style={{ fontSize: '11px', color: '#334155', lineHeight: '1.7' }}>
              <div><strong>1. Effort Adjustment Factor:</strong> <code>EAF = &prod; (EM<sub>1</sub> ... EM<sub>15</sub>)</code></div>
              <div><strong>2. Adjusted Effort:</strong> <code>Effort = a &times; (KLOC)<sup>b</sup> &times; EAF [Person-Months]</code></div>
              <div><strong>3. Development Time:</strong> <code>Tdev = c &times; (Effort)<sup>d</sup> [Months]</code></div>
              <div><strong>4. Average Staffing:</strong> <code>Staff = Effort / Tdev [Persons]</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
