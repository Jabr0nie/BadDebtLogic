// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { SafeMath } from "../../dependencies/openzeppelin/contracts/SafeMath.sol";
import { IPool } from "@aave/core-v3/contracts/interfaces/IPool.sol";
import { IPoolAddressesProvider } from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import { FlashLoanSimpleReceiverBase } from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import { SafeERC20 } from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/SafeERC20.sol";
import { IERC20 } from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract FlashloanRepayExample is FlashLoanSimpleReceiverBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20; 

    IPoolAddressesProvider internal _provider;
    IPool internal _pool;

    constructor(IPoolAddressesProvider provider) FlashLoanSimpleReceiverBase(provider) {
        _pool = IPool(provider.getPool());
    }

 function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // Your logic here, e.g., arbitrage, liquidation, etc.

        // Calculate the total amount to repay
        uint256 amountOwing = amount + premium;

        // Approve the pool to withdraw the repayment amount
        IERC20(asset).safeApprove(address(POOL), amountOwing);

        return true;
    }

    function requestFlashLoan(address asset, uint256 amount) external {
        // Initiate the flash loan
        POOL.flashLoanSimple(
            address(this), // Address of the contract
            asset,         // Asset to borrow
            amount,        // Amount to borrow
            "",            // No additional params
            0              // Referral code
        );
    }
}
