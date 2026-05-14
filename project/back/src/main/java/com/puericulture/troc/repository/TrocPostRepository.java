package com.puericulture.troc.repository;

import com.puericulture.troc.entity.TrocPost;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrocPostRepository extends JpaRepository<TrocPost, Long> {

    List<TrocPost> findByCategory(String category);

    List<TrocPost> findByCityIgnoreCase(String city);

    List<TrocPost> findByCategoryAndCityIgnoreCase(String category, String city);
}
