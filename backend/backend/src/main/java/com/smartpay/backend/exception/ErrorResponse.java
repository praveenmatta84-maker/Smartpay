package com.smartpay.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {

    private boolean success;
    private String message;
    private LocalDateTime timestamp;
}