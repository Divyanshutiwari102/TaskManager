package com.taskmanager.service;

import com.taskmanager.dto.DashboardResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public DashboardResponse getDashboard() {
        long total = taskRepository.count();
        long todo = taskRepository.countByStatus(Task.Status.TODO);
        long inProgress = taskRepository.countByStatus(Task.Status.IN_PROGRESS);
        long done = taskRepository.countByStatus(Task.Status.DONE);
        long overdue = taskRepository.findByDueDateBeforeAndStatusNot(LocalDate.now(), Task.Status.DONE).size();
        long projects = projectRepository.count();

        return new DashboardResponse(total, todo, inProgress, done, overdue, projects);
    }
}
