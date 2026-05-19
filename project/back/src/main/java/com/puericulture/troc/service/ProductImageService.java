package com.puericulture.troc.service;

import com.puericulture.common.entity.Product;
import com.puericulture.common.repository.ProductRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.ProductImageDto;
import com.puericulture.troc.entity.ProductImage;
import com.puericulture.troc.mapper.ProductImageMapper;
import com.puericulture.troc.repository.ProductImageRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductImageService {

    private static final int MAX_IMAGES_PER_PRODUCT = 5;

    private final ProductImageRepository productImageRepository;
    private final ProductImageMapper productImageMapper;
    private final ProductRepository productRepository;

    @Autowired
    public ProductImageService(
            ProductImageRepository productImageRepository,
            ProductImageMapper productImageMapper,
            ProductRepository productRepository) {
        this.productImageRepository = productImageRepository;
        this.productImageMapper = productImageMapper;
        this.productRepository = productRepository;
    }

    public List<ProductImageDto> getImagesByProductId(Long productId) {
        return productImageRepository.findByProduct_Id(productId).stream()
                .map(productImageMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProductImageDto addImage(String imageUrl, Long productId) {
        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(
                                () -> new NotFoundException("Produit introuvable : " + productId));

        long currentCount = productImageRepository.countByProduct_Id(productId);
        if (currentCount >= MAX_IMAGES_PER_PRODUCT) {
            throw new BadRequestException(
                    "Maximum " + MAX_IMAGES_PER_PRODUCT + " images par produit");
        }

        ProductImage entity = new ProductImage();
        entity.setProduct(product);
        entity.setImageUrl(imageUrl);
        entity.setPosition((int) currentCount + 1);

        return productImageMapper.toDto(productImageRepository.save(entity));
    }

    public void deleteImage(Long id) {
        productImageRepository.deleteById(id);
    }
}
