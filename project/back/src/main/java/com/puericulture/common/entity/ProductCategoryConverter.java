package com.puericulture.common.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProductCategoryConverter implements AttributeConverter<ProductCategory, String> {

    @Override
    public String convertToDatabaseColumn(ProductCategory attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public ProductCategory convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        String clean = dbData.trim();
        // Exact match of enum constant name
        for (ProductCategory c : ProductCategory.values()) {
            if (c.name().equalsIgnoreCase(clean)) {
                return c;
            }
        }
        // Robust mapping of legacy seed strings to the official enum constants
        switch (clean.toLowerCase()) {
            case "poussette":
            case "siège auto":
            case "siege auto":
            case "transat":
            case "transport":
                return ProductCategory.TRANSPORT_BEBE;
            case "bain":
                return ProductCategory.BAIN_CHANGE;
            case "couchage":
            case "sommeil":
                return ProductCategory.SOMMEIL_LITERIE;
            case "éveil":
            case "eveil":
            case "jeux":
            case "jouets":
                return ProductCategory.JEUX_JOUETS;
            case "vêtement":
            case "vetement":
            case "vêtements":
            case "vetements":
                return ProductCategory.VETEMENTS;
            case "chaussure":
            case "chaussures":
            case "chausson":
            case "chaussons":
                return ProductCategory.AUTRES;
            default:
                try {
                    return ProductCategory.fromLabel(dbData);
                } catch (Exception e) {
                    return ProductCategory.AUTRES; // Fallback instead of crashing
                }
        }
    }
}
