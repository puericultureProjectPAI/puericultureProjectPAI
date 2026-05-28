package com.puericulture.secondhand.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SecondHandDto {

    private Long productId;
    private String title;
    private String description;
    private Long price;
    private String condition;
    private String city;
    private String category;
    private UUID authorId;
}
