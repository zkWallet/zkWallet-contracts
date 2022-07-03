// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { ISolidStateERC20 } from "@solidstate/contracts/token/ERC20/ISolidStateERC20.sol";

import { IERC20Service } from "../../../../token/ERC20/IERC20Service.sol";

/**
 * @title ERC20Facet interface
 */
interface IERC20Facet is ISolidStateERC20 {

    /**
     * @notice burn tokens held by msg.sender
     * @param amount quantity of tokens burned
     */
    function burn(uint256 amount) external;
    
    /**
     * @notice return the current version of ERC20Facet
     */
    function erc20FacetVersion() external pure returns (string memory);
}
