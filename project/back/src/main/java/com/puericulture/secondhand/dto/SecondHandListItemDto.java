package com.puericulture.secondhand.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Second-hand product list item")
public class SecondHandListItemDto {
    @Schema(description = "Product ID") private Long id;
    @Schema(description = "Product title") private String title;
    @Schema(description = "Product price in euros") private Long price;
    @Schema(description = "Product category") private String category;
    @Schema(description = "Product image URL") private String imageUrl;
}