import { BigNumber } from "ethers";
import { ethers, network, upgrades } from "hardhat";
import {
  ERC20Mock__factory,
  ERC721Mock__factory,
} from "@simplicy/typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  const name = "Simplicy";
  const symbol = "SIMPLE";
  const decimals = 18;
  const supply = BigNumber.from(100000000);

  console.log("network:", network.name);
  console.log("deployer", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const SimplicyERC20Upgradeable = await ethers.getContractFactory(
    "SimplicyERC20Upgradeable"
  );
  const instance = await upgrades.deployProxy(SimplicyERC20Upgradeable, [
    name,
    symbol,
    supply,
  ]);
  await instance.deployed();

  console.log("SimplicyERC20Upgradeable address:", instance.address);

  const token = await new ERC20Mock__factory(deployer).deploy(
    name,
    symbol,
    deployer.address,
    supply
  );

  await token.deployed();

  console.log("ERC20Mock address:", token.address);

  const erc721 = await new ERC721Mock__factory(deployer).deploy(
    "Lithium Hotel Guest",
    "LITHIUM GUEST"
  );

  await erc721.deployed();

  console.log("ERC721Mock address:", erc721.address);

  const wallet = "0x4D2F4557f5503c2B8e3c404eD18ddCb097fB73CC";
  const uri =
    "https://ipfs.infura.io/ipfs/QmZTwXNgZtTpYJ9gfkD9sksFHK8gKpQR8nTwpAVycsmyuG";
  await erc721.safeMint(wallet, uri);
  await erc721.safeMint(wallet, uri);
  await erc721.safeMint(wallet, uri);
  await erc721.safeMint(wallet, uri);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
