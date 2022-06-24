import { Contract } from "ethers";
import { task, types } from "hardhat/config";

task("deploy:diamond", "Deploy diamond contract")
  .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
  .addOptionalParam(
    "owner",
    "The account to deploy the contract from",
    undefined,
    types.string
  )
  .addParam("name", "Diamond name", undefined, types.string)
  .setAction(async ({ logs, owner, name }, { ethers }): Promise<Contract> => {
    const [deployer, aliceWallet, bobWallet] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory(name, {
      signer: deployer,
    });

    let diamond: Contract;
    if (owner) {
      diamond = await ContractFactory.deploy(owner);
    } else {
      diamond = await ContractFactory.deploy();
    }

    await diamond.deployed();

    logs &&
      console.log(`${name} contract has been deployed to: ${diamond.address}`);

    return diamond;
  });
