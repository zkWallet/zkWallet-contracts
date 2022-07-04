// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IZkWalletDiamondBase} from "./IZkWalletDiamondBase.sol";
import { IWalletFactoryInternal } from "../../../wallet/factory/IWalletFactoryInternal.sol";
import { WalletFactoryStorage} from "../../../wallet/factory/WalletFactoryStorage.sol";

import { SimplicyDiamond } from "../../SimplicyDiamond.sol";

/**
 * @title zkWallet "Diamond" Base proxy reference implementation
 */
abstract contract ZkWalletDiamondBase is
    IZkWalletDiamondBase,
    SimplicyDiamond
{
    function __ZkWalletDiamondBase_init(address owner_) internal {
        __SimplicyDiamond_init(owner_);
    }
}
