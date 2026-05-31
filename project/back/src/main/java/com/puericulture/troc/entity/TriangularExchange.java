package com.puericulture.troc.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "triangular_exchanges")
@Getter
@Setter
public class TriangularExchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ExchangeStatus status = ExchangeStatus.PENDING;

    private OffsetDateTime createdAt = OffsetDateTime.now();

    @OneToMany(mappedBy = "triangularExchange", cascade = CascadeType.ALL)
    private List<TriangularExchangeParticipant> participants = new ArrayList<>();
}
