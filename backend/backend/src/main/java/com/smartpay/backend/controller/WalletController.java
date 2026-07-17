package com.smartpay.backend.controller;

import com.smartpay.backend.dto.AddMoneyRequest;
import com.smartpay.backend.dto.BalanceResponse;
import com.smartpay.backend.dto.TransferMoneyRequest;
import com.smartpay.backend.security.JwtService;
import com.smartpay.backend.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final JwtService jwtService;

    @GetMapping("/balance")
    public BalanceResponse getBalance(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        return walletService.getBalance(userId);
    }

    @PostMapping("/add-money")
    public BalanceResponse addMoney(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AddMoneyRequest request) {

        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        return walletService.addMoney(userId, request.getAmount());
    }

    @PostMapping("/transfer")
    public String transferMoney(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TransferMoneyRequest request) {

        String token = authHeader.substring(7);
        Long senderUserId = jwtService.extractUserId(token);

        return walletService.transferMoney(
                senderUserId,
                request.getReceiverUserId(),
                request.getAmount()
        );
    }
}