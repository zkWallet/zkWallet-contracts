import fs from "fs";
import { BigNumber, Contract } from "ethers";
import { run, hardhatArguments, ethers, network } from "hardhat";
import {
  SimplicyWalletDiamond,
  WalletFactoryDiamond,
  WalletFactoryFacet,
} from "@simplicy/typechain-types";
import { createIdentityCommitments } from "../test/utils";

type Verifier = {
  contractAddress: string;
  merkleTreeDepth: number;
};

type DeployedContract = {
  name: string;
  contract: Contract;
  address: string;
};

type GuardianDTO = {
  hashId: BigNumber;
};

async function main() {
  let factoryDiamond: WalletFactoryDiamond;
  let alice, bob, diamond: SimplicyWalletDiamond;
  let walletFactoryFacetInstance: Contract | WalletFactoryFacet;
  let factoryFacets: DeployedContract[];

  let facetCuts: { target: string; action: number; selectors: any }[] = [];
  let aliceSemaphoreInstance: any;
  let bobSemaphoreInstance: any;
  let aliceSemaphoreGroupsInstance: any;
  let bobSemaphoreGroupsInstance: any;
  let aliceGuardianInstance: any;
  let bobGuardianInstance: any;
  let facets: DeployedContract[];
  let walletFacets: DeployedContract[];

  const members: bigint[] = createIdentityCommitments(3);
  let guardians: GuardianDTO[] = [];
  guardians = [
    { hashId: BigNumber.from(members[0]) },
    { hashId: BigNumber.from(members[1]) },
    { hashId: BigNumber.from(members[2]) },
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

  const deployedContracts: { name: string; address: string }[] = [];
  const transactionHash: {
    name: string;
    contractAddress: string;
    hash: string;
  }[] = [];

  // Deploy verifiers.
  for (let treeDepth = 16; treeDepth <= 32; treeDepth++) {
    const { address } = await run("deploy:verifier", {
      depth: treeDepth,
      logs: true,
    });

    deployedContracts.push({
      name: `Verifier${treeDepth}`,
      address,
    });
  }

  // Deploy factory diamond
  factoryDiamond = await run("deploy:diamond", {
    name: "WalletFactoryDiamond",
    logs: true,
  });
  deployedContracts.push({
    name: "WalletFactoryDiamond",
    address: factoryDiamond.address,
  });

  factoryFacets = await run("deploy:facets", {
    facets: [{ name: "WalletFactoryFacet" }],
  });

  for (let i = 0; i < factoryFacets.length; i++) {
    deployedContracts.push({
      name: factoryFacets[i].name,
      address: factoryFacets[i].address,
    });

    facetCuts.push({
      target: factoryFacets[i].address,
      action: 0,
      selectors: Object.keys(factoryFacets[i].contract.interface.functions).map(
        (fn) => factoryFacets[i].contract.interface.getSighash(fn)
      ),
    });
  }

  //do the cut
  await factoryDiamond.diamondCut(
    facetCuts,
    ethers.constants.AddressZero,
    "0x"
  );

  // Deploy wallet diamond for cloning
  diamond = await run("deploy:diamond", {
    name: "SimplicyWalletDiamond",
    owner: deployer.address,
    logs: true,
  });

  deployedContracts.push({
    name: "SimplicyWalletDiamond",
    address: diamond.address,
  });

  // Deploy poseidonT3.
  const { address } = await run("deploy:poseidonT3", { logs: true });
  deployedContracts.push({
    name: "PoseidonT3",
    address,
  });
  const poseidonT3Address = address;

  facets = await run("deploy:facets-with-poseidon", {
    library: poseidonT3Address,
    facets: [{ name: "GuardianFacet" }, { name: "SemaphoreGroupsFacet" }],
    logs: false,
  });

  for (let i = 0; i < facets.length; i++) {
    deployedContracts.push({
      name: facets[i].name,
      address: facets[i].address,
    });
  }

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
  ];

  //do the cut
  await diamond.diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  walletFacets = await run("deploy:facets", {
    facets: [
      { name: "ERC20Facet" },
      { name: "ERC721Facet" },
      { name: "RecoveryFacet" },
      { name: "SemaphoreFacet" },
      { name: "SemaphoreVotingFacet" },
    ],
  });

  for (let i = 0; i < facets.length; i++) {
    deployedContracts.push({
      name: walletFacets[i].name,
      address: walletFacets[i].address,
    });
  }

  facetCuts = [
    {
      target: walletFacets[0].address,
      action: 0,
      selectors: Object.keys(walletFacets[0].contract.interface.functions).map(
        (fn) => walletFacets[0].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[1].address,
      action: 0,
      selectors: Object.keys(walletFacets[1].contract.interface.functions).map(
        (fn) => walletFacets[1].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[2].address,
      action: 0,
      selectors: Object.keys(walletFacets[2].contract.interface.functions).map(
        (fn) => walletFacets[2].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[3].address,
      action: 0,
      selectors: Object.keys(walletFacets[3].contract.interface.functions).map(
        (fn) => walletFacets[3].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[4].address,
      action: 0,
      selectors: Object.keys(walletFacets[4].contract.interface.functions).map(
        (fn) => walletFacets[4].contract.interface.getSighash(fn)
      ),
    },
  ];

  //do the cut for wallet contract
  await diamond
    .connect(deployer)
    .diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  walletFactoryFacetInstance = await ethers.getContractAt(
    "WalletFactoryFacet",
    factoryDiamond.address
  );

  console.log("WalletFactoryDiamond version:", await factoryDiamond.version());
  console.log(
    "walletFactoryFacetVersion:",
    await walletFactoryFacetInstance.walletFactoryFacetVersion()
  );

  console.log("SimplicyWalletDiamond version:", await diamond.version());

  console.log(
    "#addFacet====================================",
    walletFacets.length
  );
  for (let i = 0; i < walletFacets.length; i++) {
    const transaction = await walletFactoryFacetInstance.addFacet(
      walletFacets[i].name,
      walletFacets[i].address,
      "0.0.1"
    );

    transactionHash.push({
      name: `Add facet to Factory, facet name: ${walletFacets[i].name}`,
      contractAddress: walletFacets[i].address,
      hash: transaction.hash,
    });
  }

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
  transactionHash.push({
    name: "Create wallet for alice",
    contractAddress: receipt.events[0].address,
    hash: transaction.hash,
  });

  // create a wallet for bob
  const hashIdBob = ethers.utils.formatBytes32String("2");
  const transactionBob = await walletFactoryFacetInstance
    .connect(bobWallet)
    .createWallet(hashIdBob, bobWallet.address);
  const receiptBob = await transactionBob.wait();
  bob = await ethers.getContractAt(
    "SimplicyWalletDiamond",
    receiptBob.events[0].address
  );
  transactionHash.push({
    name: "Create wallet for bob",
    contractAddress: receiptBob.events[0].address,
    hash: transaction.hash,
  });

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
      target: walletFacets[0].address,
      action: 0,
      selectors: Object.keys(walletFacets[0].contract.interface.functions).map(
        (fn) => walletFacets[0].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[1].address,
      action: 0,
      selectors: Object.keys(walletFacets[1].contract.interface.functions).map(
        (fn) => walletFacets[1].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[2].address,
      action: 0,
      selectors: Object.keys(walletFacets[2].contract.interface.functions).map(
        (fn) => walletFacets[2].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[3].address,
      action: 0,
      selectors: Object.keys(walletFacets[3].contract.interface.functions).map(
        (fn) => walletFacets[3].contract.interface.getSighash(fn)
      ),
    },
    {
      target: walletFacets[4].address,
      action: 0,
      selectors: Object.keys(walletFacets[4].contract.interface.functions).map(
        (fn) => walletFacets[4].contract.interface.getSighash(fn)
      ),
    },
  ];

  //do the cut for alice wallet
  await alice
    .connect(aliceWallet)
    .diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  //do the cut for bob wallet
  await bob
    .connect(bobWallet)
    .diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  aliceSemaphoreInstance = await ethers.getContractAt(
    "SemaphoreFacet",
    alice.address
  );
  bobSemaphoreInstance = await ethers.getContractAt(
    "SemaphoreFacet",
    bob.address
  );

  aliceSemaphoreGroupsInstance = await ethers.getContractAt(
    "SemaphoreGroupsFacet",
    alice.address
  );

  bobSemaphoreGroupsInstance = await ethers.getContractAt(
    "SemaphoreGroupsFacet",
    bob.address
  );

  aliceGuardianInstance = await ethers.getContractAt(
    "GuardianFacet",
    alice.address
  );
  bobGuardianInstance = await ethers.getContractAt(
    "GuardianFacet",
    bob.address
  );

  const verifier: string = "Verifier" + depth;
  const foundVerifier = deployedContracts.filter((obj) => {
    return obj.name === verifier;
  });

  console.log(verifier, foundVerifier[0].address);
  const verifiers: Verifier[] = [
    { merkleTreeDepth: depth, contractAddress: foundVerifier[0].address },
  ];

  // set verifiers for Alice and Bob
  const aliceTransaction = await aliceSemaphoreInstance
    .connect(aliceWallet)
    .setVerifiers(verifiers);
  console.log("Alice setVerifiers transaction hash: ", aliceTransaction.hash);

  transactionHash.push({
    name: "Alice setVerifiers",
    contractAddress: aliceSemaphoreInstance.address,
    hash: aliceTransaction.hash,
  });

  const bobTransaction = await bobSemaphoreInstance
    .connect(bobWallet)
    .setVerifiers(verifiers);
  console.log("Bob setVerifiers transaction hash: ", bobTransaction.hash);

  transactionHash.push({
    name: "Bob setVerifiers",
    contractAddress: bobSemaphoreInstance.address,
    hash: bobTransaction.hash,
  });

  // create default group for Alice and Bob
  const aliceCreateGroupTransaction = await aliceSemaphoreGroupsInstance
    .connect(aliceWallet)
    .createGroup(groupId, depth, 0, deployer.address);

  transactionHash.push({
    name: "aliceCreateGroupTransaction",
    contractAddress: aliceSemaphoreGroupsInstance.address,
    hash: aliceCreateGroupTransaction.hash,
  });

  const bobCreateGroupTransaction = await bobSemaphoreGroupsInstance
    .connect(bobWallet)
    .createGroup(groupId, depth, 0, deployer.address);

  transactionHash.push({
    name: "bobCreateGroupTransaction",
    contractAddress: bobSemaphoreGroupsInstance.address,
    hash: bobCreateGroupTransaction.hash,
  });

  await aliceGuardianInstance
    .connect(aliceWallet)
    .addGuardians(groupId, members, guardians);

  transactionHash.push({
    name: "Add Guardians to Alice Wallet",
    contractAddress: aliceGuardianInstance.address,
    hash: transaction.hash,
  });

  await bobGuardianInstance
    .connect(bobWallet)
    .addGuardians(groupId, members, guardians);

  transactionHash.push({
    name: "Add Guardians to Bob Wallet",
    contractAddress: bobGuardianInstance.address,
    hash: transaction.hash,
  });

  fs.writeFileSync(
    `./deployed-contracts/${hardhatArguments.network}.json`,
    JSON.stringify(deployedContracts, null, 4)
  );

  fs.appendFileSync(
    `./deployed-contracts/${hardhatArguments.network}.json`,
    JSON.stringify(transactionHash, null, 4)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
