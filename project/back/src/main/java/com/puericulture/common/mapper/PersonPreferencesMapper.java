package com.puericulture.common.mapper;

import com.puericulture.common.entity.FamilyStatus;
import com.puericulture.common.entity.PersonPreferences;
import com.puericulture.forwardtrading.dto.OnBoardingDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public abstract class PersonPreferencesMapper {

    @Mapping(target = "familyStatus", source = "familyStatus", qualifiedByName = "getFamilyStatus")
    @Mapping(
            target = "wantsMoreChildren",
            source = "futurePlans",
            qualifiedByName = "getFuturePlans")
    public abstract PersonPreferences toPersonPreferences(OnBoardingDto onBoardingDto);

    @Named("getFamilyStatus")
    public FamilyStatus getFamilyStatus(String familyStatus) {
        switch (familyStatus) {
            case "expecting":
                return FamilyStatus.FUTURE_PARENT;
            case "parent":
                return FamilyStatus.PARENT;
            case "both":
                return FamilyStatus.PARENT_AGAIN;
            default:
                return null;
        }
    }

    @Named("getFuturePlans")
    public Boolean getWantsMoreChildren(String futurePlans) {
        switch (futurePlans) {
            case "yes":
                return true;
            case "no":
                return false;
            case "undecided":
                return null;
            default:
                return null;
        }
    }
}
