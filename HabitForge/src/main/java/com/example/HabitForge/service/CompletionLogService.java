package com.example.HabitForge.service;

import com.example.HabitForge.model.CompletionLog;
import com.example.HabitForge.repository.CompletionLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompletionLogService {
    private final CompletionLogRepository repository;
    public CompletionLogService(CompletionLogRepository repository) {
        this.repository=repository;
    }
    public CompletionLog addLog(CompletionLog log)
    {
        return repository.save(log);
    }
    public List<CompletionLog> getLogs()
    {
        return repository.findAll();
    }
}
