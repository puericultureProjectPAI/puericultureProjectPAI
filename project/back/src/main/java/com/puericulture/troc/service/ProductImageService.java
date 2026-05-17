package com.puericulture.troc.service;

import com.puericulture.common.entity.Product;
import com.puericulture.common.repository.ProductRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.ProductImageDto;
import com.puericulture.troc.entity.ProductImage;
import com.puericulture.troc.mapper.ProductImageMapper;
import com.puericulture.troc.repository.ProductImageRepository;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductImageService {

    private static final int MAX_IMAGES_PER_PRODUCT = 5;
    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/gif", "image/webp");

    private final ProductImageRepository productImageRepository;
    private final ProductImageMapper productImageMapper;
    private final SupabaseStorageService supabaseStorageService;
    private final ProductRepository productRepository;

    @Autowired
    public ProductImageService(
            ProductImageRepository productImageRepository,
            ProductImageMapper productImageMapper,
            SupabaseStorageService supabaseStorageService,
            ProductRepository productRepository) {
        this.productImageRepository = productImageRepository;
        this.productImageMapper = productImageMapper;
        this.supabaseStorageService = supabaseStorageService;
        this.productRepository = productRepository;
    }

    public List<ProductImageDto> getImagesByProductId(Long productId) {
        return productImageRepository.findByProduct_Id(productId).stream()
                .map(productImageMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProductImageDto uploadImage(MultipartFile file, Long productId) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new BadRequestException(
                    "Format non supporté. Formats acceptés : JPEG, PNG, GIF, WEBP");
        }

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

        String url = supabaseStorageService.upload(file, productId);

        ProductImage entity = new ProductImage();
        entity.setProduct(product);
        entity.setImageUrl(url);
        entity.setPosition((int) currentCount + 1);

        return productImageMapper.toDto(productImageRepository.save(entity));
    }

    public void deleteImage(Long id) {
        productImageRepository.deleteById(id);
    }
}
