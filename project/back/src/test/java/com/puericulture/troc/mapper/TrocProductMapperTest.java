package com.puericulture.troc.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.troc.dto.TrocProductCreateRequest;
import com.puericulture.troc.dto.TrocProductDto;
import com.puericulture.troc.entity.TrocProduct;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TrocProductMapperTest {

    private TrocProductMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new TrocProductMapper();
    }

    @Test
    void toDto_mapsAllFieldsCorrectly() {
        TrocProduct entity = new TrocProduct();
        entity.setPostTitle("Poussette Bugaboo");
        entity.setDescription("Très bon état");
        entity.setCity("Montréal");
        entity.setCategory(ProductCategory.TRANSPORT_BEBE);
        entity.setPostDate(LocalDateTime.of(2026, 5, 19, 10, 0));
        entity.setEstimatedPrice(15000L);
        entity.setStatus("AVAILABLE");

        TrocProductDto dto = mapper.toDto(entity);

        assertThat(dto.getPostTitle()).isEqualTo("Poussette Bugaboo");
        assertThat(dto.getDescription()).isEqualTo("Très bon état");
        assertThat(dto.getCity()).isEqualTo("Montréal");
        assertThat(dto.getCategory()).isEqualTo("TRANSPORT_BEBE");
        assertThat(dto.getEstimatedPrice()).isEqualTo(15000L);
        assertThat(dto.getStatus()).isEqualTo("AVAILABLE");
    }

    @Test
    void toDto_returnsNull_whenEntityIsNull() {
        assertThat(mapper.toDto(null)).isNull();
    }

    @Test
    void toEntity_mapsAllFieldsCorrectly() {
        TrocProductCreateRequest request = new TrocProductCreateRequest();
        request.setPostTitle("Chaise haute");
        request.setDescription("6 mois d'utilisation");
        request.setCity("Québec");
        request.setCategory("ALLAITEMENT_ALIMENTATION");
        request.setEstimatedPrice(5000L);

        Person author = new Person();

        TrocProduct entity = mapper.toEntity(request, author);

        assertThat(entity.getPostTitle()).isEqualTo("Chaise haute");
        assertThat(entity.getDescription()).isEqualTo("6 mois d'utilisation");
        assertThat(entity.getCity()).isEqualTo("Québec");
        assertThat(entity.getCategory()).isEqualTo(ProductCategory.ALLAITEMENT_ALIMENTATION);
        assertThat(entity.getEstimatedPrice()).isEqualTo(5000L);
        assertThat(entity.getAuthor()).isEqualTo(author);
        assertThat(entity.getPostDate()).isNotNull();
    }
}
