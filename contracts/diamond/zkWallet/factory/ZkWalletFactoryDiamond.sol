// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { SolidStateDiamond } from "@solidstate/contracts/proxy/diamond/SolidStateDiamond.sol";
import { IZkWalletFactoryDiamond } from "./IZkWalletFactoryDiamond.sol";


/**
 * @title ZkWalletFactoryDiamond 
 */
contract ZkWalletFactoryDiamond is IZkWalletFactoryDiamond,  SolidStateDiamond {
    /**
     * @notice return the current version of the diamond
     */
    function version() public pure override returns (string memory) {
        return "0.1.0.alpha";
    }
}
