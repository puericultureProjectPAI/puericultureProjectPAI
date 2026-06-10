package com.puericulture.leasing.dto;

import java.time.Instant;

/**
 * STRATEGIC INTENT: Spring Data native query projection for the leasing reviews read model. WHY:
 * Avoids loading full JPA entities when all we need for the product detail page is a flat read
 * projection. The native query JOINs leasing_reviews → leasing_orders → client_products → person to
 * resolve the reviewer's display name — something impossible with a simple @Entity mapping.
 *
 * <p>Column aliases in the @Query MUST match these getter names exactly (camelCase → "camelCase"
 * alias in native SQL).
 */
public interface LeasingReviewSummary {

    /** Display name of the user who wrote the review, sourced from public.person.name. */
    String getReviewerName();

    /** Star rating from 1 to 5. */
    Integer getRating();

    /** Timestamp when the review was submitted. */
    Instant getReviewDate();

    /** Optional free-text comment. May be null if the user only left a star rating. */
    String getComment();
}
