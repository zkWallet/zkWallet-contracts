// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import "hardhat/console.sol";

import { OwnableStorage } from "@solidstate/contracts/access/ownable/Ownable.sol";
import { SolidStateDiamond} from "@solidstate/contracts/proxy/diamond/SolidStateDiamond.sol";
import { IERC173 } from "@solidstate/contracts/access/IERC173.sol";
import { ERC165, IERC165, ERC165Storage } from "@solidstate/contracts/introspection/ERC165.sol";
import { DiamondBaseStorage } from "@solidstate/contracts/proxy/diamond/base/DiamondBase.sol";
import { IDiamondWritable } from "@solidstate/contracts/proxy/diamond/writable/DiamondWritable.sol";

import { IZkWalletDiamondBase} from "./IZkWalletDiamondBase.sol";
import { IWalletFactoryInternal } from "../../../wallet/factory/IWalletFactoryInternal.sol";
import { GuardianInternal} from "../../../guardian/GuardianInternal.sol";
// // import { SemaphoreGroupsBaseInternal} from "../../../semaphore/base/SemaphoreGroupsBase/SemaphoreGroupsBaseInternal.sol";
// import { SemaphoreStorage } from "../../../semaphore/SemaphoreStorage.sol";

import { WalletFactoryStorage} from "../../../wallet/factory/WalletFactoryStorage.sol";
import { IERC20ServiceFacet } from "../../../interfaces/facets/token/ERC20/IERC20ServiceFacet.sol";
import { IERC20Service} from "../../../token/ERC20/IERC20Service.sol";
import { IERC721Facet } from "../../../interfaces/IERC721Facet.sol";
import { IERC721Service } from "../../../token/ERC721/IERC721Service.sol";
import { IGuardianFacet } from "../../../interfaces/IGuardianFacet.sol";
import { IGuardian } from "../../../guardian/IGuardian.sol";
import { IRecoveryFacet } from "../../../interfaces/IRecoveryFacet.sol";
import { IRecovery } from "../../../recovery/IRecovery.sol";
// import { ISemaphoreFacet } from "../../../interfaces/ISemaphoreFacet.sol";
// import { ISemaphore } from "../../../semaphore/ISemaphore.sol";
// import { ISemaphoreGroupsFacet } from "../../../interfaces/ISemaphoreGroupsFacet.sol";
// import { ISemaphoreGroups } from "../../../semaphore/ISemaphoreGroups.sol";
// import { ISemaphoreGroupsBase } from "../../../semaphore/base/SemaphoreGroupsBase/ISemaphoreGroupsBase.sol";

import { IVerifier } from "../../../interfaces/IVerifier.sol";

import { SimplicyDiamond } from "../../SimplicyDiamond.sol";

/**
 * @title zkWallet "Diamond" Base proxy reference implementation
 */
abstract contract ZkWalletDiamondBase is
    IZkWalletDiamondBase,
    SolidStateDiamond,
    GuardianInternal
{
    using DiamondBaseStorage for DiamondBaseStorage.Layout;
    using ERC165Storage for ERC165Storage.Layout;
    // using SemaphoreStorage for SemaphoreStorage.Layout;
    using OwnableStorage for OwnableStorage.Layout;

    function _initOwner(address owner_) internal {
        OwnableStorage.layout().setOwner(owner_);
    }

    function _initFacets(
        address owner_,
        WalletFactoryStorage.Facet[] memory facets_,
        IWalletFactoryInternal.VerifierDTO[] memory verifiers
    ) internal {
        // create default Semaphore group for Guardians Recovery
        // _createSemaphoreGroup(1, 20, 0, owner_);

        // add verifiers contracts to the Semaphore
        // _addVerifiers(verifiers);

        ERC165Storage.Layout storage erc165 = ERC165Storage.layout();

        FacetCut[] memory facetCuts = new FacetCut[](1);
        uint faceCutsLength;

        // register facets
         for (uint i = 0; i < facets_.length; i++) {
            string memory facetName = facets_[i].name;
            address facetAddress_ = facets_[i].facetAddress;
            //string memory facetVersion = facets_[i].version;

            if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("GuardianFacet"))) {
                bytes4[] memory guardianFacetSelectors = new bytes4[](10);

                // register GuardianFacet

                guardianFacetSelectors[0] = IGuardianFacet.guardianFacetVersion.selector;
                guardianFacetSelectors[1] = IGuardianFacet.addGuardians.selector;

                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                guardianFacetSelectors[2] = IGuardian.getGuardian.selector;
                guardianFacetSelectors[3] = IGuardian.getGuardians.selector;
                guardianFacetSelectors[4] = IGuardian.numGuardians.selector;
                guardianFacetSelectors[5] = IGuardian.requireMajority.selector;
                guardianFacetSelectors[6] = IGuardian.addGuardian.selector;
                guardianFacetSelectors[7] = IGuardian.removeGuardians.selector;
                guardianFacetSelectors[8] = IGuardian.removeGuardian.selector;
                guardianFacetSelectors[9] = IGuardian.cancelPendingGuardians.selector;

                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                // check faceCuts length
                faceCutsLength = facetCuts.length;

                 facetCuts[faceCutsLength + 1] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: guardianFacetSelectors
               });

           } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("RecoveryFacet"))) {
                bytes4[] memory recoveryFacetSelectors = new bytes4[](7);

                // register RecoveryFacet

                recoveryFacetSelectors[0] = IRecoveryFacet.recoveryFacetVersion.selector;

                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                recoveryFacetSelectors[1] = IRecovery.getMajority.selector;
                recoveryFacetSelectors[2] = IRecovery.getRecoveryStatus.selector;
                recoveryFacetSelectors[3] = IRecovery.getRecoveryNominee.selector;
                recoveryFacetSelectors[4] = IRecovery.getRecoveryCounter.selector;
                recoveryFacetSelectors[5] = IRecovery.recover.selector;
                recoveryFacetSelectors[6] = IRecovery.resetRecovery.selector;

                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                // check faceCuts length
                faceCutsLength = facetCuts.length;

                facetCuts[faceCutsLength + 1] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: recoveryFacetSelectors
               });

        //    } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("SemaphoreFacet"))) {
        //         bytes4[] memory semaphoreFacetSelectors = new bytes4[](2);

        //         // register SemaphoreFacet

        //         semaphoreFacetSelectors[0] = ISemaphoreFacet.semaphoreFacetVersion.selector;

        //         erc165.setSupportedInterface(type(IERC173).interfaceId, true);

        //         semaphoreFacetSelectors[1] = ISemaphore.verifyProof.selector;
   
        //         erc165.setSupportedInterface(type(IERC173).interfaceId, true);

        //         // check faceCuts length
        //         faceCutsLength = facetCuts.length;

        //         facetCuts[faceCutsLength + 1] = FacetCut({
        //             target: facetAddress_,
        //             action: IDiamondWritable.FacetCutAction.ADD,
        //             selectors: semaphoreFacetSelectors
        //        });

        //    } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("SemaphoreGroupFacet"))) {
        //         bytes4[] memory semaphoreGroupsFacetSelectors = new bytes4[](10);

        //         // register SemaphoreGroupsFacet

        //         semaphoreGroupsFacetSelectors[0] = ISemaphoreGroupsFacet.semaphoreGroupsFacetVersion.selector;

        //          erc165.setSupportedInterface(type(IERC173).interfaceId, true);

        //         semaphoreGroupsFacetSelectors[1] = ISemaphoreGroups.getRoot.selector;
        //         semaphoreGroupsFacetSelectors[2] = ISemaphoreGroups.getDepth.selector;
        //         semaphoreGroupsFacetSelectors[3] = ISemaphoreGroups.getNumberOfLeaves.selector;

        //         erc165.setSupportedInterface(type(IERC173).interfaceId, true);

        //         semaphoreGroupsFacetSelectors[4] = ISemaphoreGroupsBase.getGroupAdmin.selector;
        //         semaphoreGroupsFacetSelectors[5] = ISemaphoreGroupsBase.createGroup.selector;
        //         semaphoreGroupsFacetSelectors[6] = ISemaphoreGroupsBase.updateGroupAdmin.selector;
        //         semaphoreGroupsFacetSelectors[7] = ISemaphoreGroupsBase.addMembers.selector;
        //         semaphoreGroupsFacetSelectors[8] = ISemaphoreGroupsBase.removeMember.selector;
        //         semaphoreGroupsFacetSelectors[9] = ISemaphoreGroupsBase.addMember.selector;
   
        //         erc165.setSupportedInterface(type(IERC173).interfaceId, true);

        //         // check faceCuts length
        //         faceCutsLength = facetCuts.length;

        //         facetCuts[faceCutsLength + 1] = FacetCut({
        //             target: facetAddress_,
        //             action: IDiamondWritable.FacetCutAction.ADD,
        //             selectors: semaphoreGroupsFacetSelectors
        //        });

           } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("ERC20Facet"))) {
                bytes4[] memory erc20FacetSelectors = new bytes4[](8);

                // register ERC20Facet

                erc20FacetSelectors[0] = IERC20ServiceFacet.erc20ServiceFacetVersion.selector;

                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                erc20FacetSelectors[1] = IERC20Service.getAllTrackedERC20Tokens.selector;
                erc20FacetSelectors[2] = IERC20Service.balanceOfERC20.selector;
                erc20FacetSelectors[3] = IERC20Service.transferERC20.selector;
                erc20FacetSelectors[4] = IERC20Service.transferERC20From.selector;
                erc20FacetSelectors[5] = IERC20Service.approveERC20.selector;
                erc20FacetSelectors[6] = IERC20Service.registerERC20.selector;
                erc20FacetSelectors[7] = IERC20Service.removeERC20.selector;
                erc20FacetSelectors[8] = IERC20Service.depositERC20.selector;

                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                // check faceCuts length
                faceCutsLength = facetCuts.length;

                facetCuts[faceCutsLength + 1] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: erc20FacetSelectors
               });

           } else if (keccak256(abi.encodePacked(facetName)) == keccak256(abi.encodePacked("ERC721Facet"))) {
                bytes4[] memory erc721FacetSelectors = new bytes4[](8);

                // register ERC721Facet

                erc721FacetSelectors[0] = IERC721Facet.erc721FacetVersion.selector;
                erc721FacetSelectors[2] = IERC721Facet.onERC721Received.selector;
                erc721FacetSelectors[3] = IERC721Facet.safeTransferERC721From.selector;
               
                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                erc721FacetSelectors[4] = IERC721Service.getAllTrackedERC721Tokens.selector;
                erc721FacetSelectors[5] = IERC721Service.balanceOfERC721.selector;
                erc721FacetSelectors[6] = IERC721Service.ownerOfERC721.selector;
                erc721FacetSelectors[7] = IERC721Service.transferERC721.selector;
                erc721FacetSelectors[8] = IERC721Service.transferERC721From.selector;
                erc721FacetSelectors[9] = IERC721Service.approveERC721.selector;
                erc721FacetSelectors[10] = IERC721Service.registerERC721.selector;
                erc721FacetSelectors[11] = IERC721Service.removeERC721.selector;
                erc721FacetSelectors[12] = IERC721Service.depositERC721.selector;

                erc165.setSupportedInterface(type(IERC173).interfaceId, true);

                 // check faceCuts length
                faceCutsLength = facetCuts.length;

                facetCuts[faceCutsLength + 1] = FacetCut({
                    target: facetAddress_,
                    action: IDiamondWritable.FacetCutAction.ADD,
                    selectors: erc721FacetSelectors
               });
           }
       }

        // do the cuts
        DiamondBaseStorage.layout().diamondCut(facetCuts, address(0), "");
        console.log("ZkWalletDiamondBase _initFacets owner", owner_);
        OwnableStorage.layout().setOwner(owner_);
    }
   
    // /**
    //  * @notice cprivate function eates a new group by initializing the associated tree.
    //  * @param groupId: Id of the group.
    //  * @param depth: Depth of the tree.
    //  * @param zeroValue: Zero value of the tree.
    //  * @param admin: Admin of the group.
    //  *
    //  * Emits {GroupCreated} and {GroupAdminUpdated} events.
    //  */
    // function _createSemaphoreGroup(
    //     uint256 groupId,
    //     uint8 depth,
    //     uint256 zeroValue,
    //     address admin
    // ) private {
    //     _beforeCreateGroup(groupId, depth, zeroValue, admin);

    //     _createGroup(groupId, depth, zeroValue);

    //     _setGroupAdmin(groupId, admin);

    //     _afterCreateGroup(groupId, depth, zeroValue, admin);
    // }

    // function _addVerifiers(IWalletFactoryInternal.VerifierDTO[] memory verifiers) private {
    //     for (uint8 i = 0; i < verifiers.length; i++) {
    //         SemaphoreStorage.layout().verifiers[
    //             verifiers[i].merkleTreeDepth
    //         ] = IVerifier(verifiers[i].contractAddress);
    //     }
    // }
}
