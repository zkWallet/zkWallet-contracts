// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IWalletFactory } from "./IWalletFactory.sol";
import { WalletFactoryInternal } from "./WalletFactoryInternal.sol";
import { WalletFactoryStorage } from "./WalletFactoryStorage.sol";

abstract contract WalletFactory is IWalletFactory, WalletFactoryInternal {
    /**
     * @inheritdoc IWalletFactory
     */
    function setDiamond(address diamond) external override {
        _beforeSetDiamond(diamond);

        _setDiamond(diamond);

        _afterSetDiamond(diamond);
    }

     /**
     * @inheritdoc IWalletFactory
     */
    function addFacet(
        string memory name,
        address facetAddress,
        string memory version
    ) external override {
        _beforeAddFacet(name, facetAddress, version);

        _addFacet(name, facetAddress, version);

        _afterAddFacet(name, facetAddress, version);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function addGuardian(bytes32 hashId, bytes32 guardian) external override {
        _addGuardian(hashId, guardian);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function removeGuardian(bytes32 hashId) external override {
        _removeGuardian(hashId);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function createWallet(
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifier
    ) external override returns (address) {
        _beforeCreateWallet(hashId, owner, verifier);
        
        return _createWallet(hashId, owner, verifier);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function createWalletDeterministic(
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifiers,
        bytes32 salt
    )
        external
        override
        returns (address)
    {
        _beforeCreateWalletDeterministic(hashId, owner,verifiers, salt);

        return _createWalletDeterministic(hashId, owner, verifiers, salt);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function getFacetIndex(address facetAddress) external view override returns (uint) {
        return _getFacetIndex(facetAddress);
    }

     /**
     * @inheritdoc IWalletFactory
     */
    function getFacet(uint256 arrayIndex) external view override returns (WalletFactoryStorage.Facet memory) {
        return _getFacet(arrayIndex);
    }

     /**
     * @inheritdoc IWalletFactory
     */
    function getFacets() external view override returns (WalletFactoryStorage.Facet[] memory) {
        return _getFacets();
    }
    
    /**
     * @inheritdoc IWalletFactory
     */
    function predictDeterministicAddress(bytes32 salt)
        public
        view
        override
        returns (address predicted)
    {
        return _predictDeterministicAddress(salt);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function getDiamond() public view override returns (address) {
        return _getDiamond();
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function getWallet(bytes32 hashId) external view returns (address) {
        return _getWallet(hashId);
    }
}
