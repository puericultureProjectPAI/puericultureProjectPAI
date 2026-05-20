package com.puericulture.leasing.service;

import com.puericulture.leasing.dto.LeasingProductSummary;
import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeasingProductService {

    private final LeasingProductRepository leasingProductRepository;

    @Transactional(readOnly = true)
    public List<LeasingProductSummaryDto> findAll() {
        return leasingProductRepository.findAllWithAvailability().stream()
                .map(this::toDto)
                .toList();
    }

    private LeasingProductSummaryDto toDto(LeasingProductSummary s) {
        return LeasingProductSummaryDto.builder()
                .id(s.getId())
                .postTitle(s.getPostTitle())
                .category(s.getCategory())
                .city(s.getCity())
                .pricePerDay(s.getPricePerDay())
                .pricePerMonth(s.getPricePerMonth())
                .condition(s.getCondition())
                .firstImageUrl(s.getFirstImageUrl())
                .available(Boolean.TRUE.equals(s.getAvailable()))
                .build();
    }
}
