// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IRecovery } from "../recovery/IRecovery.sol";
interface IRecoveryFacet is IRecovery {
    /**
     * @notice return the current version of RecoveryFacet
     */
    function recoveryFacetVersion() external pure returns (string memory);

}