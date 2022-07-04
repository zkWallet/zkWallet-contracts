import fs from "fs";
import { BigNumber, Contract } from "ethers";
import { run, hardhatArguments, ethers, network } from "hardhat";
import {
  IGuardianFacet,
  IEtherServiceFacet,
  ISemaphoreFacet,
  ISemaphoreGroupsFacet,
  IERC20ServiceFacet,
  IERC721ServiceFacet,
  IRecoveryFacet,
  IWalletFactoryFacet,
  IZkWalletDiamond,
  ZkWalletDiamond,
  ZkWalletDiamond__factory,
  ZkWalletFactoryDiamond,
} from "@simplicy/typechain-types";
import { DeployedContract, Verifier, Facet } from "../types";

async function main() {
  const [deployer, aliceWallet, bobWallet] = await ethers.getSigners();

  let diamond: any | Contract | ZkWalletFactoryDiamond;
  let instance: Contract | IWalletFactoryFacet;
  let aliceGuardianInstance: Contract | IGuardianFacet;
  let aliceSemaphoreInstance: Contract | ISemaphoreFacet;
  let aliceGroupsInstance: Contract | ISemaphoreGroupsFacet;
  let aliceERC20Instance: Contract | IERC20ServiceFacet;
  let aliceERC721Instance: Contract | IERC721ServiceFacet;
  let aliceRecoveryInstance: Contract | IRecoveryFacet;
  let aliceEtherInstance: Contract | IEtherServiceFacet;

  let walletDiamond: IZkWalletDiamond;

  let facetCuts: { target: string; action: number; selectors: any }[] = [];

  let facets: DeployedContract[] | any;
  let walletFacets: DeployedContract[] | any;
  let anotherWalletFacets: DeployedContract[] | any;

  const deployedContracts: { name: string; address: string }[] = [];
  let verifiers: Verifier[] = [];
  let verifier20: string;

  const depth = Number(process.env.TREE_DEPTH);

  let nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log("nonce =" + nonce);

  console.log("network:", network.name);
  console.log("deployer", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const transactionHash: {
    name: string;
    contractAddress: string;
    hash: string;
  }[] = [];

  diamond = await run("deploy:diamond", {
    name: "ZkWalletFactoryDiamond",
    nonce: nonce.toString(),
    logs: true,
  });

  // diamond = await ethers.getContractAt(
  //   "ZkWalletFactoryDiamond",
  //   "0x7Cbe3DB16C1e29e2394B3D8EB190bB72Da9A098C"
  // );

  deployedContracts.push({
    name: "ZkWalletFactoryDiamond",
    address: diamond.address,
  });

  // Deploy poseidonT3.
  const { address } = await run("deploy:poseidonT3", { logs: true });
  deployedContracts.push({
    name: "PoseidonT3",
    address,
  });
  const poseidonT3Address = address;

  // Deploy verifiers.
  for (let treeDepth = 20; treeDepth <= 20; treeDepth++) {
    const { address } = await run("deploy:verifier", {
      depth: treeDepth,
      logs: true,
    });

    deployedContracts.push({
      name: `Verifier${treeDepth}`,
      address,
    });
  }

  facets = await run("deploy:facets", {
    facets: [{ name: "WalletFactoryFacet" }],
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
  ];

  //do the cut
  await diamond.diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

  instance = await ethers.getContractAt("WalletFactoryFacet", diamond.address);

  walletFacets = await run("deploy:facets-with-poseidon", {
    library: poseidonT3Address,
    facets: [{ name: "GuardianFacet" }, { name: "SemaphoreGroupsFacet" }],
    logs: true,
  });
  for (let i = 0; i < facets.length; i++) {
    deployedContracts.push({
      name: walletFacets[i].name,
      address: walletFacets[i].address,
    });
  }

  anotherWalletFacets = await run("deploy:facets", {
    facets: [
      { name: "RecoveryFacet" },
      { name: "ERC20ServiceFacet" },
      { name: "ERC721ServiceFacet" },
      { name: "SemaphoreFacet" },
      { name: "EtherServiceFacet" },
    ],
    logs: true,
  });
  for (let i = 0; i < facets.length; i++) {
    deployedContracts.push({
      name: anotherWalletFacets[i].name,
      address: anotherWalletFacets[i].address,
    });
  }

  const newFacets: Facet[] = [
    {
      name: "GuardianFacet",
      facetAddress: walletFacets[0].address,
      version: "0.1.0.alpha",
    },
    {
      name: "SemaphoreGroupsFacet",
      facetAddress: walletFacets[1].address,
      version: "0.1.0.alpha",
    },
    {
      name: "ERC20ServiceFacet",
      facetAddress: anotherWalletFacets[0].address,
      version: "0.1.0.alpha",
    },
    {
      name: "ERC721ServiceFacet",
      facetAddress: anotherWalletFacets[1].address,
      version: "0.1.0.alpha",
    },
    {
      name: "RecoveryFacet",
      facetAddress: anotherWalletFacets[2].address,
      version: "0.1.0.alpha",
    },
    // {
    //   name: "SemaphoreFacet",
    //   facetAddress: anotherWalletFacets[3].address,
    //   version: "0.1.0.alpha",
    // },
    {
      name: "EtherServiceFacet",
      facetAddress: anotherWalletFacets[4].address,
      version: "0.1.0.alpha",
    },
  ];

  const verifier: string = "Verifier" + 20;
  const foundVerifier = deployedContracts.filter((obj) => {
    return obj.name === verifier;
  });

  verifier20 = foundVerifier[0].address;

  verifiers = [
    { merkleTreeDepth: 20, contractAddress: foundVerifier[0].address },
  ];

  console.log("newFacets:", newFacets);
  console.log("verifiers:", verifiers);

  walletDiamond = await new ZkWalletDiamond__factory(deployer).deploy(
    deployer.address,
    newFacets,
    verifiers
  );
  console.log("ZkWalletDiamond deployed at:", walletDiamond.address);
  deployedContracts.push({
    name: "ZkWalletDiamond",
    address: walletDiamond.address,
  });

  // Setting diamond to factory contract
  const transaction = await instance["setDiamond(address)"](
    walletDiamond.address
  );

  transactionHash.push({
    name: `Add diamond to Factory, diamond address: ${walletDiamond.address}`,
    contractAddress: instance.address,
    hash: transaction.hash,
  });

  // Add facets to the factorty contract.
  for (let i = 0; i < walletFacets.length; i++) {
    const addFacetTrx = await instance["addFacet(string,address,string)"](
      walletFacets[i].name,
      walletFacets[i].address,
      "0.1.0.alpha"
    );

    transactionHash.push({
      name: `Add facet to Factory, Facet address: ${walletFacets[i].address}`,
      contractAddress: instance.address,
      hash: addFacetTrx.hash,
    });
  }

  for (let i = 0; i < anotherWalletFacets.length; i++) {
    const anotherAddFacetTrx = await instance[
      "addFacet(string,address,string)"
    ](
      anotherWalletFacets[i].name,
      anotherWalletFacets[i].address,
      "0.1.0.alpha"
    );
    transactionHash.push({
      name: `Add facet to Factory, Facet address: ${anotherWalletFacets[i].address}`,
      contractAddress: instance.address,
      hash: anotherAddFacetTrx.hash,
    });
  }
  // console.log(await instance.getFacets());

  // const hashId = ethers.utils.formatBytes32String("1");

  // const trx = await instance["createWallet(bytes32,address,(uint8,address)[])"](
  //   hashId,
  //   aliceWallet.address,
  //   verifiers
  // );

  // const receipt = await trx.wait();
  // console.log("Alice address", receipt.events[0].address);
  // transactionHash.push({
  //   name: `Create wallet for Alice, new wallet created address: ${receipt.events[0].address}`,
  //   contractAddress: instance.address,
  //   hash: trx.hash,
  // });

  // const newDiamond = await ethers.getContractAt("ZkWalletDiamond", newWallet);

  // console.log("wallet newOwner address:", await newDiamond.owner());

  // console.log("facets:", await newDiamond.facets());

  // guardianInstance = await ethers.getContractAt(
  //   "GuardianFacet",
  //   newDiamond.address
  // );
  // console.log("guardianInstance:", await newDiamond.guardianFacetVersion());

  // console.log("facets:", await newDiamond.facets());

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
