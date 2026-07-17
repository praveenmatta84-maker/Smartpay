package com.smartpay.backend.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AddMoneyRequest {

    @Positive(message = "Amount must be greater than 0")
    private Double amount;
}