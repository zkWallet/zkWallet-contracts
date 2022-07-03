// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { SolidStateERC20 } from "@solidstate/contracts/token/ERC20/SolidStateERC20.sol";
import { ERC20MetadataStorage } from "@solidstate/contracts/token/ERC20/metadata/ERC20MetadataStorage.sol";

import { IERC20Facet } from "../../../interfaces/facets/token/ERC20/IERC20Facet.sol";


/**
 * @title ERC20Facet 
 */
contract ERC20Facet is IERC20Facet, SolidStateERC20, OwnableInternal {
    using ERC20MetadataStorage for ERC20MetadataStorage.Layout;

    function eRC20FacetInit(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 supply
    ) external onlyOwner {
        ERC20MetadataStorage.Layout storage s = ERC20MetadataStorage.layout();

        s.setName(name_);
        s.setSymbol(symbol_);
        s.setDecimals(decimals_);

        _mint(msg.sender, supply);
    }

    /**
     * @inheritdoc IERC20Facet
     */
    function burn(uint256 amount) external override {
        _burn(msg.sender, amount);
    }

    /**
     * @inheritdoc IERC20Facet
     */
    function erc20FacetVersion() public pure override returns (string memory) {
        return "0.1.0.alpha";
    }
}
