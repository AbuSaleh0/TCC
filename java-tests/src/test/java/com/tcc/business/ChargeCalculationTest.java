package com.tcc.business;

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
        // Base = 450
        // Weight = 500 * 2.5 = 1250
        // Distance = 200 * 10 = 2000
        // Subtotal = 450 + 1250 + 2000 = 3700
        // Tax = 3700 * 0.18 = 666
        // Total = 4366
        assertEquals(450.0, r.baseCharge, 0.01);
        assertEquals(1250.0, r.weightCharge, 0.01);
        assertEquals(2000.0, r.distanceCharge, 0.01);
        assertEquals(0.0, r.categorySurcharge, 0.01);
        assertEquals(3700.0, r.subtotal, 0.01);
        assertEquals(666.0, r.taxAmount, 0.01);
        assertEquals(4366.0, r.totalCharge, 0.01);
    }

    @Test
    @DisplayName("TC-CHARGE-02: Positive Test - Fragile Goods with 25% Surcharge")
    public void testFragileCategorySurcharge() {
        ChargeCalculation.TariffResult r = engine.calculate(100.0, 50.0, "Fragile");
        // Base = 450, Wt = 250, Dist = 500 -> BaseSum = 1200
        // Fragile Surcharge = 1200 * 0.25 = 300
        // Subtotal = 1500
        // Tax = 1500 * 0.18 = 270
        // Total = 1770
        assertEquals(300.0, r.categorySurcharge, 0.01);
        assertEquals(1500.0, r.subtotal, 0.01);
        assertEquals(1770.0, r.totalCharge, 0.01);
    }

    @Test
    @DisplayName("TC-CHARGE-03: Boundary Test - Zero Weight and Zero Distance")
    public void testZeroWeightBoundary() {
        ChargeCalculation.TariffResult r = engine.calculate(0.0, 0.0, "General Goods");
        assertEquals(450.0, r.baseCharge, 0.01);
        assertEquals(0.0, r.weightCharge, 0.01);
        assertEquals(0.0, r.distanceCharge, 0.01);
        assertEquals(450.0, r.subtotal, 0.01);
        assertEquals(81.0, r.taxAmount, 0.01);
        assertEquals(531.0, r.totalCharge, 0.01);
    }

    @Test
    @DisplayName("TC-CHARGE-04: Negative Test - Negative Weight Must Throw Exception")
    public void testNegativeWeightThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            engine.calculate(-150.0, 100.0, "General Goods");
        });
    }

    @Test
    @DisplayName("TC-CHARGE-05: Negative Test - Negative Distance Must Throw Exception")
    public void testNegativeDistanceThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            engine.calculate(150.0, -50.0, "General Goods");
        });
    }
}
