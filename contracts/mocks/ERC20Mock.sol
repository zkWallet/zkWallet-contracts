// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title mock class using ERC20 
 */
contract ERC20Mock is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        address initialAccount,
        uint256 initialBalance
    ) payable ERC20(name, symbol) {
        _mint(initialAccount, initialBalance * 10**decimals());
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}