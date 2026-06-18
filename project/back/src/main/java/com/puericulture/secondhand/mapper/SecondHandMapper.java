package com.puericulture.secondhand.mapper;

import com.puericulture.common.mapper.PersonMapper;
import com.puericulture.common.mapper.ProductCategoryMapper;
import com.puericulture.secondhand.dto.SecondHandDetailDto;
import com.puericulture.secondhand.dto.SecondHandDto;
import com.puericulture.secondhand.entity.SecondHand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(
        componentModel = "spring",
        uses = {ProductCategoryMapper.class, PersonMapper.class})
public interface SecondHandMapper {

    @Mapping(source = "category", target = "category", qualifiedByName = "toLabel")
    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "id", target = "productId")
    @Mapping(source = "postTitle", target = "title")
    @Mapping(source = "city", target = "city")
    SecondHandDto toDto(SecondHand secondHand);

    @Mapping(target = "imageUrls", source = "images", qualifiedByName = "imagesToUrls")
    @Mapping(source = "category", target = "category", qualifiedByName = "toLabel")
    SecondHandDetailDto toDetailDto(SecondHand secondHand);

    @Named("imagesToUrls")
    default java.util.List<String> imagesToUrls(
            java.util.List<com.puericulture.common.entity.ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return images.stream()
                .map(com.puericulture.common.entity.ProductImage::getImageUrl)
                .toList();
    }
}
