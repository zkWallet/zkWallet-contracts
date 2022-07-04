// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

import { IWalletFactoryFacet } from "../interfaces/IWalletFactoryFacet.sol";
import { WalletFactory } from "../wallet/factory/WalletFactory.sol";


/**
 * @title WalletFactoryFacet 
 */
contract WalletFactoryFacet is IWalletFactoryFacet, WalletFactory, OwnableInternal {
    /**
     * @notice return the current version of WalletFactoryFacets
     */
    function walletFactoryFacetVersion() external pure override returns (string memory) {
        return "0.1.0.alpha";
    }

    function _beforeSetDiamond(address diamond)
        internal
        view
        virtual
        override
        onlyOwner
    {
        super._beforeSetDiamond(diamond);
    }

    function _beforeAddFacet(
        string memory name,
        address facetAddress,
        string memory version
    ) internal view virtual override onlyOwner {
        super._beforeAddFacet(name, facetAddress, version);
    }

     function _beforeRemoveFacet(string memory name) internal view virtual override onlyOwner {
        super._beforeRemoveFacet(name);
     }

    function _beforeAddGuardian(bytes32 hashId, bytes32 guardian)
        internal
        view
        virtual
        override
        onlyOwner
    {
        super._beforeAddGuardian(hashId, guardian);
    }

    function _beforeRemoveGuardian(bytes32 hashId)
        internal
        view
        virtual
        override
        onlyOwner
    {
        super._beforeRemoveGuardian(hashId);
    }
}
