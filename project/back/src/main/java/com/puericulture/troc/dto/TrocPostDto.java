package com.puericulture.troc.dto;

import com.puericulture.common.dto.ProductDto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TrocPostDto extends ProductDto {

    private Long estimatedPrice;
}
