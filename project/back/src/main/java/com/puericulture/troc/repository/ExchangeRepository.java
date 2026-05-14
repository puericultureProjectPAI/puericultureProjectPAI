// ExchangeRepository.java

package com.puericulture.troc.repository;

import com.puericulture.troc.entity.Exchange;
import com.puericulture.troc.entity.ProductTroc;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    boolean existsByProposerProductAndReceiverProduct(
            ProductTroc proposerProduct, ProductTroc receiverProduct);

    List<Exchange> findByReceiverProduct(ProductTroc receiverProduct);

    List<Exchange> findByProposerProduct(ProductTroc proposerProduct);

    List<Exchange> findByProposerProductAuthorId(UUID mockUserId);
}
