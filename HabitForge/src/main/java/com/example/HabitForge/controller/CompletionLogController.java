package com.example.HabitForge.controller;

import com.example.HabitForge.model.CompletionLog;
import com.example.HabitForge.service.CompletionLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/logs")
public class CompletionLogController {
    private final CompletionLogService service;
    public CompletionLogController(CompletionLogService service)
    {
        this.service=service;
    }
    @PostMapping
    public CompletionLog addCompletionLog(@RequestMapping CompletionLog logs)
    {
        return service.addLog(logs);
    }
    @GetMapping
    public List<CompletionLog> getLogs() {
        return service.getLogs();
    }
}
