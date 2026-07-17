package com.smartpay.backend.service;

import com.smartpay.backend.dto.BalanceResponse;
import com.smartpay.backend.entity.Transaction;
import com.smartpay.backend.entity.Wallet;
import com.smartpay.backend.exception.InsufficientBalanceException;
import com.smartpay.backend.exception.WalletNotFoundException;
import com.smartpay.backend.repository.TransactionRepository;
import com.smartpay.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public BalanceResponse getBalance(Long userId) {

        log.info("Checking balance for User ID: {}", userId);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Wallet not found for User ID: {}", userId);
                    return new WalletNotFoundException("Wallet not found");
                });

        log.info("Current balance for User {} is {}", userId, wallet.getBalance());

        return new BalanceResponse(wallet.getBalance());
    }

    public BalanceResponse addMoney(Long userId, Double amount) {

        log.info("Add money request. User ID: {}, Amount: {}", userId, amount);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Wallet not found for User ID: {}", userId);
                    return new WalletNotFoundException("Wallet not found");
                });

        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        Transaction transaction = Transaction.builder()
                .amount(amount)
                .type("CREDIT")
                .transactionTime(LocalDateTime.now())
                .user(wallet.getUser())
                .build();

        transactionRepository.save(transaction);

        log.info("Money added successfully. New Balance: {}", wallet.getBalance());

        return new BalanceResponse(wallet.getBalance());
    }

    public String transferMoney(Long senderUserId,
                                Long receiverUserId,
                                Double amount) {

        log.info("Transfer request: Sender={}, Receiver={}, Amount={}",
                senderUserId, receiverUserId, amount);

        Wallet senderWallet = walletRepository.findByUserId(senderUserId)
                .orElseThrow(() -> {
                    log.error("Sender wallet not found");
                    return new WalletNotFoundException("Sender wallet not found");
                });

        Wallet receiverWallet = walletRepository.findByUserId(receiverUserId)
                .orElseThrow(() -> {
                    log.error("Receiver wallet not found");
                    return new WalletNotFoundException("Receiver wallet not found");
                });

        if (senderWallet.getBalance() < amount) {
            log.warn("Insufficient balance for User {}", senderUserId);
            throw new InsufficientBalanceException("Insufficient balance");
        }

        senderWallet.setBalance(senderWallet.getBalance() - amount);
        receiverWallet.setBalance(receiverWallet.getBalance() + amount);

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Transaction senderTransaction = Transaction.builder()
                .amount(amount)
                .type("DEBIT")
                .transactionTime(LocalDateTime.now())
                .user(senderWallet.getUser())
                .build();

        Transaction receiverTransaction = Transaction.builder()
                .amount(amount)
                .type("CREDIT")
                .transactionTime(LocalDateTime.now())
                .user(receiverWallet.getUser())
                .build();

        transactionRepository.save(senderTransaction);
        transactionRepository.save(receiverTransaction);

        log.info("Transfer completed successfully from User {} to User {}",
                senderUserId, receiverUserId);

        return "Money transferred successfully";
    }
}