// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IERC721Service } from "../token/ERC721/IERC721Service.sol";


/**
 * @title ERC721ServiceFacet interface
 */
interface IERC721ServiceFacet is IERC721Service {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) external returns (bytes4);

    /**
     * @notice return the current version of ERC721Facet
     */
    function erc721ServiceFacetVersion() external pure returns (string memory);

}