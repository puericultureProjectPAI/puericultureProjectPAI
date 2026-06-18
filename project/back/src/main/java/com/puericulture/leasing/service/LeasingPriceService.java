package com.puericulture.leasing.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Service;

@Service
public class LeasingPriceService {

    public long calculateDurationDays(LocalDate startDate, LocalDate endDate) {
        long durationDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        return Math.max(durationDays, 1);
    }

    public long calculateTotalPrice(
            Long pricePerMonth, Long pricePerDay, LocalDate startDate, LocalDate endDate) {
        return calculateTotalPrice(
                pricePerMonth, pricePerDay, calculateDurationDays(startDate, endDate));
    }

    public long calculateTotalPrice(Long pricePerMonth, Long pricePerDay, long durationDays) {
        long monthlyPrice = pricePerMonth != null ? pricePerMonth : 0L;
        long dailyPrice = pricePerDay != null ? pricePerDay : 0L;
        long months = durationDays / 30;
        long remainingDays = durationDays % 30;
        return (months * monthlyPrice) + (remainingDays * dailyPrice);
    }
}
