import fs from "fs";
import { BigNumber, Contract } from "ethers";
import { run, hardhatArguments, ethers, network } from "hardhat";
import {
  IZkWalletDiamond,
  ZkWalletFactoryDiamond,
  WalletFactoryFacet,
  IGuardianFacet,
} from "@simplicy/typechain-types";
import { DeployedContract, Verifier, Facet } from "../types";

async function main() {
  let factoryDiamond: ZkWalletFactoryDiamond;
  let diamond: IZkWalletDiamond;
  let walletFactoryFacetInstance: Contract | WalletFactoryFacet;
  let guardianInstance: Contract | IGuardianFacet;
  let factoryFacets: DeployedContract[];

  let facetCuts: { target: string; action: number; selectors: any }[] = [];

  let facets: DeployedContract[];
  let walletFacets: DeployedContract[];

  const [deployer, aliceWallet, bobWallet] = await ethers.getSigners();

  console.log("network:", network.name);
  console.log("deployer", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const deployedContracts: { name: string; address: string }[] = [];
  const transactionHash: {
    name: string;
    contractAddress: string;
    hash: string;
  }[] = [];

  // Deploy poseidonT3.
  const { address } = await run("deploy:poseidonT3", { logs: true });
  deployedContracts.push({
    name: "PoseidonT3",
    address,
  });
  const poseidonT3Address = address;

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
    name: "ZkWalletFactoryDiamond",
    logs: true,
  });
  deployedContracts.push({
    name: "ZkWalletFactoryDiamond",
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

  diamond = await run("deploy:diamond-with-poseidon", {
    name: "ZkWalletDiamond",
    library: poseidonT3Address,
    logs: true,
  });

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
      { name: "ERC20ServiceFacet" },
      { name: "ERC721ServiceFacet" },
      { name: "RecoveryFacet" },
      { name: "SemaphoreFacet" },
    ],
  });

  for (let i = 0; i < walletFacets.length; i++) {
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

  console.log(
    "#add diamond implementation to factory===================================="
  );

  const setDiamondTrx = await walletFactoryFacetInstance.setDiamond(
    diamond.address
  );

  transactionHash.push({
    name: `Add diamond  ${diamond.address} implementation to factory`,
    contractAddress: walletFactoryFacetInstance.address,
    hash: setDiamondTrx.hash,
  });

  console.log("#addFacet====================================");
  for (let i = 0; i < facets.length; i++) {
    const transaction = await walletFactoryFacetInstance.addFacet(
      facets[i].name,
      facets[i].address,
      "0.1.alpha"
    );

    console.log(await transaction.wait());

    transactionHash.push({
      name: `Add facet to Factory, facet name: ${facets[i].name}`,
      contractAddress: facets[i].address,
      hash: transaction.hash,
    });
  }
  for (let i = 0; i < walletFacets.length; i++) {
    const transaction = await walletFactoryFacetInstance.addFacet(
      walletFacets[i].name,
      walletFacets[i].address,
      "0.1.alpha"
    );

    transactionHash.push({
      name: `Add facet to Factory, facet name: ${walletFacets[i].name}`,
      contractAddress: walletFacets[i].address,
      hash: transaction.hash,
    });
  }

  console.log("facets:", await walletFactoryFacetInstance.getFacets());

  await diamond["initOwner(address)"](factoryDiamond.address);

  deployedContracts.push({
    name: "ZkWalletDiamond",
    address: diamond.address,
  });

  const verifier: string = "Verifier" + 20;
  const foundVerifier = deployedContracts.filter((obj) => {
    return obj.name === verifier;
  });

  console.log(verifier, foundVerifier[0].address);
  const verifiers: Verifier[] = [
    { merkleTreeDepth: 20, contractAddress: foundVerifier[0].address },
  ];

  const hashId = ethers.utils.formatBytes32String("1");
  const createWalletTx = await walletFactoryFacetInstance
    .connect(aliceWallet)
    .createWallet(hashId, aliceWallet.address, verifiers);
  const receipt = await createWalletTx.wait();
  // console.log("createWalletTx:", await createWalletTx.wait());
  const newWallet = receipt.events[0].args[0];
  console.log("createWalletTx newWallet:", newWallet);
  const owner = await diamond.owner();
  console.log("owner:", owner);
  console.log("deployer:", deployer.address);
  console.log("aliceWallet:", aliceWallet.address);
  console.log("factory:", factoryDiamond.address);

  const newDiamond = await ethers.getContractAt("ZkWalletDiamond", newWallet);

  console.log("wallet newOwner address:", await newDiamond.owner());

  console.log("facets:", await newDiamond.facets());

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
