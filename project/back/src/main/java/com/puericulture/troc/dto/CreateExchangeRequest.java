package com.puericulture.troc.dto;

import com.puericulture.troc.entity.ProductTroc;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateExchangeRequest {

    private ProductTroc proposerProduct;

    private ProductTroc receiverProduct;
}
