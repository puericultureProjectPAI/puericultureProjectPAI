package com.puericulture.common.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum FamilyStatus {
    /** New parent */
    FUTURE_PARENT("FUTURE_PARENT"),
    /** Parent not currently waiting for a new child */
    PARENT("PARENT"),
    /** Parent currently waiting for a new child */
    PARENT_AGAIN("PARENT_AGAIN");

    private final String code;

    FamilyStatus(String code) {
        this.code = code;
    }
}
