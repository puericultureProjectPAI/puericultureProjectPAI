package com.puericulture.leasing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.config.errormanager.exception.BadRequestException;
import com.puericulture.config.errormanager.exception.NotFoundException;
import com.puericulture.config.errormanager.exception.UnauthorizedException;
import com.puericulture.leasing.dto.LeasingPackReservationRequestDto;
import com.puericulture.leasing.dto.LeasingReservationRequestDto;
import com.puericulture.leasing.dto.LeasingReservationResponseDto;
import com.puericulture.leasing.entity.ClientProduct;
import com.puericulture.leasing.entity.LeasingArticle;
import com.puericulture.leasing.entity.LeasingOrder;
import com.puericulture.leasing.repository.ClientProductRepository;
import com.puericulture.leasing.repository.LeasingArticleRepository;
import com.puericulture.leasing.repository.LeasingOrderRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeasingBookingServiceTest {

    @Mock private LeasingArticleRepository leasingArticleRepository;
    @Mock private ClientProductRepository clientProductRepository;
    @Mock private LeasingOrderRepository leasingOrderRepository;
    @Mock private PersonRepository personRepository;
    @Spy private LeasingPriceService leasingPriceService = new LeasingPriceService();

    @InjectMocks private LeasingBookingService leasingBookingService;

    private UUID userId;
    private String userIdStr;
    private Person user;
    private LeasingArticle article;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        userIdStr = userId.toString();
        user = new Person();
        user.setId(userId);
        user.setEmail("test@kiabi.local");

        article = new LeasingArticle();
        article.setId(1L);
        article.setPricePerDay(5L);
        article.setPricePerMonth(90L);
    }

    @Test
    void createReservation_Success() {
        LeasingReservationRequestDto request =
                LeasingReservationRequestDto.builder()
                        .productId(1L)
                        .startDate(LocalDate.now().plusDays(3))
                        .endDate(LocalDate.now().plusDays(17)) // 15 days total
                        .deliveryStreet("123 Rue Kiabi")
                        .deliveryZipCode("59000")
                        .deliveryCity("Lille")
                        .build();

        ClientProduct savedClientProduct =
                ClientProduct.builder().id(100L).productId(1L).clientId(userId).orderId(0L).build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(leasingOrderRepository.countOverlappingOrders(
                        1L, request.getStartDate(), request.getEndDate()))
                .thenReturn(0L);
        when(clientProductRepository.save(any(ClientProduct.class))).thenReturn(savedClientProduct);

        LeasingReservationResponseDto response =
                leasingBookingService.createReservation(request, userIdStr);

        assertThat(response).isNotNull();
        assertThat(response.getReservationNumber()).isEqualTo("RES-100");
        assertThat(response.getTotalPrice()).isEqualTo(15 * 5L); // 15 days * 5 EUR/day = 75
        assertThat(response.getEstimatedDeliveryDate())
                .isEqualTo(request.getStartDate().minusDays(3));

        verify(clientProductRepository, times(2)).save(any(ClientProduct.class));
        verify(leasingOrderRepository).save(any(LeasingOrder.class));
    }

    @Test
    void createReservation_CalculateWithMonths() {
        LeasingReservationRequestDto request =
                LeasingReservationRequestDto.builder()
                        .productId(1L)
                        .startDate(LocalDate.now().plusDays(3))
                        .endDate(
                                LocalDate.now()
                                        .plusDays(37)) // 35 days total -> 1 month (30 days) and 5
                        // days
                        .deliveryStreet("123 Rue Kiabi")
                        .deliveryZipCode("59000")
                        .deliveryCity("Lille")
                        .build();

        ClientProduct savedClientProduct =
                ClientProduct.builder().id(101L).productId(1L).clientId(userId).orderId(0L).build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(leasingOrderRepository.countOverlappingOrders(
                        1L, request.getStartDate(), request.getEndDate()))
                .thenReturn(0L);
        when(clientProductRepository.save(any(ClientProduct.class))).thenReturn(savedClientProduct);

        LeasingReservationResponseDto response =
                leasingBookingService.createReservation(request, userIdStr);

        assertThat(response).isNotNull();
        // 1 month * 90 EUR/month + 5 days * 5 EUR/day = 115 EUR
        assertThat(response.getTotalPrice()).isEqualTo(115L);
    }

    @Test
    void createReservation_ThrowsUnauthorized_WhenUserIdNull() {
        LeasingReservationRequestDto request = new LeasingReservationRequestDto();
        assertThatThrownBy(() -> leasingBookingService.createReservation(request, null))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void createReservation_ThrowsNotFound_WhenArticleDoesNotExist() {
        LeasingReservationRequestDto request =
                LeasingReservationRequestDto.builder()
                        .productId(99L)
                        .startDate(LocalDate.now().plusDays(3))
                        .endDate(LocalDate.now().plusDays(5))
                        .build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> leasingBookingService.createReservation(request, userIdStr))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void createReservation_ThrowsBadRequest_WhenStartDateInPast() {
        LeasingReservationRequestDto request =
                LeasingReservationRequestDto.builder()
                        .productId(1L)
                        .startDate(LocalDate.now().minusDays(1))
                        .endDate(LocalDate.now().plusDays(5))
                        .build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(1L)).thenReturn(Optional.of(article));

        assertThatThrownBy(() -> leasingBookingService.createReservation(request, userIdStr))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void createReservation_ThrowsBadRequest_WhenStartDateIsTooSoon() {
        LeasingReservationRequestDto request =
                LeasingReservationRequestDto.builder()
                        .productId(1L)
                        .startDate(LocalDate.now().plusDays(2))
                        .endDate(LocalDate.now().plusDays(5))
                        .build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(1L)).thenReturn(Optional.of(article));

        assertThatThrownBy(() -> leasingBookingService.createReservation(request, userIdStr))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("La date de début doit être au moins 3 jours après aujourd'hui.");
    }

    @Test
    void createReservation_ThrowsBadRequest_WhenStartDateAfterEndDate() {
        LeasingReservationRequestDto request =
                LeasingReservationRequestDto.builder()
                        .productId(1L)
                        .startDate(LocalDate.now().plusDays(5))
                        .endDate(LocalDate.now().plusDays(2))
                        .build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(1L)).thenReturn(Optional.of(article));

        assertThatThrownBy(() -> leasingBookingService.createReservation(request, userIdStr))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void createReservation_ThrowsBadRequest_WhenOverlappingOrderExists() {
        LeasingReservationRequestDto request =
                LeasingReservationRequestDto.builder()
                        .productId(1L)
                        .startDate(LocalDate.now().plusDays(3))
                        .endDate(LocalDate.now().plusDays(5))
                        .build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(leasingOrderRepository.countOverlappingOrders(
                        1L, request.getStartDate(), request.getEndDate()))
                .thenReturn(1L);

        assertThatThrownBy(() -> leasingBookingService.createReservation(request, userIdStr))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void createPackReservation_Success() {
        LeasingArticle secondArticle = new LeasingArticle();
        secondArticle.setId(2L);
        secondArticle.setPostTitle("Lit parapluie");
        secondArticle.setPricePerDay(4L);
        secondArticle.setPricePerMonth(70L);
        article.setPostTitle("Poussette Yoyo");

        LeasingPackReservationRequestDto request =
                LeasingPackReservationRequestDto.builder()
                        .productIds(List.of(1L, 2L))
                        .startDate(LocalDate.now().plusDays(3))
                        .endDate(LocalDate.now().plusDays(7))
                        .deliveryStreet("123 Rue Kiabi")
                        .deliveryZipCode("59000")
                        .deliveryCity("Lille")
                        .build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingArticleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(leasingArticleRepository.findById(2L)).thenReturn(Optional.of(secondArticle));
        when(leasingOrderRepository.countOverlappingOrders(any(), any(), any())).thenReturn(0L);
        when(clientProductRepository.save(any(ClientProduct.class)))
                .thenAnswer(
                        invocation -> {
                            ClientProduct clientProduct = invocation.getArgument(0);
                            if (clientProduct.getId() == null) {
                                clientProduct.setId(
                                        clientProduct.getProductId().equals(1L) ? 100L : 101L);
                            }
                            return clientProduct;
                        });

        var response = leasingBookingService.createPackReservation(request, userIdStr);

        assertThat(response.getReservationNumbers()).containsExactly("RES-100", "RES-101");
        assertThat(response.getProducts()).hasSize(2);
        assertThat(response.getTotalPrice()).isEqualTo((5 * 5L) + (5 * 4L));
        verify(clientProductRepository, times(4)).save(any(ClientProduct.class));
        verify(leasingOrderRepository, times(2)).save(any(LeasingOrder.class));
    }

    @Test
    void createPackReservation_ThrowsBadRequest_WhenProductDuplicated() {
        LeasingPackReservationRequestDto request =
                LeasingPackReservationRequestDto.builder()
                        .productIds(List.of(1L, 1L))
                        .startDate(LocalDate.now().plusDays(3))
                        .endDate(LocalDate.now().plusDays(7))
                        .deliveryStreet("123 Rue Kiabi")
                        .deliveryZipCode("59000")
                        .deliveryCity("Lille")
                        .build();

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> leasingBookingService.createPackReservation(request, userIdStr))
                .isInstanceOf(BadRequestException.class);
        verify(leasingArticleRepository, never()).findById(any());
    }

    @Test
    void getLeasingProfile_Success_WithSerializedCity() {
        user.setStreet("123 Rue de la Paix");
        user.setCity("75002;Paris");

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingOrderRepository.findOrdersByClientId(eq(userId), any()))
                .thenReturn(java.util.Collections.emptyList());

        com.puericulture.leasing.dto.LeasingProfileDto profile =
                leasingBookingService.getLeasingProfile(userIdStr);

        assertThat(profile).isNotNull();
        assertThat(profile.getStreet()).isEqualTo("123 Rue de la Paix");
        assertThat(profile.getZipCode()).isEqualTo("75002");
        assertThat(profile.getCity()).isEqualTo("Paris");
    }

    @Test
    void getLeasingProfile_Success_WithRawCityNoZipCode() {
        user.setStreet("123 Rue de la Paix");
        user.setCity("Paris");

        when(personRepository.findById(userId)).thenReturn(Optional.of(user));
        when(leasingOrderRepository.findOrdersByClientId(eq(userId), any()))
                .thenReturn(java.util.Collections.emptyList());

        com.puericulture.leasing.dto.LeasingProfileDto profile =
                leasingBookingService.getLeasingProfile(userIdStr);

        assertThat(profile).isNotNull();
        assertThat(profile.getStreet()).isEqualTo("123 Rue de la Paix");
        assertThat(profile.getZipCode()).isEmpty();
        assertThat(profile.getCity()).isEqualTo("Paris");
    }
}
