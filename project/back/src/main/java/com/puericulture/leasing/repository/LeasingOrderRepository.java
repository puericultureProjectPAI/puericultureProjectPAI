package com.puericulture.leasing.repository;

import com.puericulture.leasing.entity.LeasingOrder;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LeasingOrderRepository extends JpaRepository<LeasingOrder, Long> {

    /**
     * Checks if there are any overlapping orders for the specified product during the given dates.
     * For dates [start_1, end_1] and [start_2, end_2], overlap is defined as: start_1 <= end_2 AND
     * start_2 <= end_1.
     */
    @Query(
            "SELECT COUNT(lo) FROM LeasingOrder lo JOIN ClientProduct cp ON lo.clientProductId = cp.id "
                    + "WHERE cp.productId = :productId AND lo.startDate <= :endDate AND lo.endDate >= :startDate")
    long countOverlappingOrders(
            @Param("productId") Long productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query(
            "SELECT lo FROM LeasingOrder lo JOIN ClientProduct cp ON lo.clientProductId = cp.id "
                    + "WHERE cp.clientId = :clientId ORDER BY lo.clientProductId DESC")
    List<LeasingOrder> findOrdersByClientId(@Param("clientId") UUID clientId, Pageable pageable);
}
