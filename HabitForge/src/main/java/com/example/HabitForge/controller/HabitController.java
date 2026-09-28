package com.example.HabitForge.controller;

import com.example.HabitForge.model.Habit;
import com.example.HabitForge.service.HabitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habits")
public class HabitController {
private final HabitService service;
public HabitController(HabitService service)
{
    this.service=service;
}
@PostMapping
public Habit addHabit(@RequestBody Habit habit)
{

    return service.addHabit(habit);
}
@GetMapping
    public List<Habit> getHabits(){

    return service.getHabits();
}
@DeleteMapping("/{id}")
public String deleteHabit(@PathVariable Long id)
{
service.deleteHabit(id);
return "habit deleted";
}
}
