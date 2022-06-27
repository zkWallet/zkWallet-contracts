import {
  Semaphore,
  SemaphoreFullProof,
  SemaphoreSolidityProof,
} from "@zk-kit/protocols";
import { BigNumber, Contract } from "ethers";
import { hardhatArguments, ethers, network } from "hardhat";
import { GuardianFacet, RecoveryFacet } from "@simplicy/typechain-types";
import { MerkleProof } from "@zk-kit/incremental-merkle-tree";
import { DeployedContract, Verifier } from "../types";
import { config } from "../package.json";

async function main() {
  const depth = Number(process.env.TREE_DEPTH);
  const groupId: number = 1;

  let guardians: any[] = [];
  let identityCommitments: string[] = [];
  let identityCommitmentsBigInt: BigInt[] = [];

  const signal = "Hello World";
  const bytes32Signal: string = ethers.utils.formatBytes32String(signal);
  let merkleProof: MerkleProof;
  let witness: any;
  let fullProof: SemaphoreFullProof;
  let solidityProof: SemaphoreSolidityProof;
  const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`;
  const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`;

  const [owner, aliceWallet, bobWallet, guardian1, guardian2, guardian3] =
    await ethers.getSigners();

  const contract: any | GuardianFacet = await ethers.getContractAt(
    "GuardianFacet",
    "0x64C2Fbc31afE74BAEcAe92Bb28D33bce6B454C0B"
  );

  const version = await contract.guardianFacetVersion();
  console.log("guardianFacetVersion: ", version);

  guardians = await contract.getGuardians(1);
  console.log("getGuardians: ", guardians);

  for (let i = 0; i < guardians.length; i++) {
    identityCommitments.push(guardians[i].hashId.toString());
    identityCommitmentsBigInt.push(BigInt(guardians[i].hashId));
  }

  console.log(identityCommitments);
  console.log("identityCommitmentsBigInt", identityCommitmentsBigInt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
