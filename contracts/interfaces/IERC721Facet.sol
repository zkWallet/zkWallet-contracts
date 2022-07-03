// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IERC721Service } from "../token/ERC721/IERC721Service.sol";
interface IERC721Facet is IERC721Service {
    /**
     * @notice return the current version of ERC721Facet
     */
    function erc721FacetVersion() external pure returns (string memory);

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) external returns (bytes4);

     /**
     * @notice transfer token between given addresses, checking for ERC721Receiver implementation if applicable
     * @param token: the address of tracked token to move
     * @param from sender of token
     * @param to receiver of token
     * @param tokenId token id
     * @param data data payload
     */
    function safeTransferERC721From(
        address token,
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external override;
}