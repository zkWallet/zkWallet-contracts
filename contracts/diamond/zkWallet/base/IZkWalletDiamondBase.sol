//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { ISolidStateDiamond } from "@solidstate/contracts/proxy/diamond/ISolidStateDiamond.sol";
import { IZkWalletDiamondBaseInternal } from "./IZkWalletDiamondBaseInternal.sol";

/**
 * @title ZkWalletDiamondBase interface
 */
interface IZkWalletDiamondBase is IZkWalletDiamondBaseInternal, ISolidStateDiamond {}
