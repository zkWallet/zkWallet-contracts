// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IZkWalletDiamond } from "../../interfaces/IZkWalletDiamond.sol";
import { IWalletFactoryInternal } from "../../wallet/factory/IWalletFactoryInternal.sol";
import { ZkWalletDiamondBase } from "./base/ZkWalletDiamondBase.sol";
// import { ISemaphoreInternal } from "../../semaphore/ISemaphoreInternal.sol";
import { WalletFactoryStorage } from "../../wallet/factory/WalletFactoryStorage.sol";


/**
 * @title ZkWalletDiamond 
 */
contract ZkWalletDiamond is IZkWalletDiamond, ZkWalletDiamondBase {
    function initOwner(address owner_) external override onlyOwner {
        _initOwner(owner_);
    }

    function init(
        address owner_,
        WalletFactoryStorage.Facet[] memory facets_,
        IWalletFactoryInternal.VerifierDTO[] memory verifiers
    ) external override onlyOwner {
        require(owner_ != address(0), "ZkWalletDiamond: owner is the zero address");
        
        _initFacets(owner_, facets_, verifiers);
    }

    /**
     * @notice return the current version of the diamond
     */
    function version()
        public
        pure
        override(IZkWalletDiamond)
        returns (string memory)
    {
        return "0.1.0.alpha";
    }
}

