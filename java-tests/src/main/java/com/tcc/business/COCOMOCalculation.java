package com.tcc.business;

public class COCOMOCalculation {

    public static class COCOMOResult {
        public double effort;
        public double tdev;
        public double averageStaffing;
    }

    public COCOMOResult calculateBasic(double kloc, String mode) {
        if (kloc <= 0) {
            throw new IllegalArgumentException("KLOC must be greater than 0");
        }

        double a, b, c, d;
        if ("Embedded".equalsIgnoreCase(mode)) {
            a = 3.6; b = 1.20; c = 2.5; d = 0.32;
        } else if ("Semi-detached".equalsIgnoreCase(mode)) {
            a = 3.0; b = 1.12; c = 2.5; d = 0.35;
        } else { // Organic
            a = 2.4; b = 1.05; c = 2.5; d = 0.38;
        }

        COCOMOResult res = new COCOMOResult();
        res.effort = Math.round((a * Math.pow(kloc, b)) * 100.0) / 100.0;
        res.tdev = Math.round((c * Math.pow(res.effort, d)) * 100.0) / 100.0;
        res.averageStaffing = res.tdev > 0 ? Math.round((res.effort / res.tdev) * 10.0) / 10.0 : 0.0;
        return res;
    }

    public COCOMOResult calculateIntermediate(double kloc, String mode, double eaf) {
        if (kloc <= 0 || eaf <= 0) {
            throw new IllegalArgumentException("KLOC and EAF must be positive");
        }

        double a, b, c, d;
        if ("Embedded".equalsIgnoreCase(mode)) {
            a = 2.8; b = 1.20; c = 2.5; d = 0.32;
        } else if ("Semi-detached".equalsIgnoreCase(mode)) {
            a = 3.0; b = 1.12; c = 2.5; d = 0.35;
        } else { // Organic
            a = 3.2; b = 1.05; c = 2.5; d = 0.38;
        }

        COCOMOResult res = new COCOMOResult();
        double nominalEffort = a * Math.pow(kloc, b);
        res.effort = Math.round((nominalEffort * eaf) * 100.0) / 100.0;
        res.tdev = Math.round((c * Math.pow(res.effort, d)) * 100.0) / 100.0;
        res.averageStaffing = res.tdev > 0 ? Math.round((res.effort / res.tdev) * 10.0) / 10.0 : 0.0;
        return res;
    }
}
