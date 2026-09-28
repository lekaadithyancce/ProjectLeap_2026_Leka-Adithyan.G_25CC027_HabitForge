package com.example.HabitForge.repository;

import com.example.HabitForge.model.Streak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StreakRepository extends JpaRepository<Streak,Long> {

    Optional<Streak> findFirstByHabitIdOrderByIdAsc(Long habitId);
}