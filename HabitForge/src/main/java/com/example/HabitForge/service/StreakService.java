package com.example.HabitForge.service;

import com.example.HabitForge.model.Streak;
import com.example.HabitForge.repository.StreakRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StreakService {

    private final StreakRepository repository;

    public StreakService(StreakRepository repository) {
        this.repository=repository;
    }

    public Streak updateStreak(Streak streak) {

        Streak oldStreak=repository.findFirstByHabitIdOrderByIdAsc(streak.getHabitId()).orElse(null);

        if(oldStreak!=null) {

            oldStreak.setCurrentStreak(streak.getCurrentStreak());

            if(streak.getCurrentStreak()>oldStreak.getBestStreak()) {
                oldStreak.setBestStreak(streak.getCurrentStreak());
            }

            return repository.save(oldStreak);
        }

        streak.setBestStreak(streak.getCurrentStreak());

        return repository.save(streak);
    }


    public List<Streak> getAllStreaks() {
        return repository.findAll();
    }

}