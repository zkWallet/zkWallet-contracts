import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, run } from "hardhat";
import {
  IGuardianFacet,
  ISemaphoreGroups,
  SimplicyWalletDiamond,
} from "@simplicy/typechain-types";
import { createIdentityCommitments } from "../utils";
import { describeBehaviorOfGuardian } from "@simplicy/spec";
import { BigNumber, Contract } from "ethers";
import { DeployedContract } from "../../types";

const groupId = 1;
const depth: Number = Number(process.env.TREE_DEPTH);
const zero: BigNumber = ethers.constants.Zero;
const members: bigint[] = createIdentityCommitments(3);

describe.only("GuardianFacet", function () {
  let owner: SignerWithAddress;
  let nonOwner: SignerWithAddress;
  let diamond: SimplicyWalletDiamond;
  let instance: any | IGuardianFacet;
  let semaphoreGroupsInstance: any | ISemaphoreGroups;
  let facetCuts: { target: string; action: number; selectors: any }[] = [];
  let facets: any | DeployedContract[];

  let guardians: BigNumber[] = [];
  guardians = [
    BigNumber.from(members[0]),
    BigNumber.from(members[1]),
    BigNumber.from(members[2]),
  ];

  before(async function () {
    [owner, nonOwner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    diamond = await run("deploy:diamond", {
      name: "SimplicyWalletDiamond",
      owner: owner.address,
      logs: false,
    });

    facets = await diamond.callStatic["facets()"]();

    expect(facets).to.have.lengthOf(1);

    const poseidonT3 = await run("deploy:poseidonT3", {
      logs: false,
    });

    facets = await run("deploy:facets-with-poseidon", {
      library: poseidonT3.address,
      facets: [{ name: "GuardianFacet" }, { name: "SemaphoreGroupsFacet" }],
      logs: false,
    });

    facetCuts = [
      {
        target: facets[0].address,
        action: 0,
        selectors: Object.keys(facets[0].contract.interface.functions).map(
          (fn) => facets[0].contract.interface.getSighash(fn)
        ),
      },
      {
        target: facets[1].address,
        action: 0,
        selectors: Object.keys(facets[1].contract.interface.functions).map(
          (fn) => facets[1].contract.interface.getSighash(fn)
        ),
      },
    ];

    //do the cut
    await diamond.diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

    facets = await run("deploy:facets", {
      facets: [{ name: "SemaphoreFacet" }, { name: "RecoveryFacet" }],
      logs: false,
    });

    facetCuts = [
      {
        target: facets[0].address,
        action: 0,
        selectors: Object.keys(facets[0].contract.interface.functions).map(
          (fn) => facets[0].contract.interface.getSighash(fn)
        ),
      },
      {
        target: facets[1].address,
        action: 0,
        selectors: Object.keys(facets[1].contract.interface.functions).map(
          (fn) => facets[1].contract.interface.getSighash(fn)
        ),
      },
    ];

    //do the cut
    await diamond.diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

    instance = await ethers.getContractAt("GuardianFacet", diamond.address);

    semaphoreGroupsInstance = await ethers.getContractAt(
      "SemaphoreGroupsFacet",
      diamond.address
    );
  });

  describe("::SimplicyWalletDiamond", function () {
    it("can call functions through diamond address", async function () {
      expect(await diamond.owner()).to.equal(owner.address);
      expect(await diamond.version()).to.equal("0.0.1");
      expect(await instance.guardianFacetVersion()).to.equal("0.0.1");
    });
  });
  describeBehaviorOfGuardian(async () => instance, {
    getOwner: async () => owner,
    getNonOwner: async () => nonOwner,
    getDepth: async () => depth,
    getZero: async () => zero,
    getMembers: async () => members,
    getGuardians: (includePendingAdditions: boolean) =>
      instance.getGuardians(includePendingAdditions),
    numGuardians: (includePendingAdditions: boolean) =>
      instance.numGuardians(includePendingAdditions),
    setInitialGuardians: (guardians: BigNumber[]) =>
      instance.setInitialGuardians(guardians),
    addGuardian: (hashId: BigNumber) => instance.addGuardian(hashId),
    removeGuardian: (hashId: BigNumber) => instance.removeGuardian(hashId),
    removeGuardians: (guardians: BigNumber[]) =>
      instance.removeGuardians(guardians),
    cancelPendingGuardians: () => instance.cancelPendingGuardians(),
  });
  describe("::GuardianFacet", function () {
    describe("#addGuardians(uint256,uint256)[])", function () {
      it("should emits events", async function () {
        await semaphoreGroupsInstance
          .connect(owner)
          ["createGroup(uint256,uint8,uint256,address)"](
            groupId,
            Number(depth),
            zero,
            owner.address
          );

        const transaction = await instance
          .connect(owner)
          ["addGuardians(uint256,uint256[])"](groupId, guardians);

        const receipt = await transaction.wait();
        for (let i = 0; i < members.length; i++) {
          const effectiveTime = await receipt.events[i].args.effectiveTime;
          await expect(transaction)
            .to.emit(instance, "GuardianAdded")
            .withArgs(members[i], effectiveTime);
        }

        for (let i = 3; i < receipt.events.length; i++) {
          const root = await receipt.events[i].args.root;
          await expect(transaction)
            .to.emit(instance, "MemberAdded")
            .withArgs(groupId, members[i - 3], root);
        }
      });
      describe("reverts if", function () {
        it("groupdId non exists", async function () {
          await expect(
            instance
              .connect(owner)
              ["addGuardians(uint256,uint256[])"](groupId, guardians)
          ).to.be.revertedWith("SemaphoreGroupsBase: GROUP_ID_NOT_EXIST");
        });
        it("non-owner", async function () {
          await expect(
            instance
              .connect(nonOwner)
              ["addGuardians(uint256,uint256[])"](groupId, guardians)
          ).to.be.revertedWith("Ownable: sender must be owner");
        });
      });
    });
  });
});
