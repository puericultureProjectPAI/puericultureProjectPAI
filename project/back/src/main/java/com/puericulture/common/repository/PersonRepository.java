package com.puericulture.common.repository;

import com.puericulture.common.entity.Person;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {

    /**
     * Retrieves a Person entity by their synchronized email. * @param email The exact email string.
     *
     * @return An Optional containing the Person if found.
     */
    Optional<Person> findByEmail(String email);
}
