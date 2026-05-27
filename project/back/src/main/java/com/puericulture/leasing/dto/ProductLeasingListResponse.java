package com.puericulture.leasing.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Réponse paginée de la liste des produits en location")
public class ProductLeasingListResponse {

    @Schema(description = "Indique si la requête a réussi", example = "true")
    private boolean success;

    @Schema(description = "Nombre de résultats", example = "3")
    private int count;

    @Schema(description = "Liste des produits")
    private List<ProductLeasingResponse> data;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Message contextuel optionnel", example = "Aucun produit trouvé pour ces critères")
    private String message;
}
