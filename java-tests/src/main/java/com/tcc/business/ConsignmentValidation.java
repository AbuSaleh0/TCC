package com.tcc.business;

public class ConsignmentValidation {

    public static class ValidationResult {
        public boolean isValid;
        public String errorMessage;

        public ValidationResult(boolean isValid, String errorMessage) {
            this.isValid = isValid;
            this.errorMessage = errorMessage;
        }
    }

    public ValidationResult validate(String consignor, String consignee, int sourceBranchId, int destBranchId, double weightKg, double distanceKm) {
        if (consignor == null || consignor.trim().isEmpty()) {
            return new ValidationResult(false, "Consignor name cannot be empty");
        }
        if (consignee == null || consignee.trim().isEmpty()) {
            return new ValidationResult(false, "Consignee name cannot be empty");
        }
        if (sourceBranchId <= 0 || destBranchId <= 0) {
            return new ValidationResult(false, "Source and destination branch IDs must be valid positive integers");
        }
        if (sourceBranchId == destBranchId) {
            return new ValidationResult(false, "Source and destination branches cannot be the same");
        }
        if (weightKg <= 0.0) {
            return new ValidationResult(false, "Weight must be strictly greater than 0 kg");
        }
        if (distanceKm <= 0.0) {
            return new ValidationResult(false, "Distance must be strictly greater than 0 km");
        }

        return new ValidationResult(true, "Validation passed successfully");
    }
}
