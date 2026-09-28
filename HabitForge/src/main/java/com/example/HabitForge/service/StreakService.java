package com.example.HabitForge.service;

import com.example.HabitForge.model.Streak;
import com.example.HabitForge.repository.StreakRepository;
import org.springframework.stereotype.Service;

@Service
public class StreakService {
    private final StreakRepository repository;
    public StreakService(StreakRepository repository)
    {
        this.repository=repository;
    }
    public Streak updateStreak(Streak streak)
    {
        if(streak.getCurrentStreak()>streak.getBestStreak())
        {
            streak.setBestStreak(streak.getCurrentStreak());
        }
        return repository.save(streak);
    }
}
