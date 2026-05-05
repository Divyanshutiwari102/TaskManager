package com.taskmanager.service;

import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectResponse createProject(ProjectRequest request, String email) {
        User user = getUser(email);
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(user)
                .build();
        project.getMembers().add(user);
        project = projectRepository.save(project);
        return toResponse(project);
    }

    public List<ProjectResponse> getMyProjects(String email) {
        User user = getUser(email);
        return projectRepository.findByMembersContaining(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProjectResponse getProject(Long id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return toResponse(project);
    }

    public void addMember(Long projectId, Long userId, String adminEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        project.getMembers().add(member);
        projectRepository.save(project);
    }

    public void removeMember(Long projectId, Long userId, String adminEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        project.getMembers().remove(member);
        projectRepository.save(project);
    }

    public List<User> getMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return List.copyOf(project.getMembers());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProjectResponse toResponse(Project p) {
        return new ProjectResponse(
                p.getId(), p.getName(), p.getDescription(),
                p.getCreatedBy().getName(), p.getMembers().size()
        );
    }
}
