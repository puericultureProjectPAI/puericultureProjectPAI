package com.puericulture.forwardtrading.dto.family;

import com.puericulture.forwardtrading.dto.children.CreateChildren;
import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class FamilyFormDto {
    private String familyStatus;
    private LocalDate dueDate;
    private List<CreateChildren> children;
    private String futurePlans;
}
