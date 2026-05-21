package com.puericulture.common.entity;

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

    public static ProductCategory fromLabel(String label) {
        for (ProductCategory c : values()) {
            if (c.label.equalsIgnoreCase(label)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown category label: " + label);
    }
}
