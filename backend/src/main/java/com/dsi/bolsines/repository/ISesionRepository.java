package com.dsi.bolsines.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dsi.bolsines.model.Sesion;

@Repository
public interface ISesionRepository extends JpaRepository<Sesion, Integer> {

    // Sesión actual = la que todavía no tiene fecha de fin.
    // Spring arma la consulta solo a partir del nombre del método.
    Sesion findFirstByFechaHoraFinIsNull();
}
