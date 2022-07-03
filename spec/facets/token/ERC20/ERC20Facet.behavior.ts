import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  describeBehaviorOfERC20Base,
  ERC20BaseBehaviorArgs,
  describeBehaviorOfERC20Extended,
  ERC20ExtendedBehaviorArgs,
} from "../../../";
import {
  describeBehaviorOfERC20Metadata,
  ERC20MetadataBehaviorArgs,
} from "@solidstate/spec";
import { expect } from "chai";
import { ethers } from "hardhat";
import { describeFilter } from "@solidstate/library";
import { IERC20Facet } from "@simplicy/typechain-types";

export interface ERC20FacetBehaviorArgs
  extends ERC20BaseBehaviorArgs,
          ERC20ExtendedBehaviorArgs,
          ERC20MetadataBehaviorArgs 
{}

export function describeBehaviorOfERC20Facet(
  deploy: () => Promise<IERC20Facet>,
  { burn, name, allowance, symbol, decimals, supply }: ERC20FacetBehaviorArgs,
  skips?: string[]
) {
  const describe = describeFilter(skips);

  describe("::ERC20Facet", function () {
    let instance: IERC20Facet;
    let owner: SignerWithAddress;
    let nonOwner: SignerWithAddress;

    before(async function () {
      [owner, nonOwner] = await ethers.getSigners();
    });

    beforeEach(async function () {
      instance = await deploy();
    });

    describe("#erc20FacetVersion()", function () {
      it("returns the ERC20 facet version", async function () {
        expect(await instance.callStatic["erc20FacetVersion()"]()).to.equal(
          "0.1.0.alpha"
        );
      });
    });
    describeBehaviorOfERC20Base(
      deploy,
      {
        burn,
        supply,
      },
      skips
    );

    describeBehaviorOfERC20Extended(
      deploy,
      {
        burn,
        allowance,
        supply,
      },
      skips
    );

    describeBehaviorOfERC20Metadata(
      deploy,
      {
        name,
        symbol,
        decimals,
      },
      skips
    );
    describe("#burn(uint256)", function () {
      describe("revert if ...", function () {
        it("exceeds balance", async function () {
          await expect(instance["burn(uint256)"](supply.add(ethers.constants.One))).to.revertedWith("ERC20: burn amount exceeds balance")
        });
      });
    });
  });
}
