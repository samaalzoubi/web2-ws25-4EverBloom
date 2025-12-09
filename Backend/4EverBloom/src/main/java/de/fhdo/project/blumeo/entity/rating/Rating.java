package de.fhdo.project.blumeo.entity.rating;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.userService.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a customer rating for an order.
 * 
 * Database Attributes:
 * - id: Primary key (auto-generated)
 * - ratingScore: Score from 1-5
 * - review: Optional text review/comment
 * - createdAt: Timestamp when rating was created
 * - customerId: Foreign key to Customer
 * - orderId: Foreign key to Order
 * 
 * @author Blumeo Team
 * @version 1.0
 */
@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @Column(name = "rating_score", nullable = false)
    private Integer ratingScore;
    
    @Column(name = "review", length = 1000)
    private String review;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}