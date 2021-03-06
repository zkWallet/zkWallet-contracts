import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "hardhat-spdx-license-identifier";
import "solidity-coverage";
import "./tasks/accounts";
import "./tasks/deploy-diamond";
import "./tasks/deploy-poseidonT3";
import "./tasks/deploy-facets";
import "./tasks/deploy-facets-with-poseidon";
import "./tasks/deploy-verifier";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545",
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.ALICE_PRIVATE_KEY as string,
        process.env.BOB_PRIVATE_KEY as string,
      ],
    },
    harmonyDevnet: {
      url: process.env.HARMONY_DEVNET_URL || "",
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.ALICE_PRIVATE_KEY as string,
        process.env.BOB_PRIVATE_KEY as string,
        process.env.GUARDIAN1_PRIVATE_KEY as string,
        process.env.GUARDIAN2_PRIVATE_KEY as string,
        process.env.GUARDIAN3_PRIVATE_KEY as string,
      ],
    },
    harmonyTestnet: {
      url: process.env.HARMONY_TESTNET_URL || "",
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.ALICE_PRIVATE_KEY as string,
        process.env.BOB_PRIVATE_KEY as string,
        process.env.GUARDIAN1_PRIVATE_KEY as string,
        process.env.GUARDIAN2_PRIVATE_KEY as string,
        process.env.GUARDIAN3_PRIVATE_KEY as string,
      ],
    },
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  typechain: {
    alwaysGenerateOverloads: true,
  },

  // abiExporter: {
  //   runOnCompile: true,
  //   clear: true,
  //   flat: true,
  //   except: [".*Mock$"],
  // },
};

export default config;
