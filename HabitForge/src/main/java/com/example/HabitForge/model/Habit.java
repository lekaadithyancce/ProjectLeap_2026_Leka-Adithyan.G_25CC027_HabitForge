package com.example.HabitForge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity public class Habit {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String frequency;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id=id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name=name;
    }
    public String getFrequency() {
        return frequency;
    }
    public void setFrequency(String frequency) {
        this.frequency=frequency;
    }
}