package com.puericulture.leasing.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Entité Person représentant un utilisateur du système (vendeur, acheteur, loueur, etc.)
 * Regroupe toutes les informations personnelles et les relations avec les autres entités.
 */
@Entity
@Table(name = "person")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String name;

    @Column
    private String city;

    @Column
    private String street;

    @Column
    private String genre;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @OneToMany(mappedBy = "author")
    @ToString.Exclude
    private List<Product> products;

}

