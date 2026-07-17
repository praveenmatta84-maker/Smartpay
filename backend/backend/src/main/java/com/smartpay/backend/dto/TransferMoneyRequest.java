package com.smartpay.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransferMoneyRequest {

    @NotNull(message = "Receiver user ID is required")
    private Long receiverUserId;

    @Positive(message = "Amount must be greater than 0")
    private Double amount;
}