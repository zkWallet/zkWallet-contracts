// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { SemaphoreGroupsBase } from "../semaphore/base/SemaphoreGroupsBase/SemaphoreGroupsBase.sol";
import { SemaphoreGroupsBaseStorage } from "../semaphore/base/SemaphoreGroupsBase/SemaphoreGroupsBaseStorage.sol";


/**
 * @title SemaphoreGroupsFacet 
 */
contract SemaphoreGroupsFacet is SemaphoreGroupsBase, OwnableInternal {
    /**
     * @notice return the current version of SemaphoreGroupsFacet
     */
    function semaphoreGroupsFacetVersion() public pure returns (string memory) {
        return "0.1.0.alpha";
    }

    function _beforeCreateGroup(
        uint256 groupId,
        uint8 depth,
        uint256 zeroValue,
        address admin
    ) internal view virtual override onlyOwner {
        super._beforeCreateGroup(groupId, depth, zeroValue, admin);
    }
}
