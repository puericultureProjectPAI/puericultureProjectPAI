package com.puericulture.troc.service;

import com.puericulture.troc.dto.PostImageDto;
import com.puericulture.troc.entity.PostImage;
import com.puericulture.troc.mapper.PostImageMapper;
import com.puericulture.troc.repository.PostImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostImageService {
    private final PostImageRepository postImageRepository;
    private final PostImageMapper postImageMapper;

    @Autowired
    public PostImageService(PostImageRepository postImageRepository, PostImageMapper postImageMapper) {
        this.postImageRepository = postImageRepository;
        this.postImageMapper = postImageMapper;
    }

    public List<PostImageDto> getImagesByPostId(Long postId) {
        return postImageRepository.findByPostId(postId)
                .stream()
                .map(postImageMapper::toDto)
                .collect(Collectors.toList());
    }

    public PostImageDto addImage(PostImageDto dto) {
        PostImage entity = postImageMapper.toEntity(dto);
        PostImage saved = postImageRepository.save(entity);
        return postImageMapper.toDto(saved);
    }

    public void deleteImage(Long id) {
        postImageRepository.deleteById(id);
    }
}
