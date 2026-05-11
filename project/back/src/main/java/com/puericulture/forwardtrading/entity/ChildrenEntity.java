package com.puericulture.forwardtrading.entity;

import jakarta.persistence.*;
import java.sql.Date;
import lombok.Data;

@Entity
@Table(name = "children")
@Data
public class ChildrenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    @Column(name = "birthdate")
    Date birthDate;

    String genre;
}
