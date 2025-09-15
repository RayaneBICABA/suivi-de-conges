package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.DirectionRepository;
import com.ravex.backend.dto.DirectionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectionService {
    private final DirectionRepository directionRepository;

    public List<DirectionDto> getDirections(){
        return directionRepository.getToutesLesDirections();
    }
}
