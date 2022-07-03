import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { describeBehaviorOfERC20Facet } from "@simplicy/spec";
import { describeBehaviorOfSolidStateDiamond } from "@solidstate/spec";
import { ISimplicyTokenDiamond, IERC20Facet } from "@simplicy/typechain-types";
import { expect } from "chai";
import { ethers, run } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { DeployedContract } from "../../../types";

describe("SimplicyTokenDiamond", function () {
  let owner: SignerWithAddress;
  let nomineeOwner: SignerWithAddress;
  let nonOwner: SignerWithAddress;

  let facets: DeployedContract[] | any;

  let facetCuts: { target: string; action: number; selectors: any }[] = [];
  let diamond: ISimplicyTokenDiamond;
  let instance: IERC20Facet | any;

  before(async function () {
    [owner, nomineeOwner, nonOwner] = await ethers.getSigners();
  });

  beforeEach(async function () {
    diamond = await run("deploy:diamond", {
      name: "SimplicyTokenDiamond",
      logs: false,
    });

    facets = await diamond.callStatic["facets()"]();

    expect(facets).to.have.lengthOf(1);

    facetCuts[0] = {
      target: diamond.address,
      action: 0,
      selectors: facets[0].selectors,
    };
  });
  describe("#version()", function () {
    it("returns the version", async function () {
      expect(await diamond.callStatic["version()"]()).to.equal("0.1.0.alpha");
    });
  });
  describe("ERC20Facet", function () {
    const name = "ERC20Metadata.name";
    const symbol = "ERC20Metadata.symbol";
    const decimals = 18;
    const supply = BigNumber.from(100);
    beforeEach(async function () {
      facets = await run("deploy:facets", {
        facets: [{ name: "ERC20Facet" }],
        logs: false,
      });

      facetCuts = [
        {
          target: facets[0].address,
          action: 0,
          selectors: Object.keys(facets[0].contract.interface.functions).map(
            (fn) => facets[0].contract.interface.getSighash(fn)
          ),
        },
      ];

      //do the cut
      await diamond.diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

      instance = await ethers.getContractAt("ERC20Facet", diamond.address);

      instance.eRC20FacetInit(name, symbol, decimals, supply);
    });
    describeBehaviorOfERC20Facet(async () => instance, {
      burn: async (amount) => instance.burn(amount),
      allowance: (owner, spender) =>
        instance.callStatic.allowance(owner, spender),
      name,
      symbol,
      decimals,
      supply,
    });
  });
  describe.skip("SolidStateDiamond", function () {
    describeBehaviorOfSolidStateDiamond(
      async () => diamond,
      {
        getOwner: async () => owner,
        getNomineeOwner: async () => nomineeOwner,
        getNonOwner: async () => nonOwner,
        facetFunction: "",
        facetFunctionArgs: [],
        facetCuts,
        fallbackAddress: ethers.constants.AddressZero,
      },
      ["fallback()"]
    );
  });
});
