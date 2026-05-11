package com.puericulture.troc.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrocDto {

    private Long productId;

    private String title;

    private String description;

    private String imageUrl;

    private String category;

    private Long estimatedPrice;
}
