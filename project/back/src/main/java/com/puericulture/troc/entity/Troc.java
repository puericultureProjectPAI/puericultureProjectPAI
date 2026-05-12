package com.puericulture.troc.entity;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Troc {
    private Long id;
    private String title;
    private String description;
    private String imagesReferences;
    private boolean open = true;
    private Long estimatedPrice;
    private UUID authorId;
    private String authorName;
    private String category = "Troc";
}
