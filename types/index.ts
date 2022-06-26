import { Contract } from "ethers";

export type DeployedContract = {
  name: string;
  contract: Contract;
  address: string;
};

export type Verifier = {
  contractAddress: string;
  merkleTreeDepth: Number;
};
