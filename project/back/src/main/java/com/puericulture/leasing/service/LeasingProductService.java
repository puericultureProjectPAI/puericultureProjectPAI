package com.puericulture.leasing.service;

import com.puericulture.leasing.dto.LeasingProductSummaryDto;
import com.puericulture.leasing.mapper.LeasingProductMapper;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeasingProductService {

    private final LeasingProductRepository leasingProductRepository;
    private final LeasingProductMapper leasingProductMapper;

    @Transactional(readOnly = true)
    public List<LeasingProductSummaryDto> findAll() {
        return leasingProductRepository.findAllWithAvailability().stream()
                .map(leasingProductMapper::toDto)
                .toList();
    }
}
