package com.puericulture.forwardtrading.repository;

// import com.puericulture.forwardtrading.entity.FamilyProfile;
import com.puericulture.forwardtrading.entity.PersonPreferencesEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonPreferencesRepository
        extends CrudRepository<PersonPreferencesEntity, Long> {}
