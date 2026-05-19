package com.puericulture.troc.repository;

import com.puericulture.troc.entity.TrocProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrocProductRepository extends JpaRepository<TrocProduct, Long> {}
