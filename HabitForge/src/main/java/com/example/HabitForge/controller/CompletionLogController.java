package com.example.HabitForge.controller;

import com.example.HabitForge.model.CompletionLog;
import com.example.HabitForge.service.CompletionLogService;
import org.springframework.web.bind.annotation.*;

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
    public CompletionLog addCompletionLog(@RequestBody CompletionLog logs)
    {
        return service.addLog(logs);
    }
    @GetMapping
    public List<CompletionLog> getLogs() {
        return service.getLogs();
    }
}
