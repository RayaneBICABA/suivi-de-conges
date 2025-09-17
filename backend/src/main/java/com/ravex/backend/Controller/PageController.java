package com.ravex.backend.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    
    @GetMapping("/home") // Changez "/" par "/home"
    public String home() {
        return "forward:/login.html";
    }
}