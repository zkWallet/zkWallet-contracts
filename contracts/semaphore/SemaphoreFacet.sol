// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

import { IVerifier } from "../interfaces/IVerifier.sol";

import { Semaphore } from "./Semaphore.sol";
import { SemaphoreStorage } from "./SemaphoreStorage.sol";
import { ISemaphoreFacet } from "../interfaces/ISemaphoreFacet.sol";


/**
 * @title SemaphoreFacet 
 */
contract SemaphoreFacet is ISemaphoreFacet, Semaphore, OwnableInternal {
    using SemaphoreStorage for SemaphoreStorage.Layout;

    function setVerifiers(Verifier[] memory _verifiers) public onlyOwner {
        for (uint8 i = 0; i < _verifiers.length; i++) {
            SemaphoreStorage.layout().verifiers[
                _verifiers[i].merkleTreeDepth
            ] = IVerifier(_verifiers[i].contractAddress);
        }
    }

    /**
     * @notice return the current version of SemaphoreFacet
     */
    function semaphoreFacetVersion() external pure override returns (string memory) {
        return "0.1.0.alpha";
    }
}
