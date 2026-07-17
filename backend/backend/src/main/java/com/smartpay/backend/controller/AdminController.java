package com.smartpay.backend.controller;

import com.smartpay.backend.dto.AdminDashboardResponse;
import com.smartpay.backend.dto.AdminUserResponse;
import com.smartpay.backend.entity.Transaction;
import com.smartpay.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/statistics")
    public AdminDashboardResponse getDashboardStatistics() {
        return adminService.getDashboardStatistics();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return adminService.getAllTransactions();
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long userId) {

        adminService.deleteUser(userId);

        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully")
        );
    }
}