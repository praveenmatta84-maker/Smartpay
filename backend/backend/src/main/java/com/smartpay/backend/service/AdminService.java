package com.smartpay.backend.service;

import com.smartpay.backend.dto.AdminDashboardResponse;
import com.smartpay.backend.dto.AdminUserResponse;
import com.smartpay.backend.entity.Transaction;
import com.smartpay.backend.entity.User;
import com.smartpay.backend.entity.Wallet;
import com.smartpay.backend.exception.UserNotFoundException;
import com.smartpay.backend.repository.TransactionRepository;
import com.smartpay.backend.repository.UserRepository;
import com.smartpay.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public AdminDashboardResponse getDashboardStatistics() {

        List<User> users = userRepository.findAll();
        List<Wallet> wallets = walletRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();

        double totalWalletBalance = wallets.stream()
                .mapToDouble(wallet -> wallet.getBalance() == null
                        ? 0.0
                        : wallet.getBalance())
                .sum();

        double totalCredits = transactions.stream()
                .filter(transaction ->
                        "CREDIT".equalsIgnoreCase(transaction.getType()))
                .mapToDouble(transaction -> transaction.getAmount() == null
                        ? 0.0
                        : transaction.getAmount())
                .sum();

        double totalDebits = transactions.stream()
                .filter(transaction ->
                        "DEBIT".equalsIgnoreCase(transaction.getType()))
                .mapToDouble(transaction -> transaction.getAmount() == null
                        ? 0.0
                        : transaction.getAmount())
                .sum();

        return new AdminDashboardResponse(
                users.size(),
                transactions.size(),
                totalWalletBalance,
                totalCredits,
                totalDebits
        );
    }

    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToAdminUserResponse)
                .toList();
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElse(null);

        List<Transaction> transactions =
                transactionRepository.findByUser_Id(userId);

        transactionRepository.deleteAll(transactions);

        if (wallet != null) {
            walletRepository.delete(wallet);
        }

        userRepository.delete(user);

        log.info("Admin deleted user with ID: {}", userId);
    }

    private AdminUserResponse convertToAdminUserResponse(User user) {

        Double balance = walletRepository.findByUserId(user.getId())
                .map(Wallet::getBalance)
                .orElse(0.0);

        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                balance
        );
    }
}