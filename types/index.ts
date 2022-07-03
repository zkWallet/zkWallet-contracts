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

export type Facet = {
  name: string;
  facetAddress: string;
  version: string;
};
