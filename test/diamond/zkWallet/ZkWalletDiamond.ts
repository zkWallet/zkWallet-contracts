import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { describeBehaviorOfSolidStateDiamond } from "@solidstate/spec";
// import { describeBehaviorOfZkWalletDiamond } from "@simplicy/spec";
import {
  IZkWalletDiamond,
  WalletFactoryFacet,
} from "@simplicy/typechain-types";
import { expect } from "chai";
import { ethers, run } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { DeployedContract, Verifier } from "../../../types";
import { createIdentityCommitments } from "../../utils";

const zero: BigNumber = ethers.constants.Zero;
const members: bigint[] = createIdentityCommitments(3);

describe("ZkWalletDiamond", function () {
  let owner: SignerWithAddress;
  let getNomineeOwner: SignerWithAddress;
  let getNonOwner: SignerWithAddress;

  let facets: DeployedContract[] | any;
  let zkWalletFacets: DeployedContract[] | any;
  let zkWalletFacetsWithPoseidon: DeployedContract[] | any;

  let facetCuts: { target: string; action: number; selectors: any }[] = [];
  let diamond: IZkWalletDiamond;
  let walletFactoryFacetInstance: Contract | WalletFactoryFacet;
  let verifiers: Contract[];

  before(async function () {
    [owner, getNomineeOwner, getNonOwner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const poseidonT3: Contract = await run("deploy:poseidonT3", {
      logs: false,
    });

    diamond = await run("deploy:diamond-with-poseidon", {
      name: "ZkWalletDiamond",
      library: poseidonT3.address,
      logs: false,
    });

    const facets = await diamond.callStatic["facets()"]();

    expect(facets).to.have.lengthOf(1);

    facetCuts[0] = {
      target: diamond.address,
      action: 0,
      selectors: facets[0].selectors,
    };

    // facets = await run("deploy:facets", {
    //   facets: [{ name: "WalletFactoryFacet" }],
    //   logs: true,
    // });

    // facetCuts = [
    //   {
    //     target: facets[0].address,
    //     action: 0,
    //     selectors: Object.keys(facets[0].contract.interface.functions).map(
    //       (fn) => facets[0].contract.interface.getSighash(fn)
    //     ),
    //   },
    // ];

    // //do the cut
    // await diamond.diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

    // walletFactoryFacetInstance = await ethers.getContractAt(
    //   "WalletFactoryFacet",
    //   diamond.address
    // );

    // zkWalletFacetsWithPoseidon = await run("deploy:facets-with-poseidon", {
    //   library: poseidonT3.address,
    //   facets: [{ name: "GuardianFacet" }, { name: "SemaphoreGroupsFacet" }],
    //   logs: true,
    // });

    // zkWalletFacets = await run("deploy:facets", {
    //   facets: [
    //     { name: "ERC20Facet" },
    //     { name: "ERC721Facet" },
    //     { name: "RecoveryFacet" },
    //     { name: "SemaphoreFacet" },
    //     { name: "SemaphoreVotingFacet" },
    //   ],
    //   logs: true,
    // });
  });

  // describeBehaviorOfZkWalletDiamond(async () => diamond, {
  //   getOwner: async () => owner,
  // });

  describeBehaviorOfSolidStateDiamond(
    async () => diamond,
    {
      getOwner: async () => owner,
      getNomineeOwner: async () => getNomineeOwner,
      getNonOwner: async () => getNonOwner,
      facetFunction: "",
      facetFunctionArgs: [],
      facetCuts,
      fallbackAddress: ethers.constants.AddressZero,
    },
    ["fallback()"]
  );
});
