package com.puericulture.troc.service;

import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.entity.Troc;
import com.puericulture.troc.mapper.TrocMapper;
import com.puericulture.troc.repository.TrocProjection;
import com.puericulture.troc.repository.TrocRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TrocService {

    private static final UUID LOCAL_DEMO_AUTHOR_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    private static final String DEFAULT_CATEGORY = "TROC";

    private final TrocRepository trocRepository;

    private final TrocMapper trocMapper;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public TrocService(
            TrocRepository trocRepository,
            TrocMapper trocMapper,
            NamedParameterJdbcTemplate jdbcTemplate) {
        this.trocRepository = trocRepository;
        this.trocMapper = trocMapper;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public TrocDto createTroc(TrocRequest request) {
        UUID authorId = request.getAuthorId() != null ? request.getAuthorId() : LOCAL_DEMO_AUTHOR_ID;
        ensureLocalDemoAuthorExists(authorId);

        Long productId = createProduct(request, authorId);
        trocRepository.save(new Troc(productId, request.getEstimatedPrice()));
        createProductImageIfPresent(productId, request.getImageUrl());

        TrocProjection createdTroc =
                trocRepository
                        .findTrocProductByProductId(productId)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Le troc créé est introuvable"));

        return trocMapper.toDto(createdTroc);
    }

    @Transactional(readOnly = true)
    public List<TrocDto> findAllTrocs() {
        return trocRepository.findAllTrocProducts().stream().map(trocMapper::toDto).toList();
    }

    private Long createProduct(TrocRequest request, UUID authorId) {
        String sql =
                """
                INSERT INTO public.products (author_id, post_title, description, category)
                VALUES (:authorId, :title, :description, :category)
                RETURNING id
                """;

        MapSqlParameterSource parameters =
                new MapSqlParameterSource()
                        .addValue("authorId", authorId)
                        .addValue("title", request.getTitle())
                        .addValue("description", request.getDescription())
                        .addValue("category", resolveCategory(request));

        return jdbcTemplate.queryForObject(sql, parameters, Long.class);
    }

    private String resolveCategory(TrocRequest request) {
        if (request.getCategory() == null || request.getCategory().isBlank()) {
            return DEFAULT_CATEGORY;
        }
        return request.getCategory().trim().toUpperCase();
    }

    private void createProductImageIfPresent(Long productId, String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String sql =
                """
                INSERT INTO public.product_images (product_id, image_url, position)
                VALUES (:productId, :imageUrl, 0)
                """;

        jdbcTemplate.update(
                sql,
                new MapSqlParameterSource()
                        .addValue("productId", productId)
                        .addValue("imageUrl", imageUrl.trim()));
    }

    private void ensureLocalDemoAuthorExists(UUID authorId) {
        if (!LOCAL_DEMO_AUTHOR_ID.equals(authorId)) {
            return;
        }

        String sql =
                """
                INSERT INTO auth.users (
                    id,
                    instance_id,
                    aud,
                    role,
                    email,
                    encrypted_password,
                    email_confirmed_at,
                    created_at,
                    updated_at,
                    raw_app_meta_data,
                    raw_user_meta_data,
                    is_super_admin
                )
                VALUES (
                    :id,
                    '00000000-0000-0000-0000-000000000000',
                    'authenticated',
                    'authenticated',
                    'demo.parent@puericulture.local',
                    '',
                    NOW(),
                    NOW(),
                    NOW(),
                    '{"provider":"email","providers":["email"]}'::jsonb,
                    '{}'::jsonb,
                    false
                )
                ON CONFLICT (id) DO NOTHING
                """;

        jdbcTemplate.update(sql, Map.of("id", authorId));
    }
}
