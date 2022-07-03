import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { describeFilter } from "@solidstate/library";
import { IZkWalletDiamond } from "@simplicy/typechain-types";
import { expect } from "chai";
import { Verifier, Facet } from "../../../types";

export interface ZKWalletDiamondBehaviorArgs {
  getOwner: () => Promise<SignerWithAddress>;
  getFacets: () => Promise<Facet[]>;
  getVerifiers: () => Promise<Verifier[]>;
}

export function describeBehaviorOfZkWalletDiamond(
  deploy: () => Promise<IZkWalletDiamond>,
  { getOwner, getFacets, getVerifiers }: ZKWalletDiamondBehaviorArgs,
  skips?: string[]
) {
  const describe = describeFilter(skips);

  describe("::ZkWalletDiamond", function () {
    let owner: SignerWithAddress;
    let facets: Facet[];
    let verifiers: Verifier[];
    let instance: IZkWalletDiamond;

    before(async function () {
      owner = await getOwner();
    });

    beforeEach(async function () {
      instance = await deploy();
      facets = await getFacets();
      verifiers = await getVerifiers();
    });
    describe("#__ZkWalletDiamondBase_init()", function () {
      it("should have default values", async function () {});
    });
    describe("#version()", function () {
      it("returns the version", async function () {
        expect(await instance.callStatic["version()"]()).to.equal("0.1.0");
      });
    });
  });
}
