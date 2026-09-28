package com.example.HabitForge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Streak {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long habitId;
    private int currentStreak;
    private int bestStreak;
    public Long getHabitId()
    {
        return habitId;
    }
    public void setHabitId()
    {
        this.habitId=habitId;
    }
    public int getCurrentStreak()
    {
        return currentStreak;
    }
    public void setCurrentStreak(int currentStreak)
    {
        this.currentStreak=currentStreak;
    }
    public int getBestStreak()
    {
        return bestStreak;
    }
    public void setBestStreak(int bestSteak)
    {
        this.bestStreak=bestStreak;
    }
}