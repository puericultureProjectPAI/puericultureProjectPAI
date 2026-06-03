package com.puericulture.common.service;

import com.puericulture.common.dto.ProductImageDto;
import com.puericulture.common.entity.Product;
import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.mapper.ProductImageMapper;
import com.puericulture.common.repository.ProductImageRepository;
import com.puericulture.common.repository.ProductRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public List<ProductImageDto> getImagesByProductId(Long productId) {
        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(
                                () -> new NotFoundException("Produit introuvable : " + productId));
        return product.getImages().stream().map(productImageMapper::toDto).toList();
    }

    @Transactional
    public ProductImageDto addImage(String imageUrl, Long productId, UUID authorId) {
        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(
                                () -> new NotFoundException("Produit introuvable : " + productId));

        if (!product.getAuthor().getId().equals(authorId)) {
            throw new ForbiddenException(
                    "Vous n'êtes pas autorisé à modifier les images de ce produit.");
        }

        int currentCount = product.getImages().size();
        if (currentCount >= MAX_IMAGES_PER_PRODUCT) {
            throw new BadRequestException(
                    "Maximum " + MAX_IMAGES_PER_PRODUCT + " images par produit");
        }

        ProductImage entity = new ProductImage();
        entity.setProduct(product);
        entity.setImageUrl(imageUrl);
        entity.setPosition(currentCount + 1);

        return productImageMapper.toDto(productImageRepository.save(entity));
    }

    @Transactional
    public void deleteImage(Long id, UUID requesterId) {
        ProductImage image =
                productImageRepository
                        .findById(id)
                        .orElseThrow(() -> new NotFoundException("Image introuvable : " + id));

        if (!image.getProduct().getAuthor().getId().equals(requesterId)) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer cette image.");
        }

        productImageRepository.delete(image);
    }
}
