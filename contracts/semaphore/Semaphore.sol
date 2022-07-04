// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import {IVerifier} from "../interfaces/IVerifier.sol";
import {ISemaphore} from "./ISemaphore.sol";
import {SemaphoreInternal} from "./SemaphoreInternal.sol";
import {SemaphoreStorage} from "./SemaphoreStorage.sol";
import {SemaphoreCoreBaseStorage} from "./base/SemaphoreCoreBase/SemaphoreCoreBaseStorage.sol";

abstract contract Semaphore is ISemaphore, SemaphoreInternal {    
    /**
     * @inheritdoc ISemaphore
     */
    function verifyProof(
        uint256 groupId,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        _beforeVerifyProof(groupId, signal, nullifierHash, externalNullifier, proof);

        _verifyProof(groupId, signal, nullifierHash, externalNullifier, proof);

        emit ProofVerified(groupId, signal);

        _afterVerifyProof(groupId, signal, nullifierHash, externalNullifier, proof);
    }

    /**
     * @inheritdoc ISemaphore
     */
    function getVerifier(uint8 merkleTreeDepth) external override returns (IVerifier) {
        return _getVerifier(merkleTreeDepth);
    }
}
  