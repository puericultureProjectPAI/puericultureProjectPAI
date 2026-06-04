package com.puericulture.forwardtrading.entity;

import com.puericulture.common.entity.Person;
import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Data;

@Entity
@Table(name = "person_preferences")
@Data
public class PersonPreferencesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lien OneToOne avec la personne
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person person;

    @Column(name = "family_status")
    private String familyStatus;

    @Column(name = "wants_more_children")
    private Boolean wantsMoreChildren;

    @Column(name = "due_date")
    private LocalDate dueDate;
}
