// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { ISemaphoreGroups } from "../semaphore/ISemaphoreGroups.sol";


/**
 * @title SemaphoreGroupsFacet interface
 */
interface ISemaphoreGroupsFacet is ISemaphoreGroups {
    /**
     * @notice return the current version of SemaphoreGroupsFacet
     */
    function semaphoreGroupsFacetVersion() external pure returns (string memory);
}
