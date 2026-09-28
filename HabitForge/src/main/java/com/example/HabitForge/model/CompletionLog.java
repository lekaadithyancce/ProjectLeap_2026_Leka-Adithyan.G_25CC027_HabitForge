package com.example.HabitForge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class CompletionLog {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private Long habitId;
    private LocalDate completionDate;
    public Long getId()
    {
        return id;
    }
    public void setId(Long id)
    {
        this.id=id;
    }
    public Long getHabitId()
    {
        return habitId;
    }
    public void setHabitId(Long habitId)
    {
        this.habitId=habitId;
    }
    public LocalDate getCompletionDate()
    {
        return completionDate;
    }
    public void setCompletionDate(LocalDate completionDate)
    {
        this.completionDate=completionDate;
    }
}