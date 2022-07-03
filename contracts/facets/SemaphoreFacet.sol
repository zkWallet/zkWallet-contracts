// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { IVerifier } from "../interfaces/IVerifier.sol";
import { Semaphore } from "../semaphore/Semaphore.sol";
import { SemaphoreStorage } from "../semaphore/SemaphoreStorage.sol";


/**
 * @title SemaphoreFacet 
 */
contract SemaphoreFacet is Semaphore, OwnableInternal {
    using SemaphoreStorage for SemaphoreStorage.Layout;

    /**
     * @notice return the current version of SemaphoreFacet
     */
    function semaphoreFacetVersion() public pure returns (string memory) {
        return "0.1.0.alpha";
    }

    function setVerifiers(Verifier[] memory _verifiers) public onlyOwner {
        for (uint8 i = 0; i < _verifiers.length; i++) {
            SemaphoreStorage.layout().verifiers[
                _verifiers[i].merkleTreeDepth
            ] = IVerifier(_verifiers[i].contractAddress);
        }
    }
}
