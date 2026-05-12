package com.puericulture.troc.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "products", schema = "public")
public class Product {

    @Id private Long id;

    @Column(name = "author_id")
    private UUID authorId;

    @Column(name = "post_title")
    private String postTitle;

    public Product() {}

    public Long getId() {
        return id;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public String getPostTitle() {
        return postTitle;
    }
}
