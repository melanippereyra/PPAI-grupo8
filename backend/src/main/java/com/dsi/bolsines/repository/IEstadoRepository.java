package com.dsi.bolsines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dsi.bolsines.model.Estado;

// Spring Data genera la implementación: findAll(), findById(), save(), etc.
@Repository
public interface IEstadoRepository extends JpaRepository<Estado, Integer> {
}
