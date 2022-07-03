// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { ISolidStateDiamond } from "@solidstate/contracts/proxy/diamond/ISolidStateDiamond.sol";

/**
 * @title SimplicyTokenDiamond  interface
 */
interface ISimplicyTokenDiamond is ISolidStateDiamond {
    /**
     * @notice return the current version of SimplicyTokenDiamond
     */
    function version() external view returns (string memory);
}

