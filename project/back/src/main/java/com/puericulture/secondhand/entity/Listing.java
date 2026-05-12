package com.puericulture.secondhand.entity;
 
import jakarta.persistence.*;
 
@Entity
@Table(
    name = "listings",
    indexes = {
    
        @Index(name = "idx_listing_ean_status_condition", columnList = "ean, status, condition")
    }
)
public class Listing {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false, length = 13)
    private String ean;
 
    @Column(nullable = false)
    private Double price;
 
  
    @Column(nullable = false)
    private String status;
 

    @Column(nullable = false)
    private String condition;
 

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getEan() { return ean; }
    public void setEan(String ean) { this.ean = ean; }
 
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
 
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
 
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
}
 
