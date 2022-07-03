// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import {IRecoveryInternal} from "./IRecoveryInternal.sol";
/**
 * @title Recovery Storage base on Diamond Standard Layout storage pattern
 */
library RecoveryStorage {
    struct Layout {
        uint8 status;
        uint256 majority;
        address nominee;
        uint8 counter;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256("simplicy.contracts.storage.Recovery");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }

    /**
     * @notice set the status of the recovery process
     * @param status: the status of the recovery process
     */
    function setStatus(Layout storage s, uint8 status) internal {
        s.status = status;
    }

    /**
     * @notice set the majority of the recovery process
     * @param majority: the majority of the recovery process
     */
    function setMajority(Layout storage s, uint256 majority) internal {
        s.majority = majority;
    }

    /**
     * @notice set the nominee of the recovery process
     * @param nominee: the nominee of the recovery process
     */
    function setNominee(Layout storage s, address nominee) internal {
        s.nominee = nominee;
    }

    /**
     * @notice set the counter of the recovery process
     * @param counter: the counter of the recovery process
     */
    function setCounter(Layout storage s, uint8 counter) internal {
        s.counter = counter;
    }
}
