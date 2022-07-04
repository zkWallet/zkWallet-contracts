//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { IWalletFactoryInternal } from "./IWalletFactoryInternal.sol";
import { WalletFactoryStorage } from "./WalletFactoryStorage.sol";

/**
 * @title Semaphore interface
 */
interface IWalletFactory is IWalletFactoryInternal {
    /**
     * @notice set the address of the Diamond contract.
     * @param diamond: the address of the Diamond contract.
     */
    function setDiamond(address diamond) external;

    /**
     * @notice add facet to facets array.
     * @param name: the name of the facet.
     * @param facetAddress: the address of the facet contract.
     * @param version: the version of the facet.
     */
    function addFacet(
        string memory name,
        address facetAddress,
        string memory version
    ) external;

    /**
     * @notice add a guardian into WalletFactory.
     * @param hashId: the hash of the identification of the guardian.
     * @param guardian: the identityCommitment of the guardian.
     */
    function addGuardian(bytes32 hashId, bytes32 guardian) external;

    /**
     * @notice remove a guardian into WalletFactory.
     * @param hashId: the hash of the identification of the guardian.
     */
    function removeGuardian(bytes32 hashId) external;

    /**
     * @notice deploy a new wallet from WalletDiamond.
     * @param hashId: the hash of the identification of the user.
     * @param owner: the owner of the wallet.
     * @param verifiers: the verfiers contract to be added to Semaphore.
     *
     * @return the address of the new wallet.
     */
    function createWallet(
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifiers
    ) external returns (address);

    /**
     * @notice create a new wallet from WalletDiamond.
     * @param hashId: the hash of the identification of the user.
     * @param owner: the owner of the wallet.
     * @param verifiers: the verfiers contract to be added to Semaphore.
     * @param salt: salt to deterministically deploy the clone.
     */
    function createWalletDeterministic(
        bytes32 hashId,
        address owner,
        VerifierDTO[] memory verifiers, 
        bytes32 salt
    ) external  returns (address);

    /**
     * @notice query the mapping index of facet.
     * @param facetAddress: the address of the facet.
     */
    function getFacetIndex(address facetAddress) external view returns (uint);

    /**
     * @notice query a facet.
     * @param arrayIndex: the index of Facet array.
     */
    function getFacet(uint256 arrayIndex) external view returns (WalletFactoryStorage.Facet memory);

    /**
     * @notice query all facets from the storage.
     */
    function getFacets() external view returns (WalletFactoryStorage.Facet[] memory);

    /**
     * @notice predict the address of the new wallet.
     * @param salt: salt to deterministically deploy the clone.
     */
    function predictDeterministicAddress(bytes32 salt)
        external
        view
        returns (address predicted);

    /**
     * @notice query the address of the stored diamond contract.
     */
    function getDiamond() external view returns (address);

    /**
     * @notice query the address of the wallet contract.
     * @param hashId: the hash id of the user.
     */
    function getWallet(bytes32 hashId) external view returns (address);
}
