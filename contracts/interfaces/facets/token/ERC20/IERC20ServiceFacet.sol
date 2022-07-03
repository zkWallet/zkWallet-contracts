// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import {IERC20Service} from "../../../../token/ERC20/IERC20Service.sol";

/**
 * @title ERC20ServiceFacet interface
 */
interface IERC20ServiceFacet is IERC20Service {
    /**
     * @notice return the current version of ERC20ServiceFacet
     */
    function erc20ServiceFacetVersion() external pure returns (string memory);
}
