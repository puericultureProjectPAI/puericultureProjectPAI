package com.puericulture.troc.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductCategory;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.troc.dto.TrocDto;
import com.puericulture.troc.dto.TrocRequest;
import com.puericulture.troc.entity.Troc;
import com.puericulture.troc.mapper.TrocMapper;
import com.puericulture.troc.repository.TrocRepository;
import java.sql.Date;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TrocServiceTest {

    private static final UUID AUTHOR_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    @Mock private TrocRepository trocRepository;

    @Mock private TrocMapper trocMapper;

    @Mock private PersonRepository personRepository;

    @InjectMocks private TrocService trocService;

    private Person author;

    @BeforeEach
    void setUp() {
        author = new Person();
        author.setId(AUTHOR_ID);
        author.setEmail("parent@example.com");
        author.setName("Parent test");
    }

    @Test
    void createTrocShouldSaveTrocLinkedToAuthenticatedAuthor() {
        TrocRequest request = validRequest();
        TrocDto expectedDto = new TrocDto();
        expectedDto.setProductId(10L);
        expectedDto.setTitle(request.getTitle());
        expectedDto.setEstimatedPrice(request.getEstimatedPrice());
        expectedDto.setAuthorId(AUTHOR_ID);

        given(personRepository.findById(AUTHOR_ID)).willReturn(Optional.of(author));
        given(trocRepository.save(any(Troc.class)))
                .willAnswer(invocation -> invocation.getArgument(0));
        given(trocMapper.toDto(any(Troc.class))).willReturn(expectedDto);

        TrocDto result = trocService.createTroc(request, AUTHOR_ID);

        ArgumentCaptor<Troc> trocCaptor = ArgumentCaptor.forClass(Troc.class);
        verify(trocRepository).save(trocCaptor.capture());

        Troc savedTroc = trocCaptor.getValue();
        assertThat(savedTroc.getPostTitle()).isEqualTo("Poussette bébé");
        assertThat(savedTroc.getDescription()).isEqualTo("Poussette bébé en très bon état");
        assertThat(savedTroc.getCity()).isEqualTo("Lille");
        assertThat(savedTroc.getCategory()).isEqualTo(ProductCategory.TRANSPORT_BEBE);
        assertThat(savedTroc.getEstimatedPrice()).isEqualTo(40L);
        assertThat(savedTroc.getCondition()).isEqualTo("Très bon état");
        assertThat(savedTroc.getBrand()).isEqualTo("Kiabi");
        assertThat(savedTroc.getModel()).isEqualTo("Lullaby");
        assertThat(savedTroc.getDimensions()).isEqualTo("60 x 40 cm");
        assertThat(savedTroc.getLastCheckDate()).isEqualTo(Date.valueOf("2026-05-21"));
        assertThat(savedTroc.getSecurityStandard()).isEqualTo("EN 1888");
        assertThat(savedTroc.getMaxWeightKg()).isEqualTo(15);
        assertThat(savedTroc.getMinAgeMonths()).isEqualTo(0);
        assertThat(savedTroc.getMaxAgeMonths()).isEqualTo(36);
        assertThat(savedTroc.getAuthor()).isSameAs(author);
        assertThat(savedTroc.getPostDate()).isNotNull();
        assertThat(result).isSameAs(expectedDto);
    }

    @Test
    void createTrocShouldUseDefaultCityWhenCityIsBlank() {
        TrocRequest request = validRequest();
        request.setCity(" ");
        TrocDto expectedDto = new TrocDto();

        given(personRepository.findById(AUTHOR_ID)).willReturn(Optional.of(author));
        given(trocRepository.save(any(Troc.class)))
                .willAnswer(invocation -> invocation.getArgument(0));
        given(trocMapper.toDto(any(Troc.class))).willReturn(expectedDto);

        trocService.createTroc(request, AUTHOR_ID);

        ArgumentCaptor<Troc> trocCaptor = ArgumentCaptor.forClass(Troc.class);
        verify(trocRepository).save(trocCaptor.capture());
        assertThat(trocCaptor.getValue().getCity()).isEqualTo("Lille");
    }

    @Test
    void createTrocShouldUseDefaultCategoryWhenCategoryIsBlank() {
        TrocRequest request = validRequest();
        request.setCategory(" ");
        TrocDto expectedDto = new TrocDto();

        given(personRepository.findById(AUTHOR_ID)).willReturn(Optional.of(author));
        given(trocRepository.save(any(Troc.class)))
                .willAnswer(invocation -> invocation.getArgument(0));
        given(trocMapper.toDto(any(Troc.class))).willReturn(expectedDto);

        trocService.createTroc(request, AUTHOR_ID);

        ArgumentCaptor<Troc> trocCaptor = ArgumentCaptor.forClass(Troc.class);
        verify(trocRepository).save(trocCaptor.capture());
        assertThat(trocCaptor.getValue().getCategory()).isEqualTo(ProductCategory.AUTRES);
    }

    @Test
    void createTrocShouldRejectNullRequest() {
        assertThatThrownBy(() -> trocService.createTroc(null, AUTHOR_ID))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Troc request is required");
    }

    @Test
    void createTrocShouldRejectUnknownAuthenticatedAuthor() {
        TrocRequest request = validRequest();
        given(personRepository.findById(AUTHOR_ID)).willReturn(Optional.empty());

        assertThatThrownBy(() -> trocService.createTroc(request, AUTHOR_ID))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Authenticated person not found");
    }

    private TrocRequest validRequest() {
        TrocRequest request = new TrocRequest();
        request.setTitle("Poussette bébé");
        request.setDescription("Poussette bébé en très bon état");
        request.setEstimatedPrice(40L);
        request.setImageReference("poussette.png");
        request.setCity("Lille");
        request.setCategory("Poussettes, porte-bébés et sièges auto");
        request.setCondition("Très bon état");
        request.setBrand("Kiabi");
        request.setModel("Lullaby");
        request.setDimensions("60 x 40 cm");
        request.setLastCheckDate(Date.valueOf("2026-05-21"));
        request.setSecurityStandard("EN 1888");
        request.setMaxWeightKg(15);
        request.setMinAgeMonths(0);
        request.setMaxAgeMonths(36);
        return request;
    }
}
