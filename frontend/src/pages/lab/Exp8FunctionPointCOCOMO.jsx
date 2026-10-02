import React, { useState } from 'react';

export default function Exp8FunctionPointCOCOMO() {
  // Function Point Counts
  const [counts, setCounts] = useState({
    ei_simple: 4, ei_avg: 3, ei_complex: 1,
    eo_simple: 3, eo_avg: 2, eo_complex: 1,
    eq_simple: 4, eq_avg: 2, eq_complex: 0,
    ilf_simple: 3, ilf_avg: 4, ilf_complex: 1,
    eif_simple: 1, eif_avg: 1, eif_complex: 0
  });

  // Degree of Influence (14 factors sum, 0-70 default to ~35)
  const [tdi, setTdi] = useState(35);
  const [locPerFp, setLocPerFp] = useState(50); // standard for modern web / JS / Java
  const [cocomoMode, setCocomoMode] = useState('Organic');

  // Weights table
  const weights = {
    ei: [3, 4, 6],
    eo: [4, 5, 7],
    eq: [3, 4, 6],
    ilf: [7, 10, 15],
    eif: [5, 7, 10]
  };

  // COCOMO Coefficients
  const cocomoCoeffs = {
    Organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
    'Semi-detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
    Embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
  };

  // 1. Calculate UFP
  const ufp_ei = (counts.ei_simple * weights.ei[0]) + (counts.ei_avg * weights.ei[1]) + (counts.ei_complex * weights.ei[2]);
  const ufp_eo = (counts.eo_simple * weights.eo[0]) + (counts.eo_avg * weights.eo[1]) + (counts.eo_complex * weights.eo[2]);
  const ufp_eq = (counts.eq_simple * weights.eq[0]) + (counts.eq_avg * weights.eq[1]) + (counts.eq_complex * weights.eq[2]);
  const ufp_ilf = (counts.ilf_simple * weights.ilf[0]) + (counts.ilf_avg * weights.ilf[1]) + (counts.ilf_complex * weights.ilf[2]);
  const ufp_eif = (counts.eif_simple * weights.eif[0]) + (counts.eif_avg * weights.eif[1]) + (counts.eif_complex * weights.eif[2]);

  const ufp = ufp_ei + ufp_eo + ufp_eq + ufp_ilf + ufp_eif;
  const vaf = 0.65 + (0.01 * tdi);
  const afp = Math.round(ufp * vaf * 100) / 100;

  const totalLoc = Math.round(afp * locPerFp);
  const kloc = Math.round((totalLoc / 1000) * 100) / 100;

  // 2. Calculate Basic COCOMO
  const coeff = cocomoCoeffs[cocomoMode];
  const effort = Math.round((coeff.a * Math.pow(kloc, coeff.b)) * 100) / 100;
  const tdev = Math.round((coeff.c * Math.pow(effort, coeff.d)) * 100) / 100;
  const staffing = tdev > 0 ? Math.round((effort / tdev) * 10) / 10 : 0;
  const productivity = effort > 0 ? Math.round((totalLoc / effort)) : 0;

  const handleCountChange = (field, val) => {
    setCounts(prev => ({ ...prev, [field]: Math.max(0, parseInt(val) || 0) }));
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 8: Function Point Analysis &amp; Basic COCOMO Estimation
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Interactive software sizing calculator: Computes UFP, VAF, AFP, KLOC, Effort (Person-Months), and Development Time
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left Column: Function Point Components Input */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">1. Function Point Counting Matrix (Unadjusted FP)</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Component Type</th>
                  <th>Simple</th>
                  <th>Average</th>
                  <th>Complex</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>External Inputs (EI)</strong><div style={{ fontSize: '10px', color: '#64748b' }}>wt: 3 / 4 / 6</div></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.ei_simple} onChange={e => handleCountChange('ei_simple', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.ei_avg} onChange={e => handleCountChange('ei_avg', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.ei_complex} onChange={e => handleCountChange('ei_complex', e.target.value)} /></td>
                  <td><strong>{ufp_ei}</strong></td>
                </tr>
                <tr>
                  <td><strong>External Outputs (EO)</strong><div style={{ fontSize: '10px', color: '#64748b' }}>wt: 4 / 5 / 7</div></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eo_simple} onChange={e => handleCountChange('eo_simple', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eo_avg} onChange={e => handleCountChange('eo_avg', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eo_complex} onChange={e => handleCountChange('eo_complex', e.target.value)} /></td>
                  <td><strong>{ufp_eo}</strong></td>
                </tr>
                <tr>
                  <td><strong>External Inquiries (EQ)</strong><div style={{ fontSize: '10px', color: '#64748b' }}>wt: 3 / 4 / 6</div></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eq_simple} onChange={e => handleCountChange('eq_simple', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eq_avg} onChange={e => handleCountChange('eq_avg', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eq_complex} onChange={e => handleCountChange('eq_complex', e.target.value)} /></td>
                  <td><strong>{ufp_eq}</strong></td>
                </tr>
                <tr>
                  <td><strong>Internal Logical Files (ILF)</strong><div style={{ fontSize: '10px', color: '#64748b' }}>wt: 7 / 10 / 15</div></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.ilf_simple} onChange={e => handleCountChange('ilf_simple', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.ilf_avg} onChange={e => handleCountChange('ilf_avg', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.ilf_complex} onChange={e => handleCountChange('ilf_complex', e.target.value)} /></td>
                  <td><strong>{ufp_ilf}</strong></td>
                </tr>
                <tr>
                  <td><strong>External Interface Files (EIF)</strong><div style={{ fontSize: '10px', color: '#64748b' }}>wt: 5 / 7 / 10</div></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eif_simple} onChange={e => handleCountChange('eif_simple', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eif_avg} onChange={e => handleCountChange('eif_avg', e.target.value)} /></td>
                  <td><input type="number" min="0" className="form-input" style={{ width: '60px', padding: '3px' }} value={counts.eif_complex} onChange={e => handleCountChange('eif_complex', e.target.value)} /></td>
                  <td><strong>{ufp_eif}</strong></td>
                </tr>
                <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                  <td colSpan="4">TOTAL UNADJUSTED FUNCTION POINTS (UFP):</td>
                  <td style={{ color: '#2563eb', fontSize: '14px' }}>{ufp}</td>
                </tr>
              </tbody>
            </table>

            {/* General System Characteristics */}
            <div style={{ padding: '14px', borderTop: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>Total Degree of Influence (TDI = &Sigma; GSC 1..14):</span>
                <strong>{tdi} / 70</strong>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                value={tdi}
                onChange={e => setTdi(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Formula: VAF = 0.65 + (0.01 &times; TDI) = <strong>{vaf.toFixed(2)}</strong> | Adjusted FP = UFP &times; VAF = <strong style={{ color: '#0f172a' }}>{afp}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Basic COCOMO Estimation */}
        <div>
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="panel-header">
              <span className="panel-title">2. Basic COCOMO Estimation</span>
            </div>
            <div className="panel-body">
              <div className="form-group">
                <label className="form-label">Project Mode:</label>
                <select
                  className="form-select"
                  value={cocomoMode}
                  onChange={e => setCocomoMode(e.target.value)}
                >
                  <option value="Organic">Organic (Small team, familiar environment: a=2.4, b=1.05, c=2.5, d=0.38)</option>
                  <option value="Semi-detached">Semi-detached (Medium team, mixed experience: a=3.0, b=1.12, c=2.5, d=0.35)</option>
                  <option value="Embedded">Embedded (Tight constraints, complex requirements: a=3.6, b=1.20, c=2.5, d=0.32)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Language Expansion Factor (LOC per FP):</label>
                <input
                  type="number"
                  min="20"
                  max="150"
                  className="form-input"
                  value={locPerFp}
                  onChange={e => setLocPerFp(parseInt(e.target.value) || 50)}
                />
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>
                  Computation Output:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>Estimated Code Size: <strong>{totalLoc} LOC</strong> ({kloc} KLOC)</div>
                  <div>Adjusted FP: <strong>{afp} FP</strong></div>
                  <div>Estimated Effort: <strong style={{ color: '#2563eb' }}>{effort} Person-Months</strong></div>
                  <div>Development Time (Tdev): <strong style={{ color: '#15803d' }}>{tdev} Months</strong></div>
                  <div>Average Team Size: <strong>{staffing} Persons</strong></div>
                  <div>Productivity: <strong>{productivity} LOC/PM</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Formulas Reference */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Standard Academic Formulas</span>
            </div>
            <div className="panel-body" style={{ fontSize: '11px', color: '#334155', lineHeight: '1.6' }}>
              <div><strong>1. Value Adjustment Factor:</strong> <code>VAF = 0.65 + 0.01 &times; &Sigma;(Fi)</code></div>
              <div><strong>2. Adjusted Function Point:</strong> <code>AFP = UFP &times; VAF</code></div>
              <div><strong>3. Basic COCOMO Effort:</strong> <code>Effort = a &times; (KLOC)^b [PM]</code></div>
              <div><strong>4. Development Time:</strong> <code>Tdev = c &times; (Effort)^d [Months]</code></div>
              <div><strong>5. Staffing Estimation:</strong> <code>Staff = Effort / Tdev [Persons]</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
