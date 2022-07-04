import { Contract } from "ethers";

export type DeployedContract = {
  name: string;
  contract: Contract;
  address: string;
};

export type Verifier = {
  merkleTreeDepth: number;
  contractAddress: string;
};

export type Facet = {
  name: string;
  facetAddress: string;
  version: string;
};
