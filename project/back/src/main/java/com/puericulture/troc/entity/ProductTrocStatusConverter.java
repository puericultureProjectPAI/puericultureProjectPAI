package com.puericulture.troc.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProductTrocStatusConverter implements AttributeConverter<ProductTrocStatus, String> {

    @Override
    public String convertToDatabaseColumn(ProductTrocStatus status) {
        if (status == null) {
            return null;
        }
        // Save to DB in uppercase or leave as is, depending on preference.
        // If the DB already has "available", we can write uppercase going forward.
        return status.name();
    }

    @Override
    public ProductTrocStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return ProductTrocStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ProductTrocStatus.AVAILABLE; // fallback
        }
    }
}
