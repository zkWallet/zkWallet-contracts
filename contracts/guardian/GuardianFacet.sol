// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { SafeOwnableInternal } from "@solidstate/contracts/access/ownable/SafeOwnableInternal.sol";

import { IGuardianFacet } from "../interfaces/IGuardianFacet.sol";
import { Guardian } from "./Guardian.sol";
import { GuardianStorage } from "./GuardianStorage.sol";

import { SemaphoreGroupsBaseInternal } from "../semaphore/base/SemaphoreGroupsBase/SemaphoreGroupsBaseInternal.sol";
import { SemaphoreGroupsBaseStorage } from "../semaphore/base/SemaphoreGroupsBase/SemaphoreGroupsBaseStorage.sol";


/**
 * @title GuardianFacet 
 */
contract GuardianFacet is 
    IGuardianFacet, 
    Guardian, 
    SemaphoreGroupsBaseInternal,
    SafeOwnableInternal 
{
    /**
     * @inheritdoc IGuardianFacet
     */
    function addGuardians(
        uint256 groupId,
        uint256[] memory identityCommitments
    ) external override groupExists(groupId) {
        _beforeSetInitialGuardians(identityCommitments);

        setInitialGuardians(identityCommitments);
        
        for (uint256 i; i < identityCommitments.length; i++) {
            _addMember(groupId, identityCommitments[i]);
        }
    }

    /**
     * @inheritdoc IGuardianFacet
     */
    function addGuardian(
        uint256 groupId,
        uint256 hashId,
        uint256 identityCommitment
    ) external override {
        _beforeAddGuardian(hashId);

        _beforeAddMember(groupId, identityCommitment);

        require(_addGuardian(hashId), "GuardianFacet: FAILED_TO_ADD_GUARDIAN");

        _addMember(groupId, identityCommitment);
        
        _afterAddMember(groupId, identityCommitment);
    }

    /**
     * @inheritdoc IGuardianFacet
     */
    function removeGuardian(
        uint256 groupId,
        uint256 hashId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external override {
        _beforeRemoveGuardian(hashId);
        
        require(_removeGuardian(hashId), "GuardianFacet: FAILED_TO_REMOVE_GUARDIAN");

        _beforeRemoveMember(groupId, identityCommitment, proofSiblings, proofPathIndices);

        _removeMember(
            groupId,
            identityCommitment,
            proofSiblings,
            proofPathIndices
        );

        _afterRemoveMember(
            groupId,
            identityCommitment,
            proofSiblings,
            proofPathIndices
        );
    }

    /**
     * @notice return the current version of GuardianFacet
     */
    function guardianFacetVersion() external pure override returns (string memory) {
        return "0.1.0.alpha";
    }

     function _beforeSetInitialGuardians(uint256[] memory guardians) 
        internal
        view
        virtual
        override
        onlyOwner
    {
        super._beforeSetInitialGuardians(guardians);
    }

    function _beforeAddGuardian(uint256 hashId) internal view virtual override onlyOwner {
        super._beforeAddGuardian(hashId);
    }

    function _beforeRemoveGuardian(uint256 hashId) internal view virtual override onlyOwner {
        super._beforeRemoveGuardian(hashId);
    }

    function _beforeRemoveGuardians(uint256[] memory guardians) 
        internal view virtual override onlyOwner 
    {
        super._beforeRemoveGuardians(guardians);
    }
}