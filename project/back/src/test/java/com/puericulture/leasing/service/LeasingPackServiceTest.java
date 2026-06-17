package com.puericulture.leasing.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.forwardtrading.entity.ChildrenEntity;
import com.puericulture.leasing.dto.LeasingPackDto;
import com.puericulture.leasing.mapper.LeasingProductMapper;
import com.puericulture.leasing.repository.LeasingProductRepository;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class LeasingPackServiceTest {

    @Mock private LeasingProductRepository leasingProductRepository;

    @Mock private LeasingProductMapper leasingProductMapper;

    @Mock private PersonRepository personRepository;

    @Spy private LeasingPriceService leasingPriceService = new LeasingPriceService();

    @InjectMocks private LeasingPackService leasingPackService;

    private UUID personId;
    private Person person;
    private ChildrenEntity child;

    @BeforeEach
    void setUp() {
        personId = UUID.randomUUID();
        person = new Person();
        person.setId(personId);

        child = new ChildrenEntity();
        // Default to a 10-month-old child
        child.setBirthDate(Date.valueOf(LocalDate.now().minusMonths(10)));
        person.setChildren(Collections.singletonList(child));

        // Mock Security Context
        SecurityContextHolder.getContext()
                .setAuthentication(
                        new UsernamePasswordAuthenticationToken(personId.toString(), null));
    }

    @Test
    void testGenerateArrivalPack_Age6to14Months_WithCar() {
        when(personRepository.findById(personId)).thenReturn(Optional.of(person));

        LeasingPackDto pack =
                leasingPackService.generateArrivalPack(
                        "Paris", LocalDate.now(), LocalDate.now().plusDays(5), true, null);

        assertEquals(10, pack.getChildAgeMonths());
        verify(leasingProductRepository)
                .findAvailableProductByCategoryAndCity(
                        eq("TRANSPORT_BEBE"), eq("Paris"), any(), any(), eq(10));
        verify(leasingProductRepository)
                .findAvailableProductByCategoryAndCity(
                        eq("SOMMEIL_LITERIE"), eq("Paris"), any(), any(), eq(10));
    }

    @Test
    void testGenerateArrivalPack_Under6Months_NoCar() {
        child.setBirthDate(Date.valueOf(LocalDate.now().minusMonths(3)));
        when(personRepository.findById(personId)).thenReturn(Optional.of(person));

        LeasingPackDto pack =
                leasingPackService.generateArrivalPack(
                        "Lyon", LocalDate.now(), LocalDate.now().plusDays(2), false, null);

        assertEquals(3, pack.getChildAgeMonths());
        verify(leasingProductRepository)
                .findAvailableProductByCategoryAndCity(
                        eq("SOMMEIL_LITERIE"), eq("Lyon"), any(), any(), eq(3));
        verify(leasingProductRepository, never())
                .findAvailableProductByCategoryAndCity(
                        eq("TRANSPORT_BEBE"), any(), any(), any(), any());
    }

    @Test
    void testGenerateArrivalPack_Over14Months_NoCar_ShortStay() {
        child.setBirthDate(Date.valueOf(LocalDate.now().minusMonths(24)));
        when(personRepository.findById(personId)).thenReturn(Optional.of(person));

        LeasingPackDto pack =
                leasingPackService.generateArrivalPack(
                        "Bordeaux", LocalDate.now(), LocalDate.now().plusDays(1), false, null);

        assertEquals(24, pack.getChildAgeMonths());
        verify(leasingProductRepository)
                .findAvailableProductByCategoryAndCity(
                        eq("TRANSPORT_BEBE"), eq("Bordeaux"), any(), any(), eq(24));
        verify(leasingProductRepository, never())
                .findAvailableProductByCategoryAndCity(
                        eq("SOMMEIL_LITERIE"), any(), any(), any(), any());
    }

    @Test
    void testGenerateArrivalPack_CalculatesAgeAtStartDate() {
        child.setBirthDate(Date.valueOf(LocalDate.now().minusMonths(5)));
        LocalDate startDate = LocalDate.now().plusMonths(1);
        when(personRepository.findById(personId)).thenReturn(Optional.of(person));

        LeasingPackDto pack =
                leasingPackService.generateArrivalPack(
                        "Paris", startDate, startDate.plusDays(5), false, null);

        assertEquals(6, pack.getChildAgeMonths());
        verify(leasingProductRepository)
                .findAvailableProductByCategoryAndCity(
                        eq("TRANSPORT_BEBE"), eq("Paris"), any(), any(), eq(6));
    }
}
