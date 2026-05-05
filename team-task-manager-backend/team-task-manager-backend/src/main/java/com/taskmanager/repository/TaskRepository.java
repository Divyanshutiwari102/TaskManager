package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedToAndStatus(User user, Task.Status status);
    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, Task.Status status);
    long countByStatus(Task.Status status);
    long countByAssignedTo(User user);
}
