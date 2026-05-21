package com.puericulture.common.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.puericulture.common.dto.ProductImageDto;
import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.Product;
import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.mapper.ProductImageMapper;
import com.puericulture.common.repository.ProductImageRepository;
import com.puericulture.common.repository.ProductRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.ForbiddenException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class ProductImageServiceTest {

    @Mock private ProductImageRepository productImageRepository;
    @Mock private ProductImageMapper productImageMapper;
    @Mock private ProductRepository productRepository;

    @InjectMocks private ProductImageService service;

    private Product product;
    private List<ProductImage> images;

    private static final UUID OWNER_ID = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        images = new ArrayList<>();
        product = mock(Product.class);
        when(product.getImages()).thenReturn(images);

        Person author = mock(Person.class);
        when(author.getId()).thenReturn(OWNER_ID);
        when(product.getAuthor()).thenReturn(author);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(OWNER_ID.toString());
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getImagesByProductId_returnsMappedImages() {
        ProductImage image = new ProductImage();
        images.add(image);

        ProductImageDto dto = new ProductImageDto();
        dto.setImageUrl("https://example.com/photo.jpg");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productImageMapper.toDto(image)).thenReturn(dto);

        List<ProductImageDto> result = service.getImagesByProductId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getImageUrl()).isEqualTo("https://example.com/photo.jpg");
    }

    @Test
    void getImagesByProductId_throwsNotFoundException_whenProductNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getImagesByProductId(99L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void addImage_savesAndReturnsMappedDto() {
        ProductImage saved = new ProductImage();
        ProductImageDto dto = new ProductImageDto();
        dto.setImageUrl("https://example.com/new.jpg");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productImageRepository.save(any(ProductImage.class))).thenReturn(saved);
        when(productImageMapper.toDto(saved)).thenReturn(dto);

        ProductImageDto result = service.addImage("https://example.com/new.jpg", 1L);

        assertThat(result.getImageUrl()).isEqualTo("https://example.com/new.jpg");
        verify(productImageRepository).save(any(ProductImage.class));
    }

    @Test
    void addImage_throwsForbiddenException_whenCallerIsNotOwner() {
        Person otherAuthor = mock(Person.class);
        when(otherAuthor.getId()).thenReturn(UUID.randomUUID());
        when(product.getAuthor()).thenReturn(otherAuthor);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> service.addImage("https://example.com/photo.jpg", 1L))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void addImage_throwsNotFoundException_whenProductNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.addImage("https://example.com/photo.jpg", 99L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void addImage_throwsBadRequestException_whenMaxImagesReached() {
        for (int i = 0; i < 5; i++) {
            images.add(new ProductImage());
        }
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> service.addImage("https://example.com/extra.jpg", 1L))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void deleteImage_callsDeleteById() {
        service.deleteImage(42L);

        verify(productImageRepository).deleteById(42L);
    }
}
