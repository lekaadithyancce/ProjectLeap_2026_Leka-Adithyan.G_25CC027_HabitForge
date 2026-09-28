package com.example.HabitForge.service;
import com.example.HabitForge.model.Habit;
import com.example.HabitForge.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitService {
    private final HabitRepository repository;
    public HabitService(HabitRepository repository)
    {
        this.repository=repository;
    }
    public Habit addHabit(Habit habit)
    {
        return repository.save(habit);
    }
    public List<Habit> getHabits()
    {
        return repository.findAll();
    }
    public void deleteHabit(Long id)
    {
        repository.deleteById(id);
    }
}