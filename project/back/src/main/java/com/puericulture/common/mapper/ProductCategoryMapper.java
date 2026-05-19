package com.puericulture.common.mapper;

import com.puericulture.common.entity.ProductCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {
    /*
    Pour utiliser la conversion de la catégorie, ajoutez à votre Mapper :

        - Dans le @Mapper -> uses = ProductCategoryMapper.class (utiliser {class1,class2,...} si il faut uiliser plusieurs mapper
        - Avant le toDto -> @Mapping(source = "category", target = "category", qualifiedByName = "toLabel")
        - Avant le toEntity -> @Mapping(source = "category", target = "category", qualifiedByName = "fromLabel")

     */

    @Named("fromLabel")
    default ProductCategory fromLabel(String label) {
        return ProductCategory.fromLabel(label);
    }

    @Named("toLabel")
    default String toLabel(ProductCategory category) {
        return category.getLabel();
    }
}
