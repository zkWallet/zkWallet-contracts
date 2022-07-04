//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import {IGuardian} from "../guardian/IGuardian.sol";

/**
 * @title GuardianFacet interface
 */
interface IGuardianFacet is IGuardian {
    /**
     * @notice add guardians
     * @param groupId: the group id of the semaphore group
     * @param identityCommitments: the identity commitments of guardians
     *
     */
     function addGuardians(
        uint256 groupId,
        uint256[] memory identityCommitments
    ) external;

    /**
     * @notice add guardian
     * @param groupId: the group id of the semaphore group
     * @param hashId: the hash id of the guardian
     * @param identityCommitment: the identity commitment of the guardian
     *
     */
    function addGuardian(uint256 groupId, uint256 hashId, uint256 identityCommitment) external;

    /**
     * @notice remove guardian
     * @param groupId: the group id of the semaphore group
     * @param hashId: the hash id of the guardian
     * @param identityCommitment: existing identity commitment to be deleted
     * @param proofSiblings: array of the sibling nodes of the proof of membership of the semaphoregroup.
     * @param proofPathIndices: path of the proof of membership of the semaphoregroup
     *
     */
    function removeGuardian(
        uint256 groupId,
        uint256 hashId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;

    /**
     * @notice return the current version of GuardianFacet
     */
    function guardianFacetVersion() external pure returns (string memory);
}
