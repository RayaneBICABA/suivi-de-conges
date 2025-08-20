package com.ravex.backend.domain.Repository;

import com.ravex.backend.domain.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, String> {
}
