package com.puericulture.troc.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrocDto {
    private Long id;
    private String title;
    private String description;
    private String imagesReferences;
    private boolean open;
    private Long estimatedPrice;
    private UUID authorId;
    private String authorName;
    private String category;
}
