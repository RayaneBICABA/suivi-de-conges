package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.UtilisateurRepository;
import com.ravex.backend.domain.model.Utilisateur;
import com.ravex.backend.util.PasswordUtil;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository){
        this.utilisateurRepository = utilisateurRepository;
    }

    public Utilisateur saveUser(Utilisateur utilisateur){
        utilisateur.setPassword(PasswordUtil.encode(utilisateur.getPassword()));
        return utilisateurRepository.save(utilisateur);
    }

    public boolean existsEmail(String email){
        return utilisateurRepository.existsByEmail(email);
    }

    public Optional<Utilisateur> authenticate(String email, String rawPassword) {
    return utilisateurRepository.findByEmail(email)
        .filter(u -> PasswordUtil.matches(rawPassword, u.getPassword()));
}


}
