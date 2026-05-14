package com.puericulture.leasing.dto;

import com.puericulture.common.dto.ProductDto;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class LeasingArticleDetailDto extends ProductDto {

    private Long pricePerMonth;
    private Long pricePerDay;
    private List<String> imageUrls;
}
