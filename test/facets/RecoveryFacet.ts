import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { describeBehaviorOfRecovery } from "@simplicy/spec";
import {
  IGuardian,
  ISemaphore,
  ISemaphoreGroups,
  RecoveryFacet,
  SimplicyWalletDiamond,
} from "@simplicy/typechain-types";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers, run } from "hardhat";
import { createIdentityCommitments } from "../utils";

const groupId: BigNumber = ethers.constants.One;
const depth: Number = Number(process.env.TREE_DEPTH);
const zero: BigNumber = ethers.constants.Zero;
const members: bigint[] = createIdentityCommitments(3);

type DeployedContract = {
  name: string;
  contract: Contract;
  address: string;
};

type GuardianDTO = {
  hashId: BigNumber;
};

type Verifier = {
  contractAddress: string;
  merkleTreeDepth: Number;
};

describe.only("RecoveryFacet", function () {
  let owner: SignerWithAddress;
  let nonOwner: SignerWithAddress;
  let nominee: SignerWithAddress;
  let groupAdmin: SignerWithAddress;
  let diamond: Contract | SimplicyWalletDiamond;
  let instance: any | RecoveryFacet;
  let verifierAddress: string;

  let facetCuts: { target: string; action: number; selectors: any }[] = [];
  let facets: DeployedContract[];
  let anotherFacets: DeployedContract[];
  let guardianInstance: any | IGuardian;
  let semaphoreInstance: any | ISemaphore;
  let semaphoreGroupsInstance: any | ISemaphoreGroups;

  let guardians: GuardianDTO[] = [];
  guardians = [
    { hashId: BigNumber.from(members[0]) },
    { hashId: BigNumber.from(members[1]) },
    { hashId: BigNumber.from(members[2]) },
  ];

  before(async function () {
    [owner, nonOwner, nominee, groupAdmin] = await ethers.getSigners();
  });

  beforeEach(async function () {
    diamond = await run("deploy:diamond", {
      name: "SimplicyWalletDiamond",
      owner: owner.address,
      logs: false,
    });

    facets = await diamond.callStatic["facets()"]();

    expect(facets).to.have.lengthOf(1);

    this.verifier = await run("deploy:verifier", {
      logs: false,
    });

    verifierAddress = this.verifier.address;

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

    instance = await ethers.getContractAt("RecoveryFacet", diamond.address);

    guardianInstance = await ethers.getContractAt(
      "GuardianFacet",
      diamond.address
    );

    semaphoreInstance = await ethers.getContractAt(
      "SemaphoreFacet",
      diamond.address
    );

    semaphoreGroupsInstance = await ethers.getContractAt(
      "SemaphoreGroupsFacet",
      diamond.address
    );
  });

  describe("::SimplicyWalletDiamond", function () {
    it("can call functions through diamond address", async function () {
      expect(await diamond.owner()).to.equal(owner.address);
      expect(await diamond.version()).to.equal("0.0.1");
      expect(await instance.recoveryFacetVersion()).to.equal("0.0.1");
      expect(await semaphoreInstance.semaphoreFacetVersion()).to.equal("0.0.1");
      expect(
        await semaphoreGroupsInstance.semaphoreGroupsFacetVersion()
      ).to.equal("0.0.1");
    });
  });
  describe("::RecoveryFacet", function () {
    beforeEach(async function () {
      const verifiers: Verifier[] = [
        { merkleTreeDepth: depth, contractAddress: verifierAddress },
      ];
      await semaphoreInstance.setVerifiers(verifiers);

      await expect(
        await semaphoreGroupsInstance
          .connect(owner)
          ["createGroup(uint256,uint8,uint256,address)"](
            groupId,
            Number(depth),
            zero,
            groupAdmin.address
          )
      )
        .to.emit(semaphoreGroupsInstance, "GroupCreated")
        .withArgs(groupId, depth, zero);

      const transaction = await guardianInstance
        .connect(owner)
        .addGuardians(groupId, members, guardians);

      const receipt = await transaction.wait();

      for (let i = 0; i < members.length; i++) {
        const effectiveTime = await receipt.events[i].args.effectiveTime;
        await expect(transaction)
          .to.emit(guardianInstance, "GuardianAdded")
          .withArgs(members[i], effectiveTime);
      }

      for (let i = 3; i < receipt.events.length; i++) {
        const root = await receipt.events[i].args.root;
        await expect(transaction)
          .to.emit(guardianInstance, "MemberAdded")
          .withArgs(groupId, members[i - 3], root);
      }
    });
    describeBehaviorOfRecovery(async () => instance, {
      getOwner: async () => owner,
      getNominee: async () => nominee,
      getGroupId: async () => groupId,
      getDepth: async () => depth,
      getMembers: async () => members,
      getRecoveryStatus: () => instance.getRecoveryStatus(),
      getMajority: () => instance.getMajority(),
      getRecoveryNominee: () => instance.getRecoveryNominee(),
      getRecoveryCounter: () => instance.getRecoveryCounter(),
      recover: (
        groupId: BigNumber,
        signal: string,
        nullifierHash: BigNumber,
        externalNullifier: BigNumber,
        proof: BigNumber[],
        newOwner: string
      ) =>
        instance.recover(
          groupId,
          signal,
          nullifierHash,
          externalNullifier,
          proof,
          newOwner
        ),
      resetRecovery: () => instance.resetRecovery(),
    });
  });
  describe("#resetRecovery()", function () {
    describe("reverts if", function () {
      it("non owner", async function () {
        await expect(
          instance.connect(nonOwner)["resetRecovery()"]()
        ).to.be.revertedWith("Ownable: sender must be owner");
      });
    });
  });
});
