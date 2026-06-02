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
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class LeasingPackServiceTest {

    @Mock private LeasingProductRepository leasingProductRepository;

    @Mock private LeasingProductMapper leasingProductMapper;

    @Mock private PersonRepository personRepository;

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

        // Act
        LeasingPackDto pack =
                leasingPackService.generateArrivalPack(
                        "Paris", LocalDate.now(), LocalDate.now().plusDays(5), true, null);

        // Assert
        assertEquals(10, pack.getChildAgeMonths());
        // Should request: Poussette légère, Lit parapluie, Siège auto
        verify(leasingProductRepository)
                .findAvailableProductByKeywordAndCity(
                        eq("Poussette légère"), eq("Paris"), any(), any());
        verify(leasingProductRepository)
                .findAvailableProductByKeywordAndCity(
                        eq("Lit parapluie"), eq("Paris"), any(), any());
        verify(leasingProductRepository)
                .findAvailableProductByKeywordAndCity(eq("Siège auto"), eq("Paris"), any(), any());
    }

    @Test
    void testGenerateArrivalPack_Under6Months_NoCar() {
        // Change age to 3 months
        child.setBirthDate(Date.valueOf(LocalDate.now().minusMonths(3)));
        when(personRepository.findById(personId)).thenReturn(Optional.of(person));

        LeasingPackDto pack =
                leasingPackService.generateArrivalPack(
                        "Lyon", LocalDate.now(), LocalDate.now().plusDays(2), false, null);

        assertEquals(3, pack.getChildAgeMonths());
        // Should request: Nacelle, Lit parapluie
        verify(leasingProductRepository)
                .findAvailableProductByKeywordAndCity(eq("Nacelle"), eq("Lyon"), any(), any());
        verify(leasingProductRepository)
                .findAvailableProductByKeywordAndCity(
                        eq("Lit parapluie"), eq("Lyon"), any(), any());
        verify(leasingProductRepository, never())
                .findAvailableProductByKeywordAndCity(eq("Cosy"), any(), any(), any());
    }

    @Test
    void testGenerateArrivalPack_Over14Months_NoCar_ShortStay() {
        // Change age to 24 months
        child.setBirthDate(Date.valueOf(LocalDate.now().minusMonths(24)));
        when(personRepository.findById(personId)).thenReturn(Optional.of(person));

        // Duration is 2 days (today to tomorrow is 1 day, plus 1 day? wait, start to start+2 is 2
        // days)
        LeasingPackDto pack =
                leasingPackService.generateArrivalPack(
                        "Bordeaux", LocalDate.now(), LocalDate.now().plusDays(2), false, null);

        assertEquals(24, pack.getChildAgeMonths());
        // Should request: Poussette canne ONLY, because duration <= 2, and no car
        verify(leasingProductRepository)
                .findAvailableProductByKeywordAndCity(
                        eq("Poussette canne"), eq("Bordeaux"), any(), any());
        verify(leasingProductRepository, never())
                .findAvailableProductByKeywordAndCity(eq("Lit parapluie"), any(), any(), any());
    }
}
