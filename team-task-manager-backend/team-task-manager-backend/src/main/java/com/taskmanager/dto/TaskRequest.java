package com.taskmanager.dto;

import com.taskmanager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class TaskRequest {
    @NotBlank private String title;
    private String description;
    private Task.Status status = Task.Status.TODO;
    private LocalDate dueDate;
    private Long assignedToId;
}
