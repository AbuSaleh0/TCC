package com.tcc.business;

public class ChargeCalculation {
    private double baseRate = 450.0;
    private double ratePerKm = 10.0;
    private double ratePerKg = 2.5;
    private double taxPercentage = 18.0;

    public ChargeCalculation() {}

    public ChargeCalculation(double baseRate, double ratePerKm, double ratePerKg, double taxPercentage) {
        this.baseRate = baseRate;
        this.ratePerKm = ratePerKm;
        this.ratePerKg = ratePerKg;
        this.taxPercentage = taxPercentage;
    }

    public static class TariffResult {
        public double baseCharge;
        public double weightCharge;
        public double distanceCharge;
        public double categorySurcharge;
        public double subtotal;
        public double taxAmount;
        public double totalCharge;
    }

    public TariffResult calculate(double weightKg, double distanceKm, String category) {
        if (weightKg < 0) {
            throw new IllegalArgumentException("Weight cannot be negative");
        }
        if (distanceKm < 0) {
            throw new IllegalArgumentException("Distance cannot be negative");
        }

        TariffResult res = new TariffResult();
        res.baseCharge = Math.round(baseRate * 100.0) / 100.0;
        res.weightCharge = Math.round(weightKg * ratePerKg * 100.0) / 100.0;
        res.distanceCharge = Math.round(distanceKm * ratePerKm * 100.0) / 100.0;

        double baseSum = res.baseCharge + res.weightCharge + res.distanceCharge;
        double multiplier = 1.0;

        if ("Fragile".equalsIgnoreCase(category)) {
            multiplier = 1.25;
        } else if ("Hazardous".equalsIgnoreCase(category)) {
            multiplier = 1.50;
        } else if ("Perishable".equalsIgnoreCase(category)) {
            multiplier = 1.35;
        }

        res.categorySurcharge = Math.round(baseSum * (multiplier - 1.0) * 100.0) / 100.0;
        res.subtotal = Math.round((baseSum + res.categorySurcharge) * 100.0) / 100.0;
        res.taxAmount = Math.round((res.subtotal * (taxPercentage / 100.0)) * 100.0) / 100.0;
        res.totalCharge = Math.round((res.subtotal + res.taxAmount) * 100.0) / 100.0;

        return res;
    }
}
