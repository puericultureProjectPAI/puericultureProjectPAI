package com.puericulture.common.dto;

import java.sql.Date;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public abstract class ProductDto {

    /*
       Classe abstraite: les DTO pourront l'étendre pour récupérer directement toutes les infos d'un Product
    */

    private Long id;
    private String postTitle;
    private LocalDateTime postDate;
    private String city;
    private String description;
    private String category;

    private Date lastCheckDate;
    private String securityStandard;
    private Integer maxWeightKg;
    private String dimensions;
    private Integer minAgeMonths;
    private Integer maxAgeMonths;
    private String brand;
    private String model;

    private PersonDto author;
}
