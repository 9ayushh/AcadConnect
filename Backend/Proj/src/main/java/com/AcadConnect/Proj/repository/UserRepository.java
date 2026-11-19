package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<User> findByRole(RoleType role);
    List<User> findByDepartmentId(Long departmentId);
}

