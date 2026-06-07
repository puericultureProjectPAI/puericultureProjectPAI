package com.puericulture.secondhand;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.common.entity.ProductImage;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.common.repository.ProductImageRepository;
import com.puericulture.secondhand.dto.SecondHandDto;
import com.puericulture.secondhand.dto.SecondHandListItemDto;
import com.puericulture.secondhand.dto.SecondHandRequest;
import com.puericulture.secondhand.entity.SecondHand;
import com.puericulture.secondhand.mapper.SecondHandMapper;
import com.puericulture.secondhand.repository.SecondHandRepository;
import com.puericulture.secondhand.service.SecondHandService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SecondHandServiceTest {

    @Mock private SecondHandRepository secondHandRepository;
    @Mock private SecondHandMapper secondHandMapper;
    @Mock private PersonRepository personRepository;
    @Mock private ProductImageRepository productImageRepository;

    @InjectMocks private SecondHandService secondHandService;

    private UUID authorId;
    private Person person;
    private SecondHand savedSecondHand;

    @BeforeEach
    void setUp() {
        authorId = UUID.randomUUID();
        person = new Person();
        person.setId(authorId);

        savedSecondHand = new SecondHand();
        savedSecondHand.setId(1L);
    }

    @Test
    void createSecondHand_shouldSaveProduct_whenValidRequest() {
        SecondHandRequest request = new SecondHandRequest();
        request.setTitle("Poussette");
        request.setDescription("Très bon état");
        request.setCity("Paris");
        request.setCategory("Poussettes, porte-bébés et sièges auto");
        request.setPrice(50L);

        when(personRepository.findById(authorId)).thenReturn(Optional.of(person));
        when(secondHandRepository.save(any())).thenReturn(savedSecondHand);
        when(secondHandMapper.toDto(savedSecondHand)).thenReturn(new SecondHandDto());

        SecondHandDto result = secondHandService.createSecondHand(request, authorId);

        assertThat(result).isNotNull();
        verify(secondHandRepository).save(any());
        verify(productImageRepository, never()).save(any());
    }

    @Test
    void createSecondHand_shouldSaveImage_whenImageReferenceProvided() {
        SecondHandRequest request = new SecondHandRequest();
        request.setTitle("Poussette");
        request.setDescription("Très bon état");
        request.setCity("Paris");
        request.setCategory("Poussettes, porte-bébés et sièges auto");
        request.setPrice(50L);
        request.setImageReference("https://res.cloudinary.com/test/image.jpg");

        when(personRepository.findById(authorId)).thenReturn(Optional.of(person));
        when(secondHandRepository.save(any())).thenReturn(savedSecondHand);
        when(secondHandMapper.toDto(savedSecondHand)).thenReturn(new SecondHandDto());

        secondHandService.createSecondHand(request, authorId);

        verify(productImageRepository).save(any(ProductImage.class));
    }

    @Test
    void createSecondHand_shouldThrow_whenPersonNotFound() {
        SecondHandRequest request = new SecondHandRequest();
        request.setTitle("Poussette");
        request.setDescription("Test");
        request.setCity("Paris");
        request.setCategory("Poussettes, porte-bébés et sièges auto");
        request.setPrice(50L);

        when(personRepository.findById(authorId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> secondHandService.createSecondHand(request, authorId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Person not found");
    }

    @Test
    void getAllProducts_shouldReturnList() {
        List<SecondHandListItemDto> mockList =
                List.of(
                        new SecondHandListItemDto(1L, "Poussette", 50L, "TRANSPORT_BEBE", null),
                        new SecondHandListItemDto(
                                2L, "Robe", 20L, "VETEMENTS", "http://image.jpg"));

        when(secondHandRepository.findAllListItems()).thenReturn(mockList);

        List<SecondHandListItemDto> result = secondHandService.getAllProducts();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Poussette");
        assertThat(result.get(1).getImageUrl()).isEqualTo("http://image.jpg");
    }

    @Test
    void getAllProducts_shouldReturnEmptyList_whenNoProducts() {
        when(secondHandRepository.findAllListItems()).thenReturn(List.of());

        List<SecondHandListItemDto> result = secondHandService.getAllProducts();

        assertThat(result).isEmpty();
    }
}
