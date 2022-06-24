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
  let factoryAddress: string;
  let walletFactoryFacetAddress: string;
  let verifier20Address: string;
  let zkWalletDiamondAddress: string;
  let poseidonT3Address: string;
  let eRC20FacetAddress: string;
  let eRC721FacetAddress: string;
  let recoveryFacetAddress: string;
  let semaphoreFacetAddress: string;
  let semaphoreVotingFacetAddress: string;

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

  if (network.name === "HarmonyDevnet") {
    factoryAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";
    walletFactoryFacetAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";

    zkWalletDiamondAddress = "0x8BeFc64AA83f6a822376D2fEd3BF928d870264Fb";
    verifier20Address = "0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f";
    poseidonT3Address = "0x07AfCA0456B59962588006a10895A15bCb751C71";
    eRC20FacetAddress = "0xaC71914E2A22f92d3F75106043aA4E7248Eda9C3";
    eRC721FacetAddress = "0x4FEbbDE06b713Ecb9829b771d3dc18bD1F9DcbBE";
    recoveryFacetAddress = "0x1A51d1C41be8a8A8F3092C65Ca0c3a0777a65f06";
    semaphoreFacetAddress = "0x890be5081e75781F81d6eB86EF19Bceb21C9e160";
    semaphoreVotingFacetAddress = "0x3Efcd0a84EfFDFD8C16FC2a47eEf2CF0f4CA4352";
  } else if (network.name === "HarmonyTestnet") {
    // factoryAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";
    // verifier20Address = "0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f";
  } else if (network.name === "Harmony") {
    // factoryAddress = "0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e";
    // verifier20Address = "0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f";
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
