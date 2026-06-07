package com.puericulture.secondhand.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SecondHandListItemDto {
    private Long id;
    private String title;
    private Long price;
    private String category;
    private String imageUrl;
}