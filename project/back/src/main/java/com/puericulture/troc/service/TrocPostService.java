package com.puericulture.troc.service;

import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.troc.dto.TrocPostDto;
import com.puericulture.troc.entity.TrocPost;
import com.puericulture.troc.mapper.TrocPostMapper;
import com.puericulture.troc.repository.TrocPostRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrocPostService {

    private final TrocPostRepository trocPostRepository;
    private final TrocPostMapper trocPostMapper;

    public List<TrocPostDto> getPosts(String category, String city) {
        List<TrocPost> posts;
        if (category != null && city != null) {
            posts = trocPostRepository.findByCategoryAndCityIgnoreCase(category, city);
        } else if (category != null) {
            posts = trocPostRepository.findByCategory(category);
        } else if (city != null) {
            posts = trocPostRepository.findByCityIgnoreCase(city);
        } else {
            posts = trocPostRepository.findAll();
        }
        return posts.stream().map(trocPostMapper::toDto).toList();
    }

    public TrocPostDto getPostById(Long id) {
        TrocPost post =
                trocPostRepository
                        .findById(id)
                        .orElseThrow(() -> new NotFoundException("Troc post not found: " + id));
        return trocPostMapper.toDto(post);
    }
}
