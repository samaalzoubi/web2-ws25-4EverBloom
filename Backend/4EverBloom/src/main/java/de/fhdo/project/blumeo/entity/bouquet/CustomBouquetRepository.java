package de.fhdo.project.blumeo.entity.bouquet;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomBouquetRepository
        extends JpaRepository<CustomBouquet, Long> {

    void deleteByDesignedByCustomer_Id(Long customerId);
}
