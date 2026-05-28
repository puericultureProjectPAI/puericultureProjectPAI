package com.puericulture.troc.entity;

import com.puericulture.common.entity.Person;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "triangular_exchange_participants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TriangularExchangeParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "triangular_exchange_id")
    private TriangularExchange triangularExchange;

    @ManyToOne(optional = false)
    @JoinColumn(name = "participant_id")
    private Person participant;

    @ManyToOne(optional = false)
    @JoinColumn(name = "offered_product_id")
    private ProductTroc offeredProduct;

    @ManyToOne(optional = false)
    @JoinColumn(name = "wanted_product_id")
    private ProductTroc wantedProduct;

    private Integer stepOrder;

    @Enumerated(EnumType.STRING)
    private ExchangeStatus status = ExchangeStatus.PENDING;

    private OffsetDateTime acceptedAt;
}
