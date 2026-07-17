package com.smartpay.backend.service;

import com.smartpay.backend.dto.LoginRequest;
import com.smartpay.backend.dto.LoginResponse;
import com.smartpay.backend.dto.UserRegistrationRequest;
import com.smartpay.backend.entity.User;
import com.smartpay.backend.entity.Wallet;
import com.smartpay.backend.exception.EmailAlreadyExistsException;
import com.smartpay.backend.exception.UserNotFoundException;
import com.smartpay.backend.repository.UserRepository;
import com.smartpay.backend.repository.WalletRepository;
import com.smartpay.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public User registerUser(UserRegistrationRequest request) {

        log.info("Registration request received for email: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);

        Wallet wallet = Wallet.builder()
                .balance(0.0)
                .user(savedUser)
                .build();

        walletRepository.save(wallet);

        log.info("User registered successfully. User ID: {}", savedUser.getId());

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {

        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("Login failed. User not found: {}", request.getEmail());
                    return new UserNotFoundException("Invalid email");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Invalid password for email: {}", request.getEmail());
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        log.info("Login successful for user: {}", user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Login successful",
                token
        );
    }
}