// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import {ISemaphore} from "../semaphore/ISemaphore.sol";

interface ISemaphoreFacet is ISemaphore {
    /**
     * @notice return the current version of SemaphoreFacet
     */
    function semaphoreFacetVersion() external pure returns (string memory);

    /**
     * @notice add Verifiers contracts to the SemaphoreFacet
     * @param _verifiers array of Verifier contracts
     */
    function setVerifiers(Verifier[] memory _verifiers) external;
}
