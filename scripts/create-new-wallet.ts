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

  factoryAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";
  walletFactoryFacetAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";
  zkWalletDiamondAddress = "0x8BeFc64AA83f6a822376D2fEd3BF928d870264Fb";
  verifier20Address = "0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f";
  poseidonT3Address = "0x07AfCA0456B59962588006a10895A15bCb751C71";
  guardianFacetAddress = "0xb5EAa5bA96DDab615d887aF331cc78D34B6AA353";
  eRC20FacetAddress = "0xaC71914E2A22f92d3F75106043aA4E7248Eda9C3";
  eRC721FacetAddress = "0x4FEbbDE06b713Ecb9829b771d3dc18bD1F9DcbBE";
  recoveryFacetAddress = "0x1A51d1C41be8a8A8F3092C65Ca0c3a0777a65f06";
  semaphoreFacetAddress = "0x890be5081e75781F81d6eB86EF19Bceb21C9e160";
  semaphoreGroupsFacetAddress = "0x0c2B1dD90cba0cAf2777bE41f91a8Ac45B0e185c";
  semaphoreVotingFacetAddress = "0x3Efcd0a84EfFDFD8C16FC2a47eEf2CF0f4CA4352";

  if (network.name === "harmonyDevnet") {
    factoryAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";
    walletFactoryFacetAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";

    zkWalletDiamondAddress = "0x8BeFc64AA83f6a822376D2fEd3BF928d870264Fb";

    verifier20Address = "0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f";
    poseidonT3Address = "0x07AfCA0456B59962588006a10895A15bCb751C71";
    guardianFacetAddress = "0xb5EAa5bA96DDab615d887aF331cc78D34B6AA353";
    eRC20FacetAddress = "0xaC71914E2A22f92d3F75106043aA4E7248Eda9C3";
    eRC721FacetAddress = "0x4FEbbDE06b713Ecb9829b771d3dc18bD1F9DcbBE";
    recoveryFacetAddress = "0x1A51d1C41be8a8A8F3092C65Ca0c3a0777a65f06";
    semaphoreFacetAddress = "0x890be5081e75781F81d6eB86EF19Bceb21C9e160";
    semaphoreGroupsFacetAddress = "0x0c2B1dD90cba0cAf2777bE41f91a8Ac45B0e185c";
    semaphoreVotingFacetAddress = "0x3Efcd0a84EfFDFD8C16FC2a47eEf2CF0f4CA4352";
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
