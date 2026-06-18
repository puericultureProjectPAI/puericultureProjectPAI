package com.puericulture.troc.dto;

import com.puericulture.common.dto.ProductDto;
import com.puericulture.common.dto.ProductImageDto;
import com.puericulture.troc.entity.ProductTrocStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Data
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
public class ProductTrocDto extends ProductDto {

    private Long estimatedPrice;

    @Enumerated(EnumType.STRING)
    private ProductTrocStatus status;

    @Schema(description = "List of the product's images")
    private List<ProductImageDto> images;
}
