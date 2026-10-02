import React, { useState } from 'react';

export default function Exp10JUnitTesting() {
  const [activeCodeTab, setActiveCodeTab] = useState('test1');
  const [running, setRunning] = useState(false);
  const [testOutput, setTestOutput] = useState(null);
  const [ran, setRan] = useState(false);

  const handleRunTests = async () => {
    setRunning(true);
    setRan(true);
    try {
      const res = await fetch('/api/run-java-tests', { method: 'POST' });
      const data = await res.json();
      setTestOutput(data);
    } catch (err) {
      setTestOutput({
        success: false,
        stdout: '',
        stderr: err.message,
        passCount: 0,
        totalCount: 17
      });
    } finally {
      setRunning(false);
    }
  };

  const codeSnippets = {
    test1: `package com.tcc.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class ChargeCalculationTest {
    private ChargeCalculation engine;

    @BeforeEach
    public void setUp() {
        // Base: 450, Per-km: 10, Per-kg: 2.5, Tax: 18%
        engine = new ChargeCalculation(450.0, 10.0, 2.5, 18.0);
    }

    @Test
    @DisplayName("TC-CHARGE-01: Positive Test - Standard General Goods Booking")
    public void testStandardGeneralGoods() {
        ChargeCalculation.TariffResult r = engine.calculate(500.0, 200.0, "General Goods");
        assertEquals(450.0, r.baseCharge, 0.01);
        assertEquals(1250.0, r.weightCharge, 0.01);
        assertEquals(2000.0, r.distanceCharge, 0.01);
        assertEquals(3700.0, r.subtotal, 0.01);
        assertEquals(666.0, r.taxAmount, 0.01);
        assertEquals(4366.0, r.totalCharge, 0.01);
    }

    @Test
    @DisplayName("TC-CHARGE-02: Positive Test - Fragile Goods with 25% Surcharge")
    public void testFragileCategorySurcharge() {
        ChargeCalculation.TariffResult r = engine.calculate(100.0, 50.0, "Fragile");
        assertEquals(300.0, r.categorySurcharge, 0.01);
        assertEquals(1500.0, r.subtotal, 0.01);
        assertEquals(1770.0, r.totalCharge, 0.01);
    }

    @Test
    @DisplayName("TC-CHARGE-03: Boundary Test - Zero Weight and Zero Distance")
    public void testZeroWeightBoundary() {
        ChargeCalculation.TariffResult r = engine.calculate(0.0, 0.0, "General Goods");
        assertEquals(450.0, r.baseCharge, 0.01);
        assertEquals(531.0, r.totalCharge, 0.01);
    }

    @Test
    @DisplayName("TC-CHARGE-04: Negative Test - Negative Weight Must Throw Exception")
    public void testNegativeWeightThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            engine.calculate(-150.0, 100.0, "General Goods");
        });
    }
}`,
    test2: `package com.tcc.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class TruckAllocationTest {
    private TruckAllocation allocator = new TruckAllocation();

    @Test
    @DisplayName("TC-ALLOC-01: Positive Test - Available Truck with Sufficient Capacity")
    public void testAvailableTruckSufficientCapacity() {
        TruckAllocation.AllocationCheck res = allocator.evaluateSuitability("Available", 10.0, 4500.0);
        assertTrue(res.isAllocatable);
        assertTrue(res.rejectionReason.contains("ACCEPTED"));
    }

    @Test
    @DisplayName("TC-ALLOC-02: Critical Security Test - Maintenance Truck Must be Blocked")
    public void testMaintenanceTruckStrictlyBlocked() {
        // Even with 20 Tons capacity, Maintenance status MUST reject
        TruckAllocation.AllocationCheck res = allocator.evaluateSuitability("Maintenance", 20.0, 1000.0);
        assertFalse(res.isAllocatable);
        assertTrue(res.rejectionReason.contains("REJECTED"));
        assertTrue(res.rejectionReason.contains("Maintenance"));
    }

    @Test
    @DisplayName("TC-ALLOC-03: Boundary Test - Cargo Weight Exactly Equals Truck Capacity")
    public void testExactCapacityMatch() {
        TruckAllocation.AllocationCheck res = allocator.evaluateSuitability("Available", 5.0, 5000.0);
        assertTrue(res.isAllocatable);
    }

    @Test
    @DisplayName("TC-ALLOC-04: Boundary/Negative Test - Cargo Exceeds Capacity by 1 kg")
    public void testCapacityExceededByMinimalBoundary() {
        TruckAllocation.AllocationCheck res = allocator.evaluateSuitability("Available", 5.0, 5001.0);
        assertFalse(res.isAllocatable);
        assertTrue(res.rejectionReason.contains("less than cargo weight"));
    }
}`,
    test3: `package com.tcc.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class ConsignmentValidationTest {
    private ConsignmentValidation validator = new ConsignmentValidation();

    @Test
    @DisplayName("TC-VAL-01: Positive Test - Valid Consignment Registration")
    public void testValidConsignment() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "Metro Retail", "Chandigarh Supermart", 1, 2, 1200.0, 250.0
        );
        assertTrue(r.isValid);
    }

    @Test
    @DisplayName("TC-VAL-02: Negative Test - Source and Destination Same Branch")
    public void testSameSourceAndDestinationFails() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "Metro Retail", "Chandigarh Supermart", 1, 1, 1200.0, 250.0
        );
        assertFalse(r.isValid);
        assertTrue(r.errorMessage.contains("cannot be the same"));
    }

    @Test
    @DisplayName("TC-VAL-03: Boundary/Negative Test - Zero Weight Must Fail")
    public void testZeroWeightFails() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "Metro Retail", "Chandigarh Supermart", 1, 2, 0.0, 100.0
        );
        assertFalse(r.isValid);
    }
}`,
    test4: `package com.tcc.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class COCOMOCalculationTest {
    private COCOMOCalculation calc = new COCOMOCalculation();

    @Test
    @DisplayName("TC-COCOMO-01: Positive Test - Basic Organic Mode (32 KLOC)")
    public void testBasicOrganicMode() {
        COCOMOCalculation.COCOMOResult res = calc.calculateBasic(32.0, "Organic");
        assertTrue(res.effort > 80.0 && res.effort < 100.0);
        assertTrue(res.tdev > 10.0 && res.tdev < 20.0);
    }

    @Test
    @DisplayName("TC-COCOMO-02: Negative Test - Negative KLOC Must Throw Exception")
    public void testNegativeKLOCThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            calc.calculateBasic(-5.0, "Organic");
        });
    }
}`,
    pom: `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.tcc</groupId>
    <artifactId>tcc-transport-tests</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <junit.jupiter.version>5.10.2</junit.jupiter.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>\${junit.jupiter.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>\${junit.jupiter.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          Experiment No. 10: Java Code Development &amp; JUnit 5 Test Case Execution
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          Unit testing transport company business rules (Tariffs, Truck Allocation, Input Validation, and COCOMO)
        </p>
      </div>

      {/* Execution Control Banner */}
      <div className="panel" style={{ marginBottom: '16px', background: '#f8fafc' }}>
        <div className="panel-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
              Standalone Java / JUnit 5 Test Engine
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Location: <code>/java-tests</code> &bull; Maven pom.xml &bull; 17 Test Cases (Positive, Negative, Boundary)
            </div>
          </div>
          <button
            onClick={handleRunTests}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontWeight: 'bold' }}
            disabled={running}
          >
            {running ? '⚙️ Compiling & Executing Java Tests...' : '▶ Run JUnit Test Suite'}
          </button>
        </div>
      </div>

      {/* Test Execution Output Console */}
      {ran && (
        <div className="panel" style={{ marginBottom: '16px' }}>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="panel-title">Real-Time Java Execution Console</span>
            {testOutput && (
              <span className={`badge badge-${testOutput.success ? 'completed' : 'cancelled'}`}>
                {testOutput.success ? '17 / 17 TESTS PASSED (100% SUCCESS)' : 'EXECUTION FAILED'}
              </span>
            )}
          </div>
          <div className="panel-body" style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '12px', padding: '16px', borderRadius: '0 0 4px 4px', maxHeight: '280px', overflowY: 'auto' }}>
            {running && <div style={{ color: '#60a5fa' }}>Compiling Java classes with javac and executing StandaloneTestRunner...</div>}
            {!running && testOutput && (
              <div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{testOutput.stdout || testOutput.stderr}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Classes Source Code Viewer */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Java Business Logic &amp; JUnit 5 Source Code</span>
        </div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
            <button
              onClick={() => setActiveCodeTab('test1')}
              className={`btn btn-sm ${activeCodeTab === 'test1' ? 'btn-primary' : 'btn-outline'}`}
            >
              ChargeCalculationTest.java
            </button>
            <button
              onClick={() => setActiveCodeTab('test2')}
              className={`btn btn-sm ${activeCodeTab === 'test2' ? 'btn-primary' : 'btn-outline'}`}
            >
              TruckAllocationTest.java
            </button>
            <button
              onClick={() => setActiveCodeTab('test3')}
              className={`btn btn-sm ${activeCodeTab === 'test3' ? 'btn-primary' : 'btn-outline'}`}
            >
              ConsignmentValidationTest.java
            </button>
            <button
              onClick={() => setActiveCodeTab('test4')}
              className={`btn btn-sm ${activeCodeTab === 'test4' ? 'btn-primary' : 'btn-outline'}`}
            >
              COCOMOCalculationTest.java
            </button>
            <button
              onClick={() => setActiveCodeTab('pom')}
              className={`btn btn-sm ${activeCodeTab === 'pom' ? 'btn-primary' : 'btn-outline'}`}
            >
              pom.xml
            </button>
          </div>

          <div style={{ background: '#1e293b', color: '#f1f5f9', padding: '14px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', maxHeight: '380px', overflowY: 'auto' }}>
            <pre style={{ margin: 0 }}>{codeSnippets[activeCodeTab]}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
