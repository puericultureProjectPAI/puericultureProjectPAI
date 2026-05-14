package com.puericulture.troc.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.TrocPostDto;
import com.puericulture.troc.entity.TrocPost;
import com.puericulture.troc.mapper.TrocPostMapper;
import com.puericulture.troc.repository.TrocPostRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TrocPostServiceTest {

    @Mock private TrocPostRepository trocPostRepository;
    @Mock private TrocPostMapper trocPostMapper;

    @InjectMocks private TrocPostService trocPostService;

    @Test
    void getPosts_noFilters_returnsAll() {
        TrocPost post = new TrocPost();
        TrocPostDto dto = new TrocPostDto();
        when(trocPostRepository.findAll()).thenReturn(List.of(post));
        when(trocPostMapper.toDto(post)).thenReturn(dto);

        List<TrocPostDto> result = trocPostService.getPosts(null, null);

        assertThat(result).containsExactly(dto);
        verify(trocPostRepository).findAll();
    }

    @Test
    void getPosts_withCategory_filtersByCategory() {
        TrocPost post = new TrocPost();
        TrocPostDto dto = new TrocPostDto();
        when(trocPostRepository.findByCategory("Poussette")).thenReturn(List.of(post));
        when(trocPostMapper.toDto(post)).thenReturn(dto);

        List<TrocPostDto> result = trocPostService.getPosts("Poussette", null);

        assertThat(result).containsExactly(dto);
        verify(trocPostRepository).findByCategory("Poussette");
    }

    @Test
    void getPosts_withCity_filtersByCity() {
        TrocPost post = new TrocPost();
        TrocPostDto dto = new TrocPostDto();
        when(trocPostRepository.findByCityIgnoreCase("Paris")).thenReturn(List.of(post));
        when(trocPostMapper.toDto(post)).thenReturn(dto);

        List<TrocPostDto> result = trocPostService.getPosts(null, "Paris");

        assertThat(result).containsExactly(dto);
        verify(trocPostRepository).findByCityIgnoreCase("Paris");
    }

    @Test
    void getPosts_withCategoryAndCity_filtersByBoth() {
        TrocPost post = new TrocPost();
        TrocPostDto dto = new TrocPostDto();
        when(trocPostRepository.findByCategoryAndCityIgnoreCase("Jouets", "Lyon"))
                .thenReturn(List.of(post));
        when(trocPostMapper.toDto(post)).thenReturn(dto);

        List<TrocPostDto> result = trocPostService.getPosts("Jouets", "Lyon");

        assertThat(result).containsExactly(dto);
        verify(trocPostRepository).findByCategoryAndCityIgnoreCase("Jouets", "Lyon");
    }

    @Test
    void getPostById_existingId_returnsDto() {
        TrocPost post = new TrocPost();
        TrocPostDto dto = new TrocPostDto();
        when(trocPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(trocPostMapper.toDto(post)).thenReturn(dto);

        TrocPostDto result = trocPostService.getPostById(1L);

        assertThat(result).isEqualTo(dto);
    }

    @Test
    void getPostById_unknownId_throwsNotFoundException() {
        when(trocPostRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trocPostService.getPostById(99L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("99");
    }
}
