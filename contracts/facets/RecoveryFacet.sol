// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { SafeOwnableInternal } from "@solidstate/contracts/access/ownable/SafeOwnableInternal.sol";
import { IRecoveryFacet } from "../interfaces/IRecoveryFacet.sol";
import { Recovery } from "../recovery/Recovery.sol";
import { RecoveryStorage } from "../recovery/RecoveryStorage.sol";


/**
 * @title RecoveryFacet 
 */
contract RecoveryFacet is IRecoveryFacet, Recovery, SafeOwnableInternal {
    using RecoveryStorage for RecoveryStorage.Layout;

    /**
     * @inheritdoc IRecoveryFacet
     */
    function recoveryFacetVersion() public pure override returns (string memory) {
        return "0.1.0.alpha";
    }

    function _beforeResetRecovery() internal view virtual override onlyOwner {}

    function _duringRecovery(uint256 majority, address newOwner) internal virtual override {
        _transferOwnership(newOwner);
    }
}