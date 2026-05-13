package com.puericulture.troc.repository;

import com.puericulture.troc.entity.Troc;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrocRepository extends JpaRepository<Troc, Long> {

    List<Troc> findAllByCategoryOrderByIdDesc(String category);
}
