package com.puericulture.troc.service;

import java.io.IOException;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SupabaseStorageService {

    private final String supabaseUrl;
    private final String serviceKey;
    private final String bucket;
    private final RestClient restClient;

    public SupabaseStorageService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service.key}") String serviceKey,
            @Value("${supabase.storage.bucket}") String bucket) {
        this.supabaseUrl = supabaseUrl;
        this.serviceKey = serviceKey;
        this.bucket = bucket;
        this.restClient = RestClient.create();
    }

    public String upload(MultipartFile file, Long postId) throws IOException {
        String extension = extractExtension(file.getOriginalFilename());
        String path = postId + "/" + UUID.randomUUID() + "." + extension;

        restClient
                .post()
                .uri(supabaseUrl + "/storage/v1/object/" + bucket + "/" + path)
                .header("Authorization", "Bearer " + serviceKey)
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .body(file.getBytes())
                .retrieve()
                .toBodilessEntity();

        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + path;
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
