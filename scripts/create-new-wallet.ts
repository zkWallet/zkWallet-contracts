import fs from "fs";
import { BigNumber, Contract } from "ethers";
import { hardhatArguments, ethers, network } from "hardhat";
import {
  IGuardianFacet,
  ISemaphore,
  ISemaphoreGroups,
  SimplicyWalletDiamond,
  WalletFactoryFacet,
} from "@simplicy/typechain-types";
import { DeployedContract, Verifier } from "../types";

async function main() {
  let factoryAddress: string;
  let walletFactoryFacetAddress: string;
  let verifier20Address: string;
  let zkWalletDiamondAddress: string;
  let poseidonT3Address: string;
  let guardianFacetAddress: string;
  let eRC20FacetAddress: string;
  let eRC721FacetAddress: string;
  let recoveryFacetAddress: string;
  let semaphoreFacetAddress: string;
  let semaphoreGroupsFacetAddress: string;
  let semaphoreVotingFacetAddress: string;

  let walletFactoryFacetInstance: Contract | WalletFactoryFacet;
  let guardianInstance: Contract | IGuardianFacet;
  let semaphoreInstance: Contract | ISemaphore;
  let semaphoreGroupsInstance: Contract | ISemaphoreGroups;

  let alice, bob, diamond: SimplicyWalletDiamond;

  let facets: DeployedContract[];
  let facetCuts: { target: string; action: number; selectors: any }[] = [];

  // const identityCommitments: string[] = [
  //   "417120863369177508448587683482618072152507466439565022803025664957553068359",
  //   "2406831775386746519644490267981058842396908979429908114658351987980684638639",
  //   "15064152082777430876487719843144077929032170478230727111576035711043722732420",
  // ];

  const identityCommitments: BigNumber[] = [
    BigNumber.from(
      BigInt(
        "417120863369177508448587683482618072152507466439565022803025664957553068359"
      )
    ),
    BigNumber.from(
      BigInt(
        "2406831775386746519644490267981058842396908979429908114658351987980684638639"
      )
    ),
    BigNumber.from(
      BigInt(
        "15064152082777430876487719843144077929032170478230727111576035711043722732420"
      )
    ),
  ];

  const depth = Number(process.env.TREE_DEPTH);
  const groupId: number = 1;

  const [deployer, aliceWallet, bobWallet] = await ethers.getSigners();

  console.log("network:", network.name);
  console.log("deployer", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("aliceWallet", aliceWallet.address);
  console.log("Account balance:", (await aliceWallet.getBalance()).toString());
  console.log("bobWallet", bobWallet.address);
  console.log("Account balance:", (await bobWallet.getBalance()).toString());

  factoryAddress = "0xb9853e45b3537975035159ece4E9F53EC18480Fd";
  walletFactoryFacetAddress = "0x58aD3eEFB1832ef971CDe8e45A7239E7dd8f9444";
  zkWalletDiamondAddress = "0x2338c67c687F3d6A28C27Df15325F06A6BF1C627";
  verifier20Address = "0x21176AA38497bdeab3CdB4368CFF53c428B001f7";
  poseidonT3Address = "0x1fB6C0Cc4b846a4A25B41f3AAD59b4C719474E3F";
  guardianFacetAddress = "0x3d4370D915c52E801963533E0aC54EAF4a57177b";
  eRC20FacetAddress = "0x5BA6985e2F04cA4Ef362dCFF0Ac793E1715F2E10";
  eRC721FacetAddress = "0xEA33dC1D03A626C899dfA6bD9BA61AcEce886AF1";
  recoveryFacetAddress = "0xC509433465D6e3b60CA192e81659BBEDffE7fd3b";
  semaphoreFacetAddress = "0xF6f822A0aaE0CDd6dDb6c0BA7284a74B006A0824";
  semaphoreGroupsFacetAddress = "0x7bA44FAF27B18d04Af0950f30617B5AAACceC038";
  semaphoreVotingFacetAddress = "0x43133D828f1E4c209eB60B4fEbD01221C72E4Ca4";

  if (network.name === "harmonyDevnet") {
    factoryAddress = "0xb9853e45b3537975035159ece4E9F53EC18480Fd";
    walletFactoryFacetAddress = "0x58aD3eEFB1832ef971CDe8e45A7239E7dd8f9444";
    zkWalletDiamondAddress = "0x2338c67c687F3d6A28C27Df15325F06A6BF1C627";
    verifier20Address = "0x21176AA38497bdeab3CdB4368CFF53c428B001f7";
    poseidonT3Address = "0x1fB6C0Cc4b846a4A25B41f3AAD59b4C719474E3F";
    guardianFacetAddress = "0x3d4370D915c52E801963533E0aC54EAF4a57177b";
    eRC20FacetAddress = "0x5BA6985e2F04cA4Ef362dCFF0Ac793E1715F2E10";
    eRC721FacetAddress = "0xEA33dC1D03A626C899dfA6bD9BA61AcEce886AF1";
    recoveryFacetAddress = "0xC509433465D6e3b60CA192e81659BBEDffE7fd3b";
    semaphoreFacetAddress = "0xF6f822A0aaE0CDd6dDb6c0BA7284a74B006A0824";
    semaphoreGroupsFacetAddress = "0x7bA44FAF27B18d04Af0950f30617B5AAACceC038";
    semaphoreVotingFacetAddress = "0x43133D828f1E4c209eB60B4fEbD01221C72E4Ca4";
  } else if (network.name === "harmonyTestnet") {
    // factoryAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";
    // verifier20Address = "0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f";
  }

  walletFactoryFacetInstance = await ethers.getContractAt(
    "WalletFactoryFacet",
    factoryAddress
  );

  const deployedContracts: { name: string; address: string }[] = [];

  facets = [
    {
      name: "GuardianFacet",
      contract: await ethers.getContractAt(
        "GuardianFacet",
        guardianFacetAddress
      ),
      address: guardianFacetAddress,
    },
    {
      name: "ERC20Facet",
      contract: await ethers.getContractAt("ERC20Facet", eRC20FacetAddress),
      address: eRC20FacetAddress,
    },
    {
      name: "ERC721Facet",
      contract: await ethers.getContractAt("ERC721Facet", eRC721FacetAddress),
      address: eRC721FacetAddress,
    },
    {
      name: "RecoveryFacet",
      contract: await ethers.getContractAt(
        "RecoveryFacet",
        recoveryFacetAddress
      ),
      address: recoveryFacetAddress,
    },
    {
      name: "SemaphoreFacet",
      contract: await ethers.getContractAt(
        "SemaphoreFacet",
        semaphoreFacetAddress
      ),
      address: semaphoreFacetAddress,
    },
    {
      name: "SemaphoreGroupsFacet",
      contract: await ethers.getContractAt(
        "SemaphoreGroupsFacet",
        semaphoreGroupsFacetAddress
      ),
      address: semaphoreGroupsFacetAddress,
    },
    {
      name: "SemaphoreVotingFacet",
      contract: await ethers.getContractAt(
        "SemaphoreVotingFacet",
        semaphoreVotingFacetAddress
      ),
      address: semaphoreVotingFacetAddress,
    },
  ];

  facetCuts = [
    {
      target: facets[0].address,
      action: 0,
      selectors: Object.keys(facets[0].contract.interface.functions).map((fn) =>
        facets[0].contract.interface.getSighash(fn)
      ),
    },
    {
      target: facets[1].address,
      action: 0,
      selectors: Object.keys(facets[1].contract.interface.functions).map((fn) =>
        facets[1].contract.interface.getSighash(fn)
      ),
    },
    {
      target: facets[2].address,
      action: 0,
      selectors: Object.keys(facets[2].contract.interface.functions).map((fn) =>
        facets[2].contract.interface.getSighash(fn)
      ),
    },
    {
      target: facets[3].address,
      action: 0,
      selectors: Object.keys(facets[3].contract.interface.functions).map((fn) =>
        facets[3].contract.interface.getSighash(fn)
      ),
    },
    {
      target: facets[4].address,
      action: 0,
      selectors: Object.keys(facets[4].contract.interface.functions).map((fn) =>
        facets[4].contract.interface.getSighash(fn)
      ),
    },
    {
      target: facets[5].address,
      action: 0,
      selectors: Object.keys(facets[5].contract.interface.functions).map((fn) =>
        facets[5].contract.interface.getSighash(fn)
      ),
    },
    {
      target: facets[6].address,
      action: 0,
      selectors: Object.keys(facets[6].contract.interface.functions).map((fn) =>
        facets[6].contract.interface.getSighash(fn)
      ),
    },
  ];

  // create a wallet for alice
  const hashId = ethers.utils.formatBytes32String("1");
  const transaction = await walletFactoryFacetInstance
    .connect(aliceWallet)
    .createWallet(hashId, aliceWallet.address);
  const receipt = await transaction.wait();
  alice = await ethers.getContractAt(
    "SimplicyWalletDiamond",
    receipt.events[0].address
  );
  console.log("New wallet address: ", alice.address);

  deployedContracts.push({
    name: "Alice Wallet",
    address: receipt.events[0].address,
  });

  //do the cut for alice wallet
  await alice
    .connect(aliceWallet)
    .diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  guardianInstance = await ethers.getContractAt("GuardianFacet", alice.address);
  semaphoreInstance = await ethers.getContractAt(
    "SemaphoreFacet",
    alice.address
  );
  semaphoreGroupsInstance = await ethers.getContractAt(
    "SemaphoreGroupsFacet",
    alice.address
  );

  const verifiers: Verifier[] = [
    { merkleTreeDepth: depth, contractAddress: verifier20Address },
  ];

  // set verifiers for Alice
  const aliceTransaction = await semaphoreInstance
    .connect(aliceWallet)
    .setVerifiers(verifiers);
  console.log("Alice setVerifiers transaction hash: ", aliceTransaction.hash);

  // create default group for Alice
  await semaphoreGroupsInstance
    .connect(aliceWallet)
    .createGroup(groupId, depth, 0, aliceWallet.address);

  console.log(identityCommitments);

  const tx = await guardianInstance
    .connect(aliceWallet)
    .addGuardians(groupId, identityCommitments);
  const receipt2 = await tx.wait();
  console.log(receipt2.events);

  fs.writeFileSync(
    `./created-wallets/${hardhatArguments.network}.json`,
    JSON.stringify(deployedContracts, null, 4)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
