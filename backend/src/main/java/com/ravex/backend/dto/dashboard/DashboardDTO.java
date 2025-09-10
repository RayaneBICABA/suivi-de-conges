package com.ravex.backend.dto.dashboard;

public record DashboardDTO(Long totalAgent, Long congeEnCours, Long congeTermines) {

    public DashboardDTO {
        totalAgent = (totalAgent == null? 0L : totalAgent);
        congeEnCours = (congeEnCours == null? 0L : congeEnCours);
        congeTermines = (congeTermines == null? 0L : congeTermines);
    }
}
