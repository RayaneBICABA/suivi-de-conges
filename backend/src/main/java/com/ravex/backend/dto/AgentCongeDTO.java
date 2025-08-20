package com.ravex.backend.dto;

import com.ravex.backend.domain.model.Agent;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AgentCongeDTO {
    private Agent agent;
    private Integer jours;
}