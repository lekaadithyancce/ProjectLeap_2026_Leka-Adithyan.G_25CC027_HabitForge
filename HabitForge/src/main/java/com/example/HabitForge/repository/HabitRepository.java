package com.example.HabitForge.repository;

import com.example.HabitForge.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<Habit,Long> {
}
