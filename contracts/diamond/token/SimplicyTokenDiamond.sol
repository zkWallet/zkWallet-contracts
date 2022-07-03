// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { SolidStateDiamond } from "@solidstate/contracts/proxy/diamond/SolidStateDiamond.sol";

import { ISimplicyTokenDiamond } from "../../interfaces/diamond/ISimplicyTokenDiamond.sol";

contract SimplicyTokenDiamond is ISimplicyTokenDiamond, SolidStateDiamond {    
    
    /**
     * @inheritdoc ISimplicyTokenDiamond
     */
    function version()
        public
        pure
        override(ISimplicyTokenDiamond)
        returns (string memory)
    {
        return "0.1.0.alpha";
    } 
}