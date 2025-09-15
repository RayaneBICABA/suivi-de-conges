package com.ravex.backend.Controller;

import com.ravex.backend.dto.DirectionDto;
import com.ravex.backend.service.DirectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/direction")
public class DirectionController {
    private final DirectionService directionService;

    @GetMapping()
    public ResponseEntity<List<DirectionDto>> getDirections(){
            List<DirectionDto> data = directionService.getDirections();
            return ResponseEntity.ok(data);
    }
}
