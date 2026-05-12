package com.puericulture.common.entity;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "person")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    /**
     * The primary key. CRITICAL: Do NOT use @GeneratedValue. This UUID is not created by
     * Spring/Hibernate. It is injected directly by the PostgreSQL Trigger upon Supabase Auth
     * registration. It strictly matches the 'id' column in the 'auth.users' schema.
     */
    @Id
    @Column(name = "id", columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    /** User's email, synchronized from Supabase auth.users. */
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "city")
    private String city;

    @Column(name = "street")
    private String street;

    @Column(name = "genre", length = 1)
    private String genre;

    @Column(name = "date_of_birth")
    private java.sql.Date dateOfBirth;

    /**
     * EXAMPLE OF A RELATIONSHIP: All domain relations (products, messages, leasing orders) now
     * point to THIS Person entity, not the native Supabase 'users' table. * @OneToMany(mappedBy =
     * "author") private List<Product> products;
     */
}
