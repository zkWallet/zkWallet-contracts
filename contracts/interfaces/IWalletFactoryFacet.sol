// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IWalletFactory } from "../wallet/factory/IWalletFactory.sol";


/**
 * @title WalletFactoryFacet Interface
 */
interface IWalletFactoryFacet is IWalletFactory {
    /**
     * @notice return the current version of WalletFactoryFacets
     */
    function walletFactoryFacetVersion() external pure returns (string memory);
}
