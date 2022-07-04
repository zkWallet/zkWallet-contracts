// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;


/**
 * @title RecoveryFacet interface
 */
interface IEtherServiceFacet {
    /**
     * @notice moves `amount` of ether from the caller's account to `to`.
     * @param to: the payable address of the recipient.
     * @param amount: the amount of tokens to move.
     * @return returns a boolean value indicating whether the operation succeeded.
     */
    function transferEther(address payable to, uint256 amount) external returns (bool, bytes memory);

    /**
     * @notice return the current version of RecoveryFacet
     */
    function etherServiceFacetVersion() external pure returns (string memory);

    /**
     * @notice return the current balance of this contract
     */
    function getEtherBalance() external view returns (uint);
}