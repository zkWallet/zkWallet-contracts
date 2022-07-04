// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { IERC721Receiver } from "@solidstate/contracts/token/ERC721/IERC721Receiver.sol";

import { ERC721Service } from "./ERC721Service.sol";
import { ERC721ServiceStorage } from "./ERC721ServiceStorage.sol";
import { IERC721ServiceFacet } from "../../interfaces/IERC721ServiceFacet.sol";

/**
 * @title ERC721ServiceFacet 
 */
contract ERC721ServiceFacet is IERC721ServiceFacet, ERC721Service, IERC721Receiver, OwnableInternal {
    using ERC721ServiceStorage for ERC721ServiceStorage.Layout;
    using ERC721ServiceStorage for ERC721ServiceStorage.Error;

    event Received(address operator, address from, uint256 tokenId, bytes data, uint256 gas);

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) 
        public 
        override(IERC721ServiceFacet, IERC721Receiver)
        returns (bytes4) {
        
        emit Received(operator, from, tokenId, data, gasleft());
        return this.onERC721Received.selector;
    }

    /**
     * @notice return the current version of ERC721Facet
     */
    function erc721ServiceFacetVersion() external pure returns (string memory) {
        return "0.1.0.alpha";
    }

    function _beforeTransferERC721(address token, address to, uint256 tokenId) 
        internal
        virtual
        view 
        override 
        onlyOwner
    {
        super._beforeTransferERC721(token, to, tokenId);
    }

    function _beforeApproveERC721(address token, address spender, uint256 tokenId) 
        internal
        virtual
        view 
        override
        onlyOwner
    {
        super._beforeApproveERC721(token, spender, tokenId);
    }

    function _beforeRegisterERC721(address tokenAddress) internal virtual view override onlyOwner {
        super._beforeRegisterERC721(tokenAddress);
    }

    function _beforeRemoveERC721(address tokenAddress) internal virtual view override onlyOwner {
        super._beforeRemoveERC721(tokenAddress);
    }

    function _beforedepositERC721(address tokenAddress, uint256 tokenId) 
        internal
        virtual
        view 
        override 
        onlyOwner 
    {
        super._beforedepositERC721(tokenAddress, tokenId);
    }
}