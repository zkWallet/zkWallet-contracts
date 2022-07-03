// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

import { IERC20ServiceFacet } from "../../../interfaces/facets/token/ERC20/IERC20ServiceFacet.sol";
import { ERC20Service } from "../../../token/ERC20/ERC20Service.sol";
import { ERC20ServiceStorage } from "../../../token/ERC20/ERC20ServiceStorage.sol";


/**
 * @title ERC20ServiceFacet 
 */
contract ERC20ServiceFacet is IERC20ServiceFacet, ERC20Service, OwnableInternal {
    using ERC20ServiceStorage for ERC20ServiceStorage.Layout;

    /**
     * @inheritdoc IERC20ServiceFacet
     */
    function erc20ServiceFacetVersion() public pure override returns (string memory) {
        return "0.1.0.alpha";
    }

    function _beforeTransferERC20(address token, address to, uint256 amount) 
        internal
        virtual 
        view 
        override 
        onlyOwner
    {
        super._beforeTransferERC20(token, to, amount);
    }

    function _beforeTransferERC20From(address token, address from, address to, uint256 amount) 
        internal 
        virtual 
        view 
        override 
        onlyOwner
    {
        super._beforeTransferERC20From(token, from, to, amount);
    }

    function _beforeApproveERC20(address token, address spender, uint256 amount) 
        internal 
        virtual 
        view 
        override 
        onlyOwner 
    {
        super._beforeApproveERC20(token, spender, amount);
    }

    function _beforeRegisterERC20(address tokenAddress) internal virtual view override onlyOwner {
        super._beforeRegisterERC20(tokenAddress);
    }

    function _beforeRemoveERC20(address tokenAddress) internal virtual view override onlyOwner {
        super._beforeRemoveERC20(tokenAddress);
    }

    function _beforedepositERC20(address tokenAddress, uint256 amount)
        internal
        virtual
        view 
        override
        onlyOwner
    {
        super._beforedepositERC20(tokenAddress, amount);
    }
}