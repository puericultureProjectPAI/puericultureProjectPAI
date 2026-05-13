package com.puericulture.common.repository;

import com.puericulture.common.entity.Products;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Products, Long> {

    List<Products> findAllByOrderByIdDesc();
}
