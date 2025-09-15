package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Direction;
import com.ravex.backend.dto.DirectionDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DirectionRepository extends JpaRepository<Direction, Long> {
    @Query(" SELECT new com.ravex.backend.dto.DirectionDto(d.numero, d.nom) FROM Direction d")
    public List<DirectionDto> getToutesLesDirections();
}
