package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Centre;
import com.ravex.backend.dto.centre.CentreDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CentreRepository extends JpaRepository<Centre, Integer> {
    @Query("SELECT new com.ravex.backend.dto.centre.CentreDto(c.codeCentre, c.libelleCentre) FROM Centre c")
    List<CentreDto> findAllCodeAndLibelle();
}
