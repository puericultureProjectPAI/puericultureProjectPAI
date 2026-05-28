package com.puericulture.troc.repository;

import com.puericulture.troc.entity.ExchangeStatus;
import com.puericulture.troc.entity.TriangularExchange;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TriangularExchangeRepository extends JpaRepository<TriangularExchange, Long> {

    List<TriangularExchange> findByStatus(ExchangeStatus status);
}
