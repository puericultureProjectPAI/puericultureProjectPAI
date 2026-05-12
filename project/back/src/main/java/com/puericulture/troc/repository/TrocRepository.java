package com.puericulture.troc.repository;

import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.entity.Troc;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Repository
public class TrocRepository {
    private static final UUID DEFAULT_AUTHOR_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final String DEFAULT_AUTHOR_EMAIL = "demo.parent@puericulture.local";

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public TrocRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public Troc create(TrocRequest request) {
        UUID authorId = request.getAuthorId() == null ? DEFAULT_AUTHOR_ID : request.getAuthorId();
        ensureDemoAuthorExists(authorId);

        Long productId = createProduct(request, authorId);
        createProductTroc(productId, request.getEstimatedPrice());
        createImageReference(productId, request.getImagesReferences());

        return findById(productId);
    }

    public List<Troc> findAll() {
        String sql = """
                SELECT p.id,
                       p.post_title,
                       p.description,
                       p.category,
                       p.author_id,
                       pt.estimated_price,
                       pi.image_url,
                       COALESCE(CONCAT(pr.first_name, ' ', pr.name), 'Utilisateur inconnu') AS author_name
                FROM public.products p
                JOIN public.product_troc pt ON pt.product_id = p.id
                LEFT JOIN public.profiles pr ON pr.user_id = p.author_id
                LEFT JOIN LATERAL (
                    SELECT image_url
                    FROM public.product_images
                    WHERE product_id = p.id
                    ORDER BY position ASC
                    LIMIT 1
                ) pi ON TRUE
                ORDER BY p.id DESC
                """;
        return jdbcTemplate.query(sql, this::mapRow);
    }

    private Troc findById(Long productId) {
        String sql = """
                SELECT p.id,
                       p.post_title,
                       p.description,
                       p.category,
                       p.author_id,
                       pt.estimated_price,
                       pi.image_url,
                       COALESCE(CONCAT(pr.first_name, ' ', pr.name), 'Utilisateur inconnu') AS author_name
                FROM public.products p
                JOIN public.product_troc pt ON pt.product_id = p.id
                LEFT JOIN public.profiles pr ON pr.user_id = p.author_id
                LEFT JOIN LATERAL (
                    SELECT image_url
                    FROM public.product_images
                    WHERE product_id = p.id
                    ORDER BY position ASC
                    LIMIT 1
                ) pi ON TRUE
                WHERE p.id = :productId
                """;
        return jdbcTemplate.queryForObject(sql, Map.of("productId", productId), this::mapRow);
    }

    private Long createProduct(TrocRequest request, UUID authorId) {
        String sql = """
                INSERT INTO public.products (author_id, post_title, description, category)
                VALUES (:authorId, :title, :description, 'Troc')
                RETURNING id
                """;
        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("authorId", authorId)
                .addValue("title", request.getTitle())
                .addValue("description", request.getDescription());
        return jdbcTemplate.queryForObject(sql, parameters, Long.class);
    }

    private void createProductTroc(Long productId, Long estimatedPrice) {
        String sql = """
                INSERT INTO public.product_troc (product_id, estimated_price)
                VALUES (:productId, :estimatedPrice)
                """;
        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("productId", productId)
                .addValue("estimatedPrice", estimatedPrice);
        jdbcTemplate.update(sql, parameters);
    }

    private void createImageReference(Long productId, String imagesReferences) {
        if (!StringUtils.hasText(imagesReferences)) {
            return;
        }
        String sql = """
                INSERT INTO public.product_images (product_id, image_url, position)
                VALUES (:productId, :imageUrl, 1)
                """;
        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("productId", productId)
                .addValue("imageUrl", imagesReferences);
        jdbcTemplate.update(sql, parameters);
    }

    private void ensureDemoAuthorExists(UUID authorId) {
        String authSql = """
                INSERT INTO auth.users (
                    id,
                    instance_id,
                    aud,
                    role,
                    email,
                    encrypted_password,
                    email_confirmed_at,
                    raw_app_meta_data,
                    raw_user_meta_data,
                    created_at,
                    updated_at
                )
                VALUES (
                    :authorId,
                    '00000000-0000-0000-0000-000000000000',
                    'authenticated',
                    'authenticated',
                    :email,
                    '',
                    NOW(),
                    '{"provider":"email","providers":["email"]}'::jsonb,
                    '{}'::jsonb,
                    NOW(),
                    NOW()
                )
                ON CONFLICT (id) DO NOTHING
                """;
        MapSqlParameterSource authParameters = new MapSqlParameterSource()
                .addValue("authorId", authorId)
                .addValue("email", DEFAULT_AUTHOR_EMAIL);
        jdbcTemplate.update(authSql, authParameters);

        String profileSql = """
                INSERT INTO public.profiles (user_id, name, first_name, city, street)
                VALUES (:authorId, 'Parent', 'Demo', 'Lille', 'Rue de démonstration')
                ON CONFLICT (user_id) DO NOTHING
                """;
        jdbcTemplate.update(profileSql, new MapSqlParameterSource().addValue("authorId", authorId));
    }

    private Troc mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
        Troc troc = new Troc();
        troc.setId(resultSet.getLong("id"));
        troc.setTitle(resultSet.getString("post_title"));
        troc.setDescription(resultSet.getString("description"));
        troc.setImagesReferences(resultSet.getString("image_url"));
        troc.setEstimatedPrice(resultSet.getLong("estimated_price"));
        troc.setAuthorId(resultSet.getObject("author_id", UUID.class));
        troc.setAuthorName(resultSet.getString("author_name"));
        troc.setCategory(resultSet.getString("category"));
        troc.setOpen(true);
        return troc;
    }
}
