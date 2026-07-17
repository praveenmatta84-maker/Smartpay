package com.smartpay.backend.controller;

import com.smartpay.backend.entity.Transaction;
import com.smartpay.backend.repository.TransactionRepository;
import com.smartpay.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final JwtService jwtService;

    @GetMapping
    public List<Transaction> getMyTransactions(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);

        return transactionRepository.findByUser_Id(userId);
    }
}