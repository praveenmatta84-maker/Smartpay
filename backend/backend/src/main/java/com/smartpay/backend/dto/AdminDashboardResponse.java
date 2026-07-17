
package com.smartpay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalTransactions;
    private double totalWalletBalance;
    private double totalCredits;
    private double totalDebits;
}