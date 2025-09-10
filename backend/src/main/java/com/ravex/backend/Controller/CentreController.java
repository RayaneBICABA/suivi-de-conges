package com.ravex.backend.Controller;

import com.ravex.backend.dto.centre.CentreDto;
import com.ravex.backend.service.CentreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/centre")
public class CentreController {
    private final CentreService centreService;

    @GetMapping
    public List<CentreDto> getAllCentres() {
        return centreService.getAllCentres();
    }
}
