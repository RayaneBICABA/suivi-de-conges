package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.CentreRepository;
import com.ravex.backend.dto.centre.CentreDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CentreService {
    private final CentreRepository centreRepository;

    public List<CentreDto> getAllCentres(){
        return centreRepository.findAllCodeAndLibelle();
    }
}
