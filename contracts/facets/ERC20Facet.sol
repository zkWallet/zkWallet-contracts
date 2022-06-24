// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import {OwnableInternal} from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

import {ERC20Service} from "../token/ERC20/ERC20Service.sol";
import {ERC20ServiceStorage} from "../token/ERC20/ERC20ServiceStorage.sol";

contract ERC20Facet is ERC20Service, OwnableInternal {
    using ERC20ServiceStorage for ERC20ServiceStorage.Layout;

    /**
     * @notice return the current version of ERC20Facet
     */
    function erc20FacetVersion() public pure returns (string memory) {
        return "0.0.1";
    }

    function _beforeTransferERC20(address token, address to, uint256 amount) internal virtual view override onlyOwner {
        super._beforeTransferERC20(token, to, amount);
    }

    function _beforeTransferERC20From(address token, address from, address to, uint256 amount) internal virtual view override onlyOwner {
        super._beforeTransferERC20From(token, from, to, amount);
    }

    function _beforeApproveERC20(address token, address spender, uint256 amount) internal virtual view override onlyOwner {
        super._beforeApproveERC20(token, spender, amount);
    }

    function _beforeRegisterERC20(address tokenAddress) internal virtual view override onlyOwner {
        super._beforeRegisterERC20(tokenAddress);
    }

    function _beforeRemoveERC20(address tokenAddress) internal virtual view override onlyOwner {
        super._beforeRemoveERC20(tokenAddress);
    }
}