package com.ravex.backend.service;

import com.ravex.backend.domain.Repository.UtilisateurRepository;
import com.ravex.backend.domain.model.Utilisateur;
import com.ravex.backend.util.PasswordUtil;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;

    // Injection par constructeur
    public UtilisateurService(UtilisateurRepository utilisateurRepository){
        this.utilisateurRepository = utilisateurRepository;
    }

    // Créer un nouvel utilisateur
    public Utilisateur saveUser(Utilisateur utilisateur){
        utilisateur.setPassword(PasswordUtil.encode(utilisateur.getPassword()));
        return utilisateurRepository.save(utilisateur);
    }

    // Vérifier si un email existe déjà
    public boolean existsEmail(String email){
        return utilisateurRepository.existsByEmail(email);
    }

    // Vérifier si email et mot de passe sont corrects
    public Optional<Utilisateur> authenticate(String email, String rawPassword) {
    return utilisateurRepository.findByEmail(email)
        .filter(u -> PasswordUtil.matches(rawPassword, u.getPassword()));
}


}
