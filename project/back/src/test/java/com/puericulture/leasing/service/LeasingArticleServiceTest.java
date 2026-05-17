package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.leasing.dto.LeasingArticleDetailDto;
import com.puericulture.leasing.entity.LeasingArticle;
import com.puericulture.leasing.mapper.LeasingArticleMapper;
import com.puericulture.leasing.repository.LeasingArticleRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeasingArticleServiceTest {

    @Mock private LeasingArticleRepository leasingArticleRepository;

    @Mock private LeasingArticleMapper leasingArticleMapper;

    @InjectMocks private LeasingArticleService leasingArticleService;

    @Test
    void getArticleDetail_shouldReturnDto_whenArticleExists() {
        LeasingArticle article = new LeasingArticle();
        LeasingArticleDetailDto dto = new LeasingArticleDetailDto();

        when(leasingArticleRepository.findByIdWithImages(1L)).thenReturn(Optional.of(article));
        when(leasingArticleMapper.toDetailDto(article)).thenReturn(dto);

        LeasingArticleDetailDto result = leasingArticleService.getArticleDetail(1L);

        assertThat(result).isEqualTo(dto);
        verify(leasingArticleRepository).findByIdWithImages(1L);
    }

    @Test
    void getArticleDetail_shouldThrowNotFoundException_whenArticleDoesNotExist() {
        when(leasingArticleRepository.findByIdWithImages(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> leasingArticleService.getArticleDetail(99L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("99");
    }
}
