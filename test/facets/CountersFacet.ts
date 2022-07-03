// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { describeBehaviorOfCounters } from "@simplicy/spec";
// import { ethers, run } from "hardhat";
// import { BigNumber } from "ethers";
// import { ICounters, WalletFactoryDiamond } from "@simplicy/typechain-types";
// import { expect } from "chai";
// import { DeployedContract } from "../../types";

// describe.only("CountersFacet", function () {
//   let owner: SignerWithAddress;
//   let nonOwner: SignerWithAddress;
//   let diamond: WalletFactoryDiamond;
//   let facets: DeployedContract[];
//   let facetCuts: { target: string; action: number; selectors: any }[] = [];

//   let instance: any | ICounters;
//   let firstIndex: BigNumber;

//   before(async function () {
//     [owner, nonOwner] = await ethers.getSigners();
//     firstIndex = ethers.constants.One;
//   });

//   beforeEach(async function () {
//     diamond = await run("deploy:diamond", {
//       name: "WalletFactoryDiamond",
//       logs: false,
//     });

//     facets = await run("deploy:facets", {
//       facets: [{ name: "CountersFacet" }],
//       logs: false,
//     });

//     facetCuts = [
//       {
//         target: facets[0].address,
//         action: 0,
//         selectors: Object.keys(facets[0].contract.interface.functions).map(
//           (fn) => facets[0].contract.interface.getSighash(fn)
//         ),
//       },
//     ];
//     //do the cut
//     await diamond.diamondCut(facetCuts, ethers.constants.AddressZero, "0x");
//     instance = await ethers.getContractAt("CountersFacet", diamond.address);
//   });
//   describe("::SimplicyWalletDiamond", function () {
//     it("can call functions through diamond address", async function () {
//       expect(await diamond.owner()).to.equal(owner.address);
//       expect(await diamond.version()).to.equal("0.0.1");
//       expect(await instance.countersVersion()).to.equal("0.0.1");
//     });
//   });
//   describeBehaviorOfCounters(async () => instance, {
//     getFirstIndex: async () => firstIndex,
//     current: (index: BigNumber) => instance.current(index),
//     increment: (index: BigNumber) => instance.increment(index),
//     decrement: (index: BigNumber) => instance.decrement(index),
//     reset: (index: BigNumber) => instance.reset(index),
//   });
//   describe("#increment(uint256)", function () {
//     describe("reverts if", function () {
//       it("non owner", async function () {
//         await expect(
//           instance.connect(nonOwner)["increment(uint256)"](firstIndex)
//         ).to.be.revertedWith("Ownable: sender must be owner");
//       });
//     });
//   });
//   describe("#decrement(uint256)", function () {
//     describe("reverts if", function () {
//       it("non owner", async function () {
//         await expect(
//           instance.connect(nonOwner)["decrement(uint256)"](firstIndex)
//         ).to.be.revertedWith("Ownable: sender must be owner");
//       });
//     });
//   });
//   describe("#reset(uint256)", function () {
//     describe("reverts if", function () {
//       it("non owner", async function () {
//         await expect(
//           instance.connect(nonOwner)["reset(uint256)"](firstIndex)
//         ).to.be.revertedWith("Ownable: sender must be owner");
//       });
//     });
//   });
// });
