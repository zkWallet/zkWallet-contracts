// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

/**
 * @title Partial ERC20Service interface needed by internal functions
 */
interface IERC20ServiceInternal {
    /**
     * @notice emitted when a new ERC20 token is registered
     * @param tokenAddress: the address of the ERC20 token
     */
    event ERC20TokenTracked(address indexed tokenAddress);

    /**
     * @notice emitted when a new ERC20 token is removed
     * @param tokenAddress: the address of the ERC20 token
     */
    event ERC20TokenRemoved(address tokenAddress); 

    /**
     * @notice emitted when a ERC20 token is deposited.
     * @param tokenAddress: the address of the ERC20 token.
     * @param amount: the amount of token deposited.
     */
    event ERC20Deposited(address indexed tokenAddress, uint256 amount);
}
