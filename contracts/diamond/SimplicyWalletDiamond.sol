// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import {SimplicyDiamond} from "./SimplicyDiamond.sol";
import {ISimplicyWalletDiamond} from "./ISimplicyWalletDiamond.sol";

contract SimplicyWalletDiamond is ISimplicyWalletDiamond, SimplicyDiamond {
    constructor(address owner_) public {
        __SimplicyDiamond_init(owner_);
    }
    /**
     * @notice return the current version of the diamond
     */
    function version()
        public
        pure
        override(ISimplicyWalletDiamond)
        returns (string memory)
    {
        return "0.0.1";
    }
}

