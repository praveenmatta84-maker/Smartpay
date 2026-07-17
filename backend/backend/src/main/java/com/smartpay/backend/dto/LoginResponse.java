package com.smartpay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private Long userId;
    private String name;
    private String email;
    private String role;
    private String message;
    private String token;
}