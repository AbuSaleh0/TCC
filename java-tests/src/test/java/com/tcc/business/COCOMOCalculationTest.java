package com.tcc.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class COCOMOCalculationTest {

    private COCOMOCalculation calculator;

    @BeforeEach
    public void setUp() {
        calculator = new COCOMOCalculation();
    }

    @Test
    @DisplayName("TC-COCOMO-01: Positive Test - Basic COCOMO Organic Mode (32 KLOC)")
    public void testBasicOrganicMode() {
        // Organic: a = 2.4, b = 1.05, c = 2.5, d = 0.38
        // Effort = 2.4 * (32 ^ 1.05) ~ 91.3 PM
        COCOMOCalculation.COCOMOResult res = calculator.calculateBasic(32.0, "Organic");
        assertTrue(res.effort > 80.0 && res.effort < 100.0);
        assertTrue(res.tdev > 10.0 && res.tdev < 20.0);
        assertTrue(res.averageStaffing > 0.0);
    }

    @Test
    @DisplayName("TC-COCOMO-02: Positive Test - Intermediate COCOMO with EAF = 1.15")
    public void testIntermediateCOCOMO() {
        COCOMOCalculation.COCOMOResult res = calculator.calculateIntermediate(10.0, "Organic", 1.15);
        assertTrue(res.effort > 0.0);
        assertTrue(res.tdev > 0.0);
    }

    @Test
    @DisplayName("TC-COCOMO-03: Negative Test - Negative KLOC Must Throw Exception")
    public void testNegativeKLOCThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            calculator.calculateBasic(-5.0, "Organic");
        });
    }

    @Test
    @DisplayName("TC-COCOMO-04: Boundary Test - Minimal Sizing (0.1 KLOC)")
    public void testMinimalSizingBoundary() {
        COCOMOCalculation.COCOMOResult res = calculator.calculateBasic(0.1, "Organic");
        assertTrue(res.effort > 0.0);
        assertTrue(res.tdev > 0.0);
    }
}
