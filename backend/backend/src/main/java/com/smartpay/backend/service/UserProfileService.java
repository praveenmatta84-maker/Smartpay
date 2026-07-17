package com.smartpay.backend.service;

import com.smartpay.backend.dto.ProfileResponse;
import com.smartpay.backend.entity.User;
import com.smartpay.backend.entity.Wallet;
import com.smartpay.backend.exception.UserNotFoundException;
import com.smartpay.backend.exception.WalletNotFoundException;
import com.smartpay.backend.repository.UserRepository;
import com.smartpay.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public ProfileResponse getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new WalletNotFoundException("Wallet not found"));

        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                wallet.getBalance()
        );
    }
}