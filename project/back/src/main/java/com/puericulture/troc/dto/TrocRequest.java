package com.puericulture.troc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrocRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    private String imagesReferences;

    @NotNull(message = "Le prix estimé est obligatoire")
    @PositiveOrZero(message = "Le prix estimé doit être positif ou égal à zéro")
    private Long estimatedPrice;

    private UUID authorId;
}
