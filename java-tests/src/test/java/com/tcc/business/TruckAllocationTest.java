package com.tcc.business;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class TruckAllocationTest {

    private TruckAllocation allocator;

    @BeforeEach
    public void setUp() {
        allocator = new TruckAllocation();
    }

    @Test
    @DisplayName("TC-ALLOC-01: Positive Test - Available Truck with Sufficient Capacity")
    public void testAvailableTruckSufficientCapacity() {
        // Truck 10 Tons, Cargo 4500 kg (4.5 Tons) -> Must Accept
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
    @DisplayName("TC-ALLOC-03: Negative Test - In Transit Truck Cannot be Re-allocated")
    public void testInTransitTruckCannotBeAllocated() {
        TruckAllocation.AllocationCheck res = allocator.evaluateSuitability("In Transit", 16.0, 2000.0);
        assertFalse(res.isAllocatable);
        assertTrue(res.rejectionReason.contains("not Available"));
    }

    @Test
    @DisplayName("TC-ALLOC-04: Boundary Test - Cargo Weight Exactly Equals Truck Capacity")
    public void testExactCapacityMatch() {
        // 5.0 Tons truck with 5000 kg cargo -> Exactly meets capacity -> Must Accept
        TruckAllocation.AllocationCheck res = allocator.evaluateSuitability("Available", 5.0, 5000.0);
        assertTrue(res.isAllocatable);
    }

    @Test
    @DisplayName("TC-ALLOC-05: Boundary/Negative Test - Cargo Weight Exceeds Capacity by 1 kg")
    public void testCapacityExceededByMinimalBoundary() {
        // 5.0 Tons truck (5000 kg capacity) with 5001 kg cargo -> Must Reject
        TruckAllocation.AllocationCheck res = allocator.evaluateSuitability("Available", 5.0, 5001.0);
        assertFalse(res.isAllocatable);
        assertTrue(res.rejectionReason.contains("less than cargo weight"));
    }
}
