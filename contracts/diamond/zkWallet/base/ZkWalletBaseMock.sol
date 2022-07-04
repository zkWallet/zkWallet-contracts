// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import { IZkWalletDiamond } from "../../../interfaces/IZkWalletDiamond.sol";
import {ZkWalletDiamondBase} from "./ZkWalletDiamondBase.sol";
import { IWalletFactoryInternal } from "../../../wallet/factory/IWalletFactoryInternal.sol";
import { WalletFactoryStorage } from "../../../wallet/factory/WalletFactoryStorage.sol";
import { IVerifier } from "../../../interfaces/IVerifier.sol";

import { SemaphoreStorage } from "../../../semaphore/SemaphoreStorage.sol";


contract ZkWalletBaseMock is IZkWalletDiamond, ZkWalletDiamondBase {
    using SemaphoreStorage for SemaphoreStorage.Layout;

    constructor(address owner_, WalletFactoryStorage.Facet[] memory facets_, IWalletFactoryInternal.VerifierDTO[] memory _verifiers) {
        require(owner_ != address(0), "ZkWalletDiamond: owner is the zero address");        
        
        __ZkWalletDiamondBase_init(owner_);
        _setVerifiers(_verifiers);
    }

     /**
     * @notice return the current version of the diamond
     */
    function version()
        public
        pure
        override(IZkWalletDiamond)
        returns (string memory)
    {
        return "0.1.0.alpha";
    }

    function _setVerifiers(IWalletFactoryInternal.VerifierDTO[] memory _verifiers) private {
        for (uint8 i = 0; i < _verifiers.length; i++) {
            SemaphoreStorage.layout().verifiers[
                _verifiers[i].merkleTreeDepth
            ] = IVerifier(_verifiers[i].contractAddress);
        }
    }
}

