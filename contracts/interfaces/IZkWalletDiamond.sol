// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IZkWalletDiamondBase } from "../diamond/zkWallet/base/IZkWalletDiamondBase.sol";
import { WalletFactoryStorage } from "../wallet/factory/WalletFactoryStorage.sol";
import { IWalletFactoryInternal } from "../wallet/factory/IWalletFactoryInternal.sol";


/**
 * @title ZkWalletDiamond  interface
 */
interface IZkWalletDiamond is IZkWalletDiamondBase  { 
    function version() external view returns (string memory);
}

