package com.puericulture.common.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ProductCategory {
    VETEMENTS("Vêtements (filles & garçons)"),
    JEUX_JOUETS("Jeux et jouets"),
    TRANSPORT_BEBE("Poussettes, porte-bébés et sièges auto"),
    MEUBLES_DECO("Meubles et décoration"),
    BAIN_CHANGE("Bain et change"),
    SECURITE_BEBE_ENFANT("Sécurité bébé et enfant"),
    ALLAITEMENT_ALIMENTATION("Allaitement et alimentation"),
    SOMMEIL_LITERIE("Sommeil et literie"),
    SANTE_GROSSESSE("Santé et grossesse"),
    AUTRES("Autres articles pour bébé et enfant");

    private final String label;

    @JsonCreator
    public static ProductCategory fromLabel(String label) {
        if (label == null) {
            return null;
        }
        for (ProductCategory c : values()) {
            if (c.label.equalsIgnoreCase(label) || c.name().equalsIgnoreCase(label)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown category label: " + label);
    }

    @JsonValue
    public String toJson() {
        return label;
    }
}
