package com.ravex.backend.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        // redirige la racine vers login.html
        return "redirect:/login.html";
    }
}
