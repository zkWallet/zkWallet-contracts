import fs from "fs";
import { Contract } from "ethers";
import { run, hardhatArguments, ethers } from "hardhat";
import {
  SimplicyWalletDiamond,
  WalletFactoryDiamond,
  WalletFactoryFacet,
} from "@simplicy/typechain-types";

type Verifier = {
  contractAddress: string;
  merkleTreeDepth: number;
};

type DeployedContract = {
  name: string;
  contract: Contract;
  address: string;
};

async function main() {
  let factoryDiamond: WalletFactoryDiamond;
  let alice, bob, diamond: SimplicyWalletDiamond;
  let walletFactoryInstance: any | WalletFactoryFacet;
  let factoryFacets: DeployedContract[];

  let facetCuts: { target: string; action: number; selectors: any }[] = [];
  let aliceSemaphoreInstance: any;
  let bobSemaphoreInstance: any;
  let aliceSemaphoreGroupsInstance: any;
  let bobSemaphoreGroupsInstance: any;
  let aliceSemaphoreVotingInstance: any;
  let bobSemaphoreVotingInstance: any;
  let facets: DeployedContract[];
  let walletFacets: DeployedContract[];

  const depth = Number(process.env.TREE_DEPTH);
  const groupId: number = 1;

  const [deployer, aliceWallet, bobWallet] = await ethers.getSigners();

  const deployedContracts: { name: string; address: string }[] = [];
  const transactionHash: { name: string; hash: string }[] = [];

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
    logs: true,
  });

  for (let i = 0; i < factoryFacets.length; i++) {
    deployedContracts.push({
      name: factoryFacets[i].name,
      address: factoryFacets[i].address,
    });
  }

  facetCuts = [
    {
      target: factoryFacets[0].address,
      action: 0,
      selectors: Object.keys(factoryFacets[0].contract.interface.functions).map(
        (fn) => factoryFacets[0].contract.interface.getSighash(fn)
      ),
    },
  ];

  //do the cut
  await factoryDiamond.diamondCut(
    facetCuts,
    ethers.constants.AddressZero,
    "0x"
  );

  // Deploy wallet diamond for cloning
  diamond = await run("deploy:diamond", {
    name: "SimplicyWalletDiamond",
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
    logs: true,
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

  walletFactoryInstance = await ethers.getContractAt(
    "WalletFactoryFacet",
    factoryDiamond.address
  );

  console.log("WalletFactoryDiamond version:", await factoryDiamond.version());
  console.log(
    "walletFactoryFacetVersion:",
    await walletFactoryInstance.walletFactoryFacetVersion()
  );

  console.log("SimplicyWalletDiamond version:", await diamond.version());

  console.log("#addFacet====================================");

  // do the cut for alice
  // await alice
  //   .connect(aliceWallet)
  //   .diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  // // do the cut for bob.
  // await bob
  //   .connect(bobWallet)
  //   .diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  // aliceSemaphoreInstance = await ethers.getContractAt(
  //   "SemaphoreFacet",
  //   alice.address
  // );
  // bobSemaphoreInstance = await ethers.getContractAt(
  //   "SemaphoreFacet",
  //   bob.address
  // );

  // aliceSemaphoreGroupsInstance = await ethers.getContractAt(
  //   "SemaphoreGroupsFacet",
  //   alice.address
  // );

  // bobSemaphoreGroupsInstance = await ethers.getContractAt(
  //   "SemaphoreGroupsFacet",
  //   bob.address
  // );

  // aliceSemaphoreVotingInstance = await ethers.getContractAt(
  //   "SemaphoreVotingFacet",
  //   alice.address
  // );

  // bobSemaphoreVotingInstance = await ethers.getContractAt(
  //   "SemaphoreVotingFacet",
  //   alice.address
  // );

  const verifier: string = "Verifier" + depth;
  const foundVerifier = deployedContracts.filter((obj) => {
    return obj.name === verifier;
  });

  console.log(verifier, foundVerifier[0].address);
  const verifiers: Verifier[] = [
    { merkleTreeDepth: depth, contractAddress: foundVerifier[0].address },
  ];

  // set verifiers for Alice and Bob
  // const aliceTransaction = await aliceSemaphoreInstance
  //   .connect(aliceWallet)
  //   .setVerifiers(verifiers);
  // console.log("Alice setVerifiers transaction hash: ", aliceTransaction.hash);

  // transactionHash.push({
  //   name: "Alice setVerifiers",
  //   hash: aliceTransaction.hash,
  // });

  // const bobTransaction = await bobSemaphoreInstance
  //   .connect(bobWallet)
  //   .setVerifiers(verifiers);
  // console.log("Bob setVerifiers transaction hash: ", bobTransaction.hash);

  // transactionHash.push({
  //   name: "Bob setVerifiers",
  //   hash: bobTransaction.hash,
  // });

  // // create default group for Alice and Bob
  // const aliceCreateGroupTransaction = await aliceSemaphoreGroupsInstance
  //   .connect(aliceWallet)
  //   .createGroup(groupId, depth, 0, deployer.address);
  // console.log(
  //   "aliceCreateGroupTransaction hash: ",
  //   aliceCreateGroupTransaction.hash
  // );

  // transactionHash.push({
  //   name: "aliceCreateGroupTransaction",
  //   hash: aliceCreateGroupTransaction.hash,
  // });

  // const bobCreateGroupTransaction = await bobSemaphoreGroupsInstance
  //   .connect(bobWallet)
  //   .createGroup(groupId, depth, 0, deployer.address);
  // console.log(
  //   "bobCreateGroupTransaction hash: ",
  //   bobCreateGroupTransaction.hash
  // );

  // transactionHash.push({
  //   name: "bobCreateGroupTransaction",
  //   hash: bobCreateGroupTransaction.hash,
  // });

  // const aliceCreatePoll = await aliceSemaphoreVotingInstance.createPoll(
  //   1,
  //   deployer.address,
  //   depth
  // );

  // transactionHash.push({
  //   name: "Alice SemaphoreVotingStorage createPoll",
  //   hash: aliceCreatePoll.hash,
  // });

  // const bobCreatePool = await bobSemaphoreVotingInstance.createPoll(
  //   1,
  //   deployer.address,
  //   depth
  // );

  // transactionHash.push({
  //   name: "Bob SemaphoreVotingStorage createPoll",
  //   hash: bobCreatePool.hash,
  // });

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
