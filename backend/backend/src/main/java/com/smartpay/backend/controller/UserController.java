package com.smartpay.backend.controller;

import com.smartpay.backend.dto.LoginRequest;
import com.smartpay.backend.dto.LoginResponse;
import com.smartpay.backend.dto.ProfileResponse;
import com.smartpay.backend.dto.UserRegistrationRequest;
import com.smartpay.backend.entity.User;
import com.smartpay.backend.security.JwtService;
import com.smartpay.backend.service.UserProfileService;
import com.smartpay.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserProfileService userProfileService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public User registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);

        return userProfileService.getProfile(userId);
    }
}