import { Contract } from "ethers";
import { task, types } from "hardhat/config";

task("deploy:diamond-with-poseidon", "Deploy diamond contract with Poseidon")
  .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
  .addParam("name", "Diamond name", undefined, types.string)
  .addParam("library", "PoseidonT3 address", undefined, types.string)
  .setAction(async ({ logs, name, library }, { ethers }): Promise<Contract> => {
    const [deployer] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory(name, {
      signer: deployer,
      libraries: {
        PoseidonT3: library,
      },
    });

    let diamond: Contract;

    diamond = await ContractFactory.deploy();

    await diamond.deployed();

    logs &&
      console.log(`${name} contract has been deployed to: ${diamond.address}`);

    return diamond;
  });
