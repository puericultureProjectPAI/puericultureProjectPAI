package com.puericulture.troc.controller;

import com.puericulture.troc.dto.PostImageDto;
import com.puericulture.troc.service.PostImageService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/troc/images")
public class PostImageController {

    private final PostImageService postImageService;

    @Autowired
    public PostImageController(PostImageService postImageService) {
        this.postImageService = postImageService;
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<PostImageDto>> getImagesByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(postImageService.getImagesByPostId(postId));
    }

    @PostMapping
    public ResponseEntity<PostImageDto> addImage(@RequestBody PostImageDto dto) {
        return ResponseEntity.ok(postImageService.addImage(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        postImageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
