package com.taskmanager.service;

import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    // ✅ CREATE PROJECT
    public ProjectResponse createProject(ProjectRequest request, String email) {
        User user = getUser(email);

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(user)
                .build();

        // 🔥 NULL SAFETY
        if (project.getMembers() == null) {
            project.setMembers(new HashSet<>());
        }

        project.getMembers().add(user);

        project = projectRepository.save(project);

        return toResponse(project);
    }

    // ✅ GET MY PROJECTS
    public List<ProjectResponse> getMyProjects(String email) {
        User user = getUser(email);

        return projectRepository.findByMembersContaining(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ GET SINGLE PROJECT
    public ProjectResponse getProject(Long id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return toResponse(project);
    }

    // ✅ ADD MEMBER
    public void addMember(Long projectId, Long userId, String adminEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User member = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (project.getMembers() == null) {
            project.setMembers(new HashSet<>());
        }

        project.getMembers().add(member);
        projectRepository.save(project);
    }

    // ✅ REMOVE MEMBER
    public void removeMember(Long projectId, Long userId, String adminEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User member = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (project.getMembers() != null) {
            project.getMembers().remove(member);
        }

        projectRepository.save(project);
    }

    // ✅ GET MEMBERS
    public List<User> getMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (project.getMembers() == null) {
            return List.of();
        }

        return List.copyOf(project.getMembers());
    }

    // 🔹 GET USER HELPER
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 🔥 SAFE RESPONSE (MAIN FIX)
    private ProjectResponse toResponse(Project p) {

        int memberCount = (p.getMembers() == null) ? 0 : p.getMembers().size();

        return new ProjectResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getCreatedBy().getName(),
                memberCount
        );
    }
}
