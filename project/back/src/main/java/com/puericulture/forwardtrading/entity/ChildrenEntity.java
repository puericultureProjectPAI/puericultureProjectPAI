package com.puericulture.forwardtrading.entity;

import com.puericulture.common.entity.Person;
import jakarta.persistence.*;
import java.sql.Date;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "children")
@Data
public class ChildrenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person person;

    @Column(name = "name")
    private String name;

    @Column(name = "birthdate")
    private Date birthDate;

    @Column(name = "gender")
    private String gender;

    @OneToMany(mappedBy = "children")
    private List<Timelines> timelines;
}
