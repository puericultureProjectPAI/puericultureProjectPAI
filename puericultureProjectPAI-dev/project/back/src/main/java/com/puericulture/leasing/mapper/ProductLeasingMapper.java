package com.puericulture.leasing.mapper;

import com.puericulture.leasing.dto.ProductLeasingResponse;
import com.puericulture.leasing.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;

/**
 * Mapper MapStruct pour Product → ProductLeasingResponse
 * Mappe  les données Product + ProductLeasing

 *

 */
@Mapper(componentModel = "spring", nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface ProductLeasingMapper {

    /**
     * Convertit Product → ProductLeasingResponse
     *
     * @param product entité Product contenant les données
     * @return ProductLeasingResponse prêt pour la réponse API
     */
    @Mapping(target = "productId", source = "id")
    @Mapping(target = "leasingId", source = "productLeasing.id")
    @Mapping(target = "pricePerMonth", source = "productLeasing.pricePerMonth")
    @Mapping(target = "pricePerDay", source = "productLeasing.pricePerDay")
    ProductLeasingResponse toProductLeasingResponse(Product product);
}

