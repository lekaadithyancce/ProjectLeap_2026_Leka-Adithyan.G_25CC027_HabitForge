package com.example.HabitForge.controller;

import com.example.HabitForge.model.Streak;
import com.example.HabitForge.service.StreakService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/streaks")
public class StreakController {

    private final StreakService service;
    public StreakController(StreakService service) {
        this.service=service;
    }

    @PostMapping
    public Streak updateStreak(@RequestBody Streak streak) {
        return service.updateStreak(streak);
    }
    @GetMapping
    public List<Streak> getStreaks() {
        return service.getAllStreaks();
    }

}