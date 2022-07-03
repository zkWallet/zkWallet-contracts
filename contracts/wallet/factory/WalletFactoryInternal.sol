// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;
import "hardhat/console.sol";
import { ERC165, IERC165, ERC165Storage } from "@solidstate/contracts/introspection/ERC165.sol";
import { IDiamondWritable } from "@solidstate/contracts/proxy/diamond/writable/IDiamondWritable.sol";
import { ISafeOwnable, IOwnable } from "@solidstate/contracts/access/ownable/ISafeOwnable.sol";
import { AddressUtils } from "@solidstate/contracts/utils/AddressUtils.sol";

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import { IZkWalletDiamond } from "../../interfaces/IZkWalletDiamond.sol";
import { IWalletFactoryInternal } from "./IWalletFactoryInternal.sol";
import { WalletFactoryStorage } from "./WalletFactoryStorage.sol";

/**
 * @title WalletFactory internal functions
 */
abstract contract WalletFactoryInternal is IWalletFactoryInternal {
    using WalletFactoryStorage for WalletFactoryStorage.Layout;
    using WalletFactoryStorage for WalletFactoryStorage.Facet;
    using ERC165Storage for ERC165Storage.Layout;
    using AddressUtils for address;
    using Clones for address;

    string public constant WALLET_CREATION = "WALLET_CREATION";

    /**
     * @notice internal function query the mapping index of facet.
     * @param facetAddress: the address of the facet.
     */
    function _getFacetIndex(address facetAddress) internal view virtual returns (uint) {
        return WalletFactoryStorage.layout().facetIndex[facetAddress];
    }

    /**
     * @notice internal function query a facet.
     * @param arrayIndex: the index of Facet array.
     */
    function _getFacet(uint256 arrayIndex) internal view virtual returns (WalletFactoryStorage.Facet memory) {
        return WalletFactoryStorage.layout().facets[arrayIndex];
    }

    /**
     * @notice internal function query all facets from the storage
     */
    function _getFacets() internal view virtual returns (WalletFactoryStorage.Facet[] memory) {
        return WalletFactoryStorage.layout().facets;
    }

    /**
     * @notice internal function query the address of the Diamond contract
     */
    function _getDiamond() internal view virtual returns (address) {
        return WalletFactoryStorage.layout().diamond;
    }

    /**
     * @notice internal function query the address of a wallet
     * @param hashId: the hash id of the user
     */
    function _getWallet(bytes32 hashId)
        internal
        view
        virtual
        returns (address)
    {
        return WalletFactoryStorage.layout().wallets[hashId];
    }

    /**
     * @notice internal function predict the address of the new wallet
     * @param salt: salt to deterministically deploy the clone
     */
    function _predictDeterministicAddress(bytes32 salt)
        internal
        view
        virtual
        returns (address predicted)
    {
        return address(0); // TODO: _getDiamond().predictDeterministicAddress(salt);
    }

    /**
     * @notice internal function set the address of the Diamond contract
     * @param diamond: the address of the Diamond contract
     */
    function _setDiamond(address diamond) internal virtual {
        WalletFactoryStorage.layout().setDiamond(diamond);

        emit DiamondIsSet(diamond);
    }

    /**
     * @notice internal function add facet to facets mapping
     * @param name: the name of the facet
     * @param facetAddress: the address of the facet contract
     * @param version: the version of the facet
     */
    function _addFacet(
        string memory name,
        address facetAddress,
        string memory version
    ) internal virtual {
        require(
            WalletFactoryStorage.layout().storeFacet(name, facetAddress, version),
            "WalletFactory: not able to store facet"
        );
        
        emit FacetIsAdded(name, facetAddress, version);
    }

    /**
     * @notice internal function remove facet to facets mapping
     * @param facetAddress: facet name to be removed
     */
    function _removeFacet(address facetAddress) internal virtual {
        require(
            WalletFactoryStorage.layout().deleteFacet(facetAddress),
            "WalletFactory: not able to remove facet"
        );

        emit FacetIsRemoved(facetAddress);
    }

    /**
     * @notice internal function add a guardian into WalletFactory
     * @param hashId: the hash of the identification of the guardian
     * @param guardian: the identityCommitment of the guardian
     */
    function _addGuardian(bytes32 hashId, bytes32 guardian) internal virtual {
        WalletFactoryStorage.layout().storeGuardian(hashId, guardian);

        emit GuardianAdded(hashId, guardian);
    }

    /**
     * @notice internal function remove a guardian into WalletFactory
     * @param hashId: the hash of the identification of the guardian
     */
    function _removeGuardian(bytes32 hashId) internal virtual {
        bytes32 guardian = WalletFactoryStorage.layout().guardians[hashId];

        WalletFactoryStorage.layout().deleteGuardian(hashId);

        emit GuardianRemoved(hashId, guardian);
    }

    /**
     * @notice internal function create a new wallet from WalletDiamond
     * @param hashId: the hash of the identification of the user
     * @param owner; the owner of the wallet
     * @param verifiers: the verfiers contract to be added to Semaphore
     * @return the address of the new wallet
     */
    function _createWallet(
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifiers
    )
        internal
        virtual
        returns (address)
    {
        address diamond = _getDiamond();
        WalletFactoryStorage.Facet[] memory facets = _getFacets();

        address newClone = diamond.clone();

       // IZkWalletDiamond(payable(newClone)).initOwner(owner);
        (bool success, bytes memory data) = newClone.call(
            abi.encodeWithSignature("initOwner(address)", owner)
        );
        
        // (bool success, bytes memory data) = newClone.call(
        //     abi.encodeWithSignature("init(address,(string,address,string),(uint8,address))", owner, facets, verifiers)
        // );
        
        WalletFactoryStorage.layout().storeWallet(hashId, newClone);

        emit WalletIsCreated(newClone);

        return newClone;
    }

   /**
     * @notice internal function create a new wallet from WalletDiamond.
     * @param hashId: the hash of the identification of the user.
     * @param owner: the owner of the wallet.
     * @param verifiers: the verfiers contract to be added to Semaphore
     * @param salt: salt to deterministically deploy the clone.
    * @return the address of the new wallet
     */
    function _createWalletDeterministic(
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifiers,
        bytes32 salt
    )
        internal
        virtual
        returns (address)
    {
        address diamond = _getDiamond();
        WalletFactoryStorage.Facet[] memory facets = _getFacets();

        address newClone = diamond.cloneDeterministic(salt);

        (bool success, bytes memory data) = newClone.call(
            abi.encodeWithSignature("init(address,(string,address,string),(uint8,address))", owner, facets, verifiers)
        );

        WalletFactoryStorage.layout().storeWallet(hashId, newClone);

        emit WalletIsCreated(newClone);

        return newClone;
    }

    /**
     * @notice hook that is called before a wallet is created
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _beforeCreateWallet( 
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifiers
    ) internal view virtual {
        require(
            _getDiamond() != address(0),
            "WalletFactory: Diamond address is the zero address  "
        );

        require(
            hashId != bytes32(0),
            "WalletFactory: hashId is the zero value"
        );
    }

    /**
     * @notice hook that is called before a wallet is created
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _beforeCreateWalletDeterministic(
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifiers,
        bytes32 salt
    )
        internal
        view
        virtual
    {
        _beforeCreateWallet(hashId, owner, verifiers );
    }

    /**
     * @notice hook that is called before Diamond is set
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _beforeSetDiamond(address diamond) internal view virtual {
        require(
            diamond != address(0),
            "WalletFactory: Diamond address is the zero address"
        );
    }

    /**
     * @notice hook that is called after Diamond is set
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _afterSetDiamond(address diamond) internal view virtual {}

    /**
     * @notice hook that is called before facet is added
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _beforeAddFacet(
        string memory name,
        address facetAddress,
        string memory version
    ) internal view virtual {
        require(
            keccak256(abi.encodePacked(name)) !=
                (keccak256(abi.encodePacked(""))),
            "WalletFactory: name is empty"
        );

        require(
            facetAddress != address(0),
            "WalletFactory: facetAddress is the zero address"
        );

        require(
            keccak256(abi.encodePacked(version)) !=
                (keccak256(abi.encodePacked(""))),
            "WalletFactory: version is empty"
        );
    }

    /**
     * @notice hook that is called after facet is added
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _afterAddFacet(
        string memory name,
        address facetAddress,
        string memory version
    ) internal view virtual {}

    /**
     * @notice hook that is called before facet is removed
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _beforeRemoveFacet(string memory name) internal view virtual {
        require(
            keccak256(abi.encodePacked(name)) !=
                (keccak256(abi.encodePacked(""))),
            "WalletFactory: name is the zero value"
        );
    }

    /**
     * @notice hook that is called after facet is removed
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _afterRemoveFacet(string memory name) internal view virtual {}

    /**
     * @notice hook that is called before a guardian is added
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _beforeAddGuardian(bytes32 hashId, bytes32 guardian)
        internal
        view
        virtual
    {
        require(
            hashId != bytes32(0),
            "WalletFactory: hashId is the zero value"
        );

        require(
            guardian != bytes32(0),
            "WalletFactory: guardian is the zero value"
        );
    }

    /**
     * @notice hook that is called after a guardian is added
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _afterAddGuardian(bytes32 hashId, bytes32 guardian)
        internal
        view
        virtual
    {}

    /**
     * @notice hook that is called before a guardian is removed
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _beforeRemoveGuardian(bytes32 hashId) internal view virtual {
        require(
            hashId != bytes32(0),
            "WalletFactory: hashId is the zero value"
        );
    }

    /**
     * @notice hook that is called after a guardian is removed
     * to learn more about hooks: https://docs.openzeppelin.com/contracts/4.x/extending-contracts#using-hooks
     */
    function _afterRemoveGuardian(bytes32 hashId) internal view virtual {}
}
