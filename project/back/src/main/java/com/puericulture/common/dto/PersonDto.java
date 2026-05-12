package com.puericulture.common.dto;

import java.sql.Date;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonDto {

    private UUID id;
    private String email;
    private String name;
    private String firstName;
    private String city;
    private String street;
    private String genre;
    private Date dateOfBirth;
}
