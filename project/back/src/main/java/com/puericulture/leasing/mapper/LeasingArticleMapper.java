package com.puericulture.leasing.mapper;

import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.mapper.ProductCategoryMapper;
import com.puericulture.leasing.dto.LeasingArticleDetailDto;
import com.puericulture.leasing.entity.LeasingArticle;
import java.util.Collections;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(
        componentModel = "spring",
        uses = {ProductCategoryMapper.class})
public interface LeasingArticleMapper {

    @Mapping(target = "imageUrls", source = "images", qualifiedByName = "imagesToUrls")
    @Mapping(source = "category", target = "category", qualifiedByName = "toLabel")
    LeasingArticleDetailDto toDetailDto(LeasingArticle article);

    @Named("imagesToUrls")
    default List<String> imagesToUrls(List<ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return Collections.emptyList();
        }
        return images.stream().map(ProductImage::getImageUrl).toList();
    }
}
