// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { SafeOwnableInternal } from "@solidstate/contracts/access/ownable/SafeOwnableInternal.sol";
import { IEtherServiceFacet } from "../interfaces/IEtherServiceFacet.sol";

/**
 * @title EtherServiceFacet 
 */
contract EtherServiceFacet is  IEtherServiceFacet, SafeOwnableInternal {   

    /**
     * @notice emitted when a ether is transfer
     * @param to: receiver of the ether
     * @param amount: the amount ether transferred
     */
    event EtherTransfered(address payable to,uint256 amount);  

    /**
     * @inheritdoc IEtherServiceFacet
     */
    function transferEther(
        address payable to,
        uint256 amount
    ) external override onlyOwner returns (bool, bytes memory) {
        require(to != address(0), "EtherServiceFacet: to adress is the zero address");
        require(amount > 0, "EtherServiceFacet: amount is zero");

        (bool success, bytes memory data)= to.call{value: amount}("");
        require(success, "EtherServiceFacet: failed to send Ether");

        emit EtherTransfered(to, amount);
        return (success, data);
    }

    /**
     * @inheritdoc IEtherServiceFacet
     */
    function etherServiceFacetVersion() external pure override returns (string memory) {
        return "0.1.0.alpha";
    }

    /**
     * @inheritdoc IEtherServiceFacet
     */
    function getEtherBalance() external view returns (uint) {
        return address(this).balance;
    }
}