package com.tcc.business;

public class TruckAllocation {

    public static class AllocationCheck {
        public boolean isAllocatable;
        public String rejectionReason;

        public AllocationCheck(boolean isAllocatable, String rejectionReason) {
            this.isAllocatable = isAllocatable;
            this.rejectionReason = rejectionReason;
        }
    }

    /**
     * Allocation rule:
     * 1. Vehicle status must be "Available"
     * 2. Vehicle must NOT be "Maintenance" or "In Transit" or "Assigned"
     * 3. Vehicle capacity (in Tons) must be >= cargo weight (in Tons)
     */
    public AllocationCheck evaluateSuitability(String vehicleStatus, double capacityTons, double cargoWeightKg) {
        if (vehicleStatus == null) {
            return new AllocationCheck(false, "Vehicle status cannot be null");
        }

        if ("Maintenance".equalsIgnoreCase(vehicleStatus)) {
            return new AllocationCheck(false, "REJECTED: Vehicle is currently under Maintenance!");
        }

        if (!"Available".equalsIgnoreCase(vehicleStatus)) {
            return new AllocationCheck(false, "REJECTED: Vehicle is in state '" + vehicleStatus + "' and is not Available!");
        }

        double cargoWeightTons = cargoWeightKg / 1000.0;
        if (capacityTons < cargoWeightTons) {
            return new AllocationCheck(false, "REJECTED: Vehicle capacity (" + capacityTons + " Tons) is less than cargo weight (" + cargoWeightTons + " Tons)!");
        }

        return new AllocationCheck(true, "ACCEPTED: Vehicle satisfies status and capacity criteria.");
    }
}
