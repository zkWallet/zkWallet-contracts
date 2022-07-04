// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { SafeOwnableInternal } from "@solidstate/contracts/access/ownable/SafeOwnableInternal.sol";

import { Counters } from "./Counters.sol";

/**
 * @title CountersFacet 
 */
contract CountersFacet is Counters, SafeOwnableInternal {
    /**
     * @notice return the current version of CountersFacet
     */
    function countersFacetVersion() external pure returns (string memory) {
        return "0.1.0.alpha";
    }
    function _beforeIncrement(uint256 index) internal view virtual override onlyOwner {
        super._beforeIncrement(index);
    }

   function _beforeDecrement(uint256 index) internal view virtual override onlyOwner {
        super._beforeDecrement(index);
   }

   function _beforeReset(uint256 index) internal view virtual override onlyOwner {
        super._beforeReset(index);
   }
}
