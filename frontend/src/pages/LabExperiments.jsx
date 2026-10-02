import React, { useState } from 'react';
import Exp1SRS from './lab/Exp1SRS.jsx';
import Exp2DFD from './lab/Exp2DFD.jsx';
import Exp3UseCaseClass from './lab/Exp3UseCaseClass.jsx';
import Exp4Sequence from './lab/Exp4Sequence.jsx';
import Exp5Communication from './lab/Exp5Communication.jsx';
import Exp6Activity from './lab/Exp6Activity.jsx';
import Exp7StateMachine from './lab/Exp7StateMachine.jsx';
import Exp8FunctionPointCOCOMO from './lab/Exp8FunctionPointCOCOMO.jsx';
import Exp9IntermediateCOCOMO from './lab/Exp9IntermediateCOCOMO.jsx';
import Exp10JUnitTesting from './lab/Exp10JUnitTesting.jsx';

export default function LabExperiments() {
  const [activeExp, setActiveExp] = useState(1);

  const experiments = [
    { num: 1, title: 'Exp 1: SRS & Context Diagram', component: <Exp1SRS /> },
    { num: 2, title: 'Exp 2: DFD, Data Dict & Structure', component: <Exp2DFD /> },
    { num: 3, title: 'Exp 3: Use Case & Class Diagram', component: <Exp3UseCaseClass /> },
    { num: 4, title: 'Exp 4: Sequence Diagrams', component: <Exp4Sequence /> },
    { num: 5, title: 'Exp 5: Communication Diagrams', component: <Exp5Communication /> },
    { num: 6, title: 'Exp 6: Activity Diagram', component: <Exp6Activity /> },
    { num: 7, title: 'Exp 7: State Machine Diagrams', component: <Exp7StateMachine /> },
    { num: 8, title: 'Exp 8: Function Point & Basic COCOMO', component: <Exp8FunctionPointCOCOMO /> },
    { num: 9, title: 'Exp 9: Intermediate COCOMO', component: <Exp9IntermediateCOCOMO /> },
    { num: 10, title: 'Exp 10: Java & JUnit Testing', component: <Exp10JUnitTesting /> }
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
          CS387 Software Engineering Laboratory (Experiments 1 to 10)
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Academic software engineering curriculum specifications directly mapped to the Transport Company Computerisation System
        </p>
      </div>

      {/* Experiment Selector Ribbon */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '16px',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {experiments.map(exp => (
          <button
            key={exp.num}
            onClick={() => setActiveExp(exp.num)}
            className={`btn btn-sm ${activeExp === exp.num ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '11px', padding: '5px 9px' }}
          >
            {exp.title}
          </button>
        ))}
      </div>

      {/* Render Active Experiment Component */}
      <div>
        {experiments.find(e => e.num === activeExp)?.component}
      </div>
    </div>
  );
}
