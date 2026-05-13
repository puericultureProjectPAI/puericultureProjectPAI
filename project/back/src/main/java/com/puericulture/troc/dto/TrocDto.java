package com.puericulture.troc.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrocDto {

    private Long postId;

    private Long trocId;

    private String title;

    private String description;

    private boolean open = true;

    private Long estimatedPrice;

    private UUID authorId;

    private String authorName;

    private String city;

    private String category;

    private String imagesReferences;
}
