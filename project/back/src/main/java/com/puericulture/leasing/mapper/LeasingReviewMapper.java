package com.puericulture.leasing.mapper;

import com.puericulture.leasing.dto.LeasingReviewDto;
import com.puericulture.leasing.dto.LeasingReviewSummary;
import org.mapstruct.Mapper;

/**
 * STRATEGIC INTENT: MapStruct mapper to transform SQL native query projections into API DTOs. WHY
 * THIS MATTERS: Decouples the database read layer from the API presentation layer, ensuring
 * compile-time safety and optimal performance without manual boilerplate code.
 */
@Mapper(componentModel = "spring")
public interface LeasingReviewMapper {

    /**
     * Converts a flat database projection summary into the review DTO returned by the GET endpoint.
     */
    LeasingReviewDto toDto(LeasingReviewSummary summary);
}
