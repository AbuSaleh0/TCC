package com.tcc.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class ConsignmentValidationTest {

    private ConsignmentValidation validator;

    @BeforeEach
    public void setUp() {
        validator = new ConsignmentValidation();
    }

    @Test
    @DisplayName("TC-VAL-01: Positive Test - Valid Consignment Registration")
    public void testValidConsignment() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "Metro Retail", "Chandigarh Supermart", 1, 2, 1200.0, 250.0
        );
        assertTrue(r.isValid);
        assertEquals("Validation passed successfully", r.errorMessage);
    }

    @Test
    @DisplayName("TC-VAL-02: Negative Test - Empty Consignor Name")
    public void testEmptyConsignorFails() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "", "Chandigarh Supermart", 1, 2, 1200.0, 250.0
        );
        assertFalse(r.isValid);
        assertTrue(r.errorMessage.contains("Consignor name"));
    }

    @Test
    @DisplayName("TC-VAL-03: Negative Test - Source and Destination Same Branch")
    public void testSameSourceAndDestinationFails() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "Metro Retail", "Chandigarh Supermart", 1, 1, 1200.0, 250.0
        );
        assertFalse(r.isValid);
        assertTrue(r.errorMessage.contains("cannot be the same"));
    }

    @Test
    @DisplayName("TC-VAL-04: Boundary Test - Minimal Valid Cargo Weight (0.1 kg)")
    public void testMinimalValidWeight() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "Metro Retail", "Chandigarh Supermart", 1, 2, 0.1, 10.0
        );
        assertTrue(r.isValid);
    }

    @Test
    @DisplayName("TC-VAL-05: Boundary/Negative Test - Zero Weight Must Fail")
    public void testZeroWeightFails() {
        ConsignmentValidation.ValidationResult r = validator.validate(
            "Metro Retail", "Chandigarh Supermart", 1, 2, 0.0, 100.0
        );
        assertFalse(r.isValid);
        assertTrue(r.errorMessage.contains("Weight must be strictly greater than 0"));
    }
}
