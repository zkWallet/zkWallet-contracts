// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import { IERC173 } from "@solidstate/contracts/access/IERC173.sol";
import { ERC165, IERC165, ERC165Storage } from "@solidstate/contracts/introspection/ERC165.sol";
import { DiamondBaseStorage } from "@solidstate/contracts/proxy/diamond/base/DiamondBase.sol";
import { IDiamondWritable } from "@solidstate/contracts/proxy/diamond/writable/DiamondWritable.sol";

import { IGuardianFacet } from "../../interfaces/IGuardianFacet.sol";
import { IGuardian } from "../../guardian/IGuardian.sol";

import { ISemaphoreGroupsFacet } from "../../interfaces/ISemaphoreGroupsFacet.sol";
import { ISemaphoreGroups } from "../../semaphore/ISemaphoreGroups.sol";
import { ISemaphoreGroupsBase } from "../../semaphore/base/SemaphoreGroupsBase/ISemaphoreGroupsBase.sol";

import { IERC20ServiceFacet } from "../../interfaces/IERC20ServiceFacet.sol";
import { IERC20Service} from "../../token/ERC20/IERC20Service.sol";

import { IERC721ServiceFacetSelector } from "../../interfaces/IERC721ServiceFacetSelector.sol";
import { IERC721Service } from "../../token/ERC721/IERC721Service.sol";

import { IRecoveryFacet } from "../../interfaces/IRecoveryFacet.sol";
import { IRecovery } from "../../recovery/IRecovery.sol";

import { ISemaphoreFacet } from "../../interfaces/ISemaphoreFacet.sol";
import { ISemaphore } from "../../semaphore/ISemaphore.sol";

import { IEtherServiceFacet } from "../../interfaces/IEtherServiceFacet.sol";

import { IZkWalletDiamond } from "../../interfaces/IZkWalletDiamond.sol";
import { IWalletFactoryInternal } from "../../wallet/factory/IWalletFactoryInternal.sol";
import { ZkWalletDiamondBase } from "./base/ZkWalletDiamondBase.sol";
import { WalletFactoryStorage } from "../../wallet/factory/WalletFactoryStorage.sol";
import { IVerifier } from "../../interfaces/IVerifier.sol";

import { SemaphoreStorage } from "../../semaphore/SemaphoreStorage.sol";
/**
 * @title ZkWalletDiamond 
 */
contract ZkWalletDiamond is IZkWalletDiamond, ZkWalletDiamondBase {
    using SemaphoreStorage for SemaphoreStorage.Layout;
    using DiamondBaseStorage for DiamondBaseStorage.Layout;
    using ERC165Storage for ERC165Storage.Layout;
    // using OwnableStorage for OwnableStorage.Layout;

    constructor(
        address owner_,
        WalletFactoryStorage.Facet[] memory facets_, 
        IWalletFactoryInternal.VerifierDTO[] memory _verifiers
    ) {
        require(owner_ != address(0), "ZkWalletDiamond: owner is the zero address");        
        
        __ZkWalletDiamondBase_init(owner_);
        _setVerifiers(_verifiers);
        _addFacets(facets_);        
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

    function _addFacets(WalletFactoryStorage.Facet[] memory facets_)
        private
    {
        // register facets
        for (uint i = 0; i < facets_.length; i++) {
            string memory facetName = facets_[i].name;
            address facetAddress_ = facets_[i].facetAddress;

            if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("GuardianFacet"))) {
                FacetCut[] memory facetCuts = new FacetCut[](1);
                bytes4[] memory guardianFacetSelectors = new bytes4[](10);

                guardianFacetSelectors[0] = IGuardianFacet.guardianFacetVersion.selector;
                guardianFacetSelectors[1] = IGuardianFacet.addGuardians.selector;
                guardianFacetSelectors[2] = IGuardianFacet.addGuardian.selector;
                guardianFacetSelectors[3] = IGuardianFacet.removeGuardian.selector;
                guardianFacetSelectors[4] = IGuardian.getGuardian.selector;
                guardianFacetSelectors[5] = IGuardian.getGuardians.selector;
                guardianFacetSelectors[6] = IGuardian.numGuardians.selector;
                guardianFacetSelectors[7] = IGuardian.requireMajority.selector;                
                guardianFacetSelectors[8] = IGuardian.removeGuardians.selector;
                guardianFacetSelectors[9] = IGuardian.cancelPendingGuardians.selector;

                facetCuts[0] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: guardianFacetSelectors
                });
                DiamondBaseStorage.layout().diamondCut(facetCuts, address(0), "");
            } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("SemaphoreGroupsFacet"))) {
                FacetCut[] memory facetCuts = new FacetCut[](1);
                bytes4[] memory semaphoreGroupsFacetSelectors = new bytes4[](10);

                semaphoreGroupsFacetSelectors[0] = ISemaphoreGroupsFacet.semaphoreGroupsFacetVersion.selector;
                semaphoreGroupsFacetSelectors[1] = ISemaphoreGroups.getRoot.selector;
                semaphoreGroupsFacetSelectors[2] = ISemaphoreGroups.getDepth.selector;
                semaphoreGroupsFacetSelectors[3] = ISemaphoreGroups.getNumberOfLeaves.selector;
                semaphoreGroupsFacetSelectors[4] = ISemaphoreGroupsBase.getGroupAdmin.selector;
                semaphoreGroupsFacetSelectors[5] = ISemaphoreGroupsBase.createGroup.selector;
                semaphoreGroupsFacetSelectors[6] = ISemaphoreGroupsBase.updateGroupAdmin.selector;
                semaphoreGroupsFacetSelectors[7] = ISemaphoreGroupsBase.addMembers.selector;
                semaphoreGroupsFacetSelectors[8] = ISemaphoreGroupsBase.removeMember.selector;
                semaphoreGroupsFacetSelectors[9] = ISemaphoreGroupsBase.addMember.selector;

                facetCuts[0] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: semaphoreGroupsFacetSelectors
                });
                DiamondBaseStorage.layout().diamondCut(facetCuts, address(0), "");
            } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("RecoveryFacet"))) {
                FacetCut[] memory facetCuts = new FacetCut[](1);
                bytes4[] memory recoveryFacetSelectors = new bytes4[](7);
                recoveryFacetSelectors[0] = IRecoveryFacet.recoveryFacetVersion.selector;
                recoveryFacetSelectors[1] = IRecovery.getMajority.selector;
                recoveryFacetSelectors[2] = IRecovery.getRecoveryStatus.selector;
                recoveryFacetSelectors[3] = IRecovery.getRecoveryNominee.selector;
                recoveryFacetSelectors[4] = IRecovery.getRecoveryCounter.selector;
                recoveryFacetSelectors[5] = IRecovery.recover.selector;
                recoveryFacetSelectors[6] = IRecovery.resetRecovery.selector;

                facetCuts[0] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: recoveryFacetSelectors
                });
                DiamondBaseStorage.layout().diamondCut(facetCuts, address(0), "");
            } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("ERC20ServiceFacet"))) {
                FacetCut[] memory facetCuts = new FacetCut[](1);
                bytes4[] memory erc20FacetSelectors = new bytes4[](9);

                erc20FacetSelectors[0] = IERC20ServiceFacet.erc20ServiceFacetVersion.selector;
                erc20FacetSelectors[1] = IERC20Service.getAllTrackedERC20Tokens.selector;
                erc20FacetSelectors[2] = IERC20Service.balanceOfERC20.selector;
                erc20FacetSelectors[3] = IERC20Service.transferERC20.selector;
                erc20FacetSelectors[4] = IERC20Service.transferERC20From.selector;
                erc20FacetSelectors[5] = IERC20Service.approveERC20.selector;
                erc20FacetSelectors[6] = IERC20Service.registerERC20.selector;
                erc20FacetSelectors[7] = IERC20Service.removeERC20.selector;
                erc20FacetSelectors[8] = IERC20Service.depositERC20.selector;

                facetCuts[0] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: erc20FacetSelectors
                });
                DiamondBaseStorage.layout().diamondCut(facetCuts, address(0), "");
            } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("ERC721ServiceFacet"))) {
                FacetCut[] memory facetCuts = new FacetCut[](1);
                bytes4[] memory erc721FacetSelectors = new bytes4[](12);

                erc721FacetSelectors[0] = IERC721ServiceFacetSelector.erc721ServiceFacetVersion.selector;
                erc721FacetSelectors[1] = IERC721ServiceFacetSelector.onERC721Received.selector;
                erc721FacetSelectors[2] = IERC721ServiceFacetSelector.safeTransferERC721From.selector;
                erc721FacetSelectors[3] = IERC721Service.getAllTrackedERC721Tokens.selector;
                erc721FacetSelectors[4] = IERC721Service.balanceOfERC721.selector;
                erc721FacetSelectors[5] = IERC721Service.ownerOfERC721.selector;
                erc721FacetSelectors[6] = IERC721Service.transferERC721.selector;
                erc721FacetSelectors[7] = IERC721Service.transferERC721From.selector;
                erc721FacetSelectors[8] = IERC721Service.approveERC721.selector;
                erc721FacetSelectors[9] = IERC721Service.registerERC721.selector;
                erc721FacetSelectors[10] = IERC721Service.removeERC721.selector;
                erc721FacetSelectors[11] = IERC721Service.depositERC721.selector;

                facetCuts[0] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: erc721FacetSelectors
                });
                DiamondBaseStorage.layout().diamondCut(facetCuts, address(0), "");
            } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("EtherServiceFacet"))) {
                FacetCut[] memory facetCuts = new FacetCut[](1);
                bytes4[] memory ethersFacetSelectors = new bytes4[](3);

                ethersFacetSelectors[0] = IEtherServiceFacet.transferEther.selector;
                ethersFacetSelectors[1] = IEtherServiceFacet.etherServiceFacetVersion.selector;
                ethersFacetSelectors[2] = IEtherServiceFacet.getEtherBalance.selector;

                facetCuts[0] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: ethersFacetSelectors
                });
                DiamondBaseStorage.layout().diamondCut(facetCuts, address(0), "");
            }

        }
    }

    function _setVerifiers(IWalletFactoryInternal.VerifierDTO[] memory _verifiers) private {
        for (uint8 i = 0; i < _verifiers.length; i++) {
            SemaphoreStorage.layout().verifiers[
                _verifiers[i].merkleTreeDepth
            ] = IVerifier(_verifiers[i].contractAddress);
        }
    }
}

