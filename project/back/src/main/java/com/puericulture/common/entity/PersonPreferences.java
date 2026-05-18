package com.puericulture.common.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "person_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @org.hibernate.annotations.JdbcType(org.hibernate.dialect.PostgreSQLEnumJdbcType.class)
    @Column(name = "family_status")
    private FamilyStatus familyStatus;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;
}
