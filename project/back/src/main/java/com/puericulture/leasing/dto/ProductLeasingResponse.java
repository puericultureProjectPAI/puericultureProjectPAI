package com.puericulture.leasing.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductLeasingResponse {

    private Long productId;
    private String postTitle;
    private String description;
    private LocalDateTime postDate;
    private String city;
    private String category;
    private String brand;
    private String model;
    private Long pricePerMonth;
    private Long pricePerDay;
}
