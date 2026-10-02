package com.tcc.business;

public class StandaloneTestRunner {

    private static int passed = 0;
    private static int failed = 0;

    private static void check(String testName, boolean condition, String details) {
        if (condition) {
            System.out.println("  [PASS] " + testName);
            passed++;
        } else {
            System.err.println("  [FAIL] " + testName + " -> " + details);
            failed++;
        }
    }

    public static void main(String[] args) {
        System.out.println("===================================================================");
        System.out.println("  CS387 SE LAB - EXPERIMENT 10: AUTOMATED JAVA TEST SUITE EXECUTION");
        System.out.println("  Target System: Transport Company Computerisation (TCC)");
        System.out.println("===================================================================");

        // 1. Charge Calculation Tests
        System.out.println("\n--- Testing ChargeCalculation Module ---");
        ChargeCalculation calc = new ChargeCalculation(450.0, 10.0, 2.5, 18.0);
        ChargeCalculation.TariffResult r1 = calc.calculate(500.0, 200.0, "General Goods");
        check("TC-CHARGE-01: Positive Standard Booking (Total ₹4366)", r1.totalCharge == 4366.0, "Expected 4366.0, got " + r1.totalCharge);

        ChargeCalculation.TariffResult r2 = calc.calculate(100.0, 50.0, "Fragile");
        check("TC-CHARGE-02: Positive Fragile Surcharge (Total ₹1770)", r2.totalCharge == 1770.0, "Expected 1770.0, got " + r2.totalCharge);

        ChargeCalculation.TariffResult r3 = calc.calculate(0.0, 0.0, "General Goods");
        check("TC-CHARGE-03: Boundary Zero Weight (Total ₹531)", r3.totalCharge == 531.0, "Expected 531.0, got " + r3.totalCharge);

        boolean negExThrown = false;
        try { calc.calculate(-100.0, 50.0, "General Goods"); } catch (IllegalArgumentException e) { negExThrown = true; }
        check("TC-CHARGE-04: Negative Weight Exception Thrown", negExThrown, "Expected IllegalArgumentException");

        // 2. Truck Allocation Tests
        System.out.println("\n--- Testing TruckAllocation Module ---");
        TruckAllocation alloc = new TruckAllocation();
        TruckAllocation.AllocationCheck a1 = alloc.evaluateSuitability("Available", 10.0, 4500.0);
        check("TC-ALLOC-01: Positive Available Truck Suitability", a1.isAllocatable, a1.rejectionReason);

        TruckAllocation.AllocationCheck a2 = alloc.evaluateSuitability("Maintenance", 20.0, 1000.0);
        check("TC-ALLOC-02: Critical Security - Maintenance Truck Blocked", !a2.isAllocatable && a2.rejectionReason.contains("Maintenance"), a2.rejectionReason);

        TruckAllocation.AllocationCheck a3 = alloc.evaluateSuitability("In Transit", 16.0, 2000.0);
        check("TC-ALLOC-03: Negative - In Transit Truck Blocked", !a3.isAllocatable, a3.rejectionReason);

        TruckAllocation.AllocationCheck a4 = alloc.evaluateSuitability("Available", 5.0, 5000.0);
        check("TC-ALLOC-04: Boundary - Cargo Exactly Equals Capacity", a4.isAllocatable, a4.rejectionReason);

        TruckAllocation.AllocationCheck a5 = alloc.evaluateSuitability("Available", 5.0, 5001.0);
        check("TC-ALLOC-05: Boundary - Cargo Exceeds Capacity by 1kg", !a5.isAllocatable, a5.rejectionReason);

        // 3. Consignment Validation Tests
        System.out.println("\n--- Testing ConsignmentValidation Module ---");
        ConsignmentValidation val = new ConsignmentValidation();
        ConsignmentValidation.ValidationResult v1 = val.validate("Metro Retail", "Chandigarh Supermart", 1, 2, 1200.0, 250.0);
        check("TC-VAL-01: Positive - Valid Registration", v1.isValid, v1.errorMessage);

        ConsignmentValidation.ValidationResult v2 = val.validate("", "Chandigarh Supermart", 1, 2, 1200.0, 250.0);
        check("TC-VAL-02: Negative - Empty Consignor Rejected", !v2.isValid, v2.errorMessage);

        ConsignmentValidation.ValidationResult v3 = val.validate("Metro Retail", "Chandigarh Supermart", 1, 1, 1200.0, 250.0);
        check("TC-VAL-03: Negative - Same Source & Dest Branch Rejected", !v3.isValid, v3.errorMessage);

        ConsignmentValidation.ValidationResult v4 = val.validate("Metro Retail", "Chandigarh Supermart", 1, 2, 0.1, 10.0);
        check("TC-VAL-04: Boundary - Minimal Valid Weight (0.1kg)", v4.isValid, v4.errorMessage);

        ConsignmentValidation.ValidationResult v5 = val.validate("Metro Retail", "Chandigarh Supermart", 1, 2, 0.0, 100.0);
        check("TC-VAL-05: Boundary - Zero Weight Rejected", !v5.isValid, v5.errorMessage);

        // 4. COCOMO Calculation Tests
        System.out.println("\n--- Testing COCOMOCalculation Module ---");
        COCOMOCalculation cocomo = new COCOMOCalculation();
        COCOMOCalculation.COCOMOResult c1 = cocomo.calculateBasic(32.0, "Organic");
        check("TC-COCOMO-01: Positive - Basic Organic Mode", c1.effort > 80.0 && c1.tdev > 10.0, "Effort=" + c1.effort);

        COCOMOCalculation.COCOMOResult c2 = cocomo.calculateIntermediate(10.0, "Organic", 1.15);
        check("TC-COCOMO-02: Positive - Intermediate Mode with EAF", c2.effort > 0.0, "Effort=" + c2.effort);

        boolean cocomoEx = false;
        try { cocomo.calculateBasic(-5.0, "Organic"); } catch (IllegalArgumentException e) { cocomoEx = true; }
        check("TC-COCOMO-03: Negative - Negative KLOC Rejected", cocomoEx, "Expected IllegalArgumentException");

        System.out.println("\n===================================================================");
        System.out.println("  TEST EXECUTION SUMMARY: " + passed + " PASSED, " + failed + " FAILED (TOTAL: " + (passed + failed) + ")");
        System.out.println("  STATUS: " + (failed == 0 ? "ALL TESTS PASSED (100% SUCCESS)" : "TEST FAILURES DETECTED"));
        System.out.println("===================================================================");

        if (failed > 0) {
            System.exit(1);
        }
    }
}
