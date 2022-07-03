import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import {
  IWalletFactoryFacet,
  IZkWalletDiamond,
  ZkWalletDiamond,
  ZkWalletFactoryDiamond,
} from "@simplicy/typechain-types";
import { expect } from "chai";
import { ethers, run } from "hardhat";
import { DeployedContract, Verifier, Facet } from "../../types";

describe.only("ZkWalletFactoryDiamond", function () {
  let owner: SignerWithAddress;
  let nomineeOwner: SignerWithAddress;
  let nonOwner: SignerWithAddress;
  let alice: SignerWithAddress;

  let diamond: ZkWalletFactoryDiamond;
  let instance: Contract | IWalletFactoryFacet;

  let walletDiamond: IZkWalletDiamond;

  let facetCuts: { target: string; action: number; selectors: any }[] = [];

  let facets: DeployedContract[] | any;
  let walletFacets: DeployedContract[] | any;
  let anotherWalletFacets: DeployedContract[] | any;

  const deployedContracts: { name: string; address: string }[] = [];
  let verifiers: Verifier[] = [];

  before(async function () {
    [owner, nomineeOwner, nonOwner, alice] = await ethers.getSigners();
  });

  beforeEach(async function () {
    // Deploy poseidonT3.
    const { address } = await run("deploy:poseidonT3", { logs: false });
    const poseidonT3Address = address;

    for (let treeDepth = 16; treeDepth <= 32; treeDepth++) {
      const { address } = await run("deploy:verifier", {
        depth: treeDepth,
        logs: false,
      });

      deployedContracts.push({
        name: `Verifier${treeDepth}`,
        address,
      });
    }

    // Deploy factory diamond
    diamond = await run("deploy:diamond", {
      name: "ZkWalletFactoryDiamond",
      logs: false,
    });

    facets = await diamond.callStatic["facets()"]();

    expect(facets).to.have.lengthOf(1);

    facets = await run("deploy:facets", {
      facets: [{ name: "WalletFactoryFacet" }],
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

    instance = await ethers.getContractAt(
      "WalletFactoryFacet",
      diamond.address
    );

    walletDiamond = await run("deploy:diamond-with-poseidon", {
      name: "ZkWalletDiamond",
      library: poseidonT3Address,
      logs: false,
    });

    walletFacets = await run("deploy:facets-with-poseidon", {
      library: poseidonT3Address,
      facets: [{ name: "GuardianFacet" }, { name: "SemaphoreGroupsFacet" }],
      logs: false,
    });

    facetCuts = [
      {
        target: walletFacets[0].address,
        action: 0,
        selectors: Object.keys(
          walletFacets[0].contract.interface.functions
        ).map((fn) => walletFacets[0].contract.interface.getSighash(fn)),
      },
      {
        target: walletFacets[1].address,
        action: 0,
        selectors: Object.keys(
          walletFacets[1].contract.interface.functions
        ).map((fn) => walletFacets[1].contract.interface.getSighash(fn)),
      },
    ];

    //do the cut
    await walletDiamond.diamondCut(
      facetCuts,
      ethers.constants.AddressZero,
      "0x"
    );

    anotherWalletFacets = await run("deploy:facets", {
      facets: [
        { name: "ERC20ServiceFacet" },
        { name: "ERC721ServiceFacet" },
        { name: "RecoveryFacet" },
        { name: "SemaphoreFacet" },
      ],
      logs: false,
    });

    facetCuts = [
      {
        target: anotherWalletFacets[0].address,
        action: 0,
        selectors: Object.keys(
          anotherWalletFacets[0].contract.interface.functions
        ).map((fn) => anotherWalletFacets[0].contract.interface.getSighash(fn)),
      },
      {
        target: anotherWalletFacets[1].address,
        action: 0,
        selectors: Object.keys(
          anotherWalletFacets[1].contract.interface.functions
        ).map((fn) => anotherWalletFacets[1].contract.interface.getSighash(fn)),
      },
      {
        target: anotherWalletFacets[2].address,
        action: 0,
        selectors: Object.keys(
          anotherWalletFacets[2].contract.interface.functions
        ).map((fn) => anotherWalletFacets[2].contract.interface.getSighash(fn)),
      },
      {
        target: anotherWalletFacets[3].address,
        action: 0,
        selectors: Object.keys(
          anotherWalletFacets[3].contract.interface.functions
        ).map((fn) => anotherWalletFacets[3].contract.interface.getSighash(fn)),
      },
    ];

    //do the cut for wallet contract
    await walletDiamond
      .connect(owner)
      .diamondCut(facetCuts, ethers.constants.AddressZero, "0x");

    const verifier: string = "Verifier" + 20;
    const foundVerifier = deployedContracts.filter((obj) => {
      return obj.name === verifier;
    });

    verifiers = [
      { merkleTreeDepth: 20, contractAddress: foundVerifier[0].address },
    ];
  });
  describe("::ZkWalletFactoryDiamond", function () {
    it("should call functions through diamond address", async function () {
      expect(await diamond.owner()).to.equal(owner.address);
      expect(await diamond.version()).to.equal("0.1.0.alpha");
    });
    describe("::WalletFactoryFacet", function () {
      describe("#walletFactoryFacetVersion()", function () {
        it("should return the correct version", async function () {
          expect(
            await instance.callStatic["walletFactoryFacetVersion()"]()
          ).to.equal("0.1.0.alpha");
        });
      });
      describe("#getDiamond()", function () {
        it("should return diamond address", async function () {
          const transaction = await instance["setDiamond(address)"](
            walletDiamond.address
          );

          await expect(transaction)
            .to.emit(instance, "DiamondIsSet")
            .withArgs(walletDiamond.address);

          expect(await instance.callStatic["getDiamond()"]()).to.equal(
            walletDiamond.address
          );
        });
      });
      describe("#setDiamond(address)", function () {
        it("should emit event", async function () {
          const transaction = await instance["setDiamond(address)"](
            walletDiamond.address
          );

          await expect(transaction)
            .to.emit(instance, "DiamondIsSet")
            .withArgs(walletDiamond.address);
        });
        describe("reverts if..", function () {
          it("non owner", async function () {
            await expect(
              instance
                .connect(nonOwner)
                ["setDiamond(address)"](walletDiamond.address)
            ).to.revertedWith("Ownable: sender must be owner");
          });
          it("zero address", async function () {
            await expect(
              instance["setDiamond(address)"](ethers.constants.AddressZero)
            ).to.revertedWith(
              "WalletFactory: Diamond address is the zero address"
            );
          });
        });
      });
      describe("#addFacet(string,address,string)", function () {
        it("should emit event", async function () {
          const transaction = await instance["addFacet(string,address,string)"](
            walletFacets[0].name,
            walletFacets[0].address,
            "0.1.0.alpha"
          );

          await expect(transaction)
            .to.emit(instance, "FacetIsAdded")
            .withArgs(
              walletFacets[0].name,
              walletFacets[0].address,
              "0.1.0.alpha"
            );
        });
        describe("reverts if..", function () {
          it("non owner", async function () {
            await expect(
              instance
                .connect(nonOwner)
                ["addFacet(string,address,string)"](
                  walletFacets[0].name,
                  walletFacets[0].address,
                  "0.1.0.alpha"
                )
            ).to.revertedWith("Ownable: sender must be owner");
          });
          it("empty name", async function () {
            await expect(
              instance["addFacet(string,address,string)"](
                "",
                walletFacets[0].address,
                "0.1.0.alpha"
              )
            ).to.revertedWith("WalletFactory: name is empty");
          });
          it("zero address", async function () {
            await expect(
              instance["addFacet(string,address,string)"](
                walletFacets[0].name,
                ethers.constants.AddressZero,
                "0.1.0.alpha"
              )
            ).to.revertedWith(
              "WalletFactory: facetAddress is the zero address"
            );
          });
          it("empty version", async function () {
            await expect(
              instance["addFacet(string,address,string)"](
                walletFacets[0].name,
                walletFacets[0].address,
                ""
              )
            ).to.revertedWith("WalletFactory: version is empty");
          });
        });
      });
      describe("#getFacetIndex(address)", function () {
        it("should return 0", async function () {
          expect(
            await instance.callStatic["getFacetIndex(address)"](
              walletFacets[0].address
            )
          ).to.equal(0);
        });
        it("should return facet index", async function () {
          const transaction = await instance["addFacet(string,address,string)"](
            walletFacets[0].name,
            walletFacets[0].address,
            "0.1.0.alpha"
          );

          await expect(transaction)
            .to.emit(instance, "FacetIsAdded")
            .withArgs(
              walletFacets[0].name,
              walletFacets[0].address,
              "0.1.0.alpha"
            );

          expect(
            await instance.callStatic["getFacetIndex(address)"](
              walletFacets[0].address
            )
          ).to.equal(1);
        });
      });
      describe("#getFacet(uint)", function () {
        it("should return facet", async function () {
          const transaction = await instance["addFacet(string,address,string)"](
            walletFacets[0].name,
            walletFacets[0].address,
            "0.1.0.alpha"
          );

          await expect(transaction)
            .to.emit(instance, "FacetIsAdded")
            .withArgs(
              walletFacets[0].name,
              walletFacets[0].address,
              "0.1.0.alpha"
            );

          const facetIndex: number = await instance.callStatic[
            "getFacetIndex(address)"
          ](walletFacets[0].address);
          expect(facetIndex).to.equal(1);

          console.log(await instance.callStatic["getFacet(uint256)"](0));
          console.log(await instance.getFacets());
        });
      });
      describe("#getFacets()", function () {
        it("should return facets", async function () {
          for (let i = 0; i < walletFacets.length; i++) {
            const transaction = await instance[
              "addFacet(string,address,string)"
            ](walletFacets[i].name, walletFacets[i].address, "0.1.0.alpha");

            await expect(transaction)
              .to.emit(instance, "FacetIsAdded")
              .withArgs(
                walletFacets[i].name,
                walletFacets[i].address,
                "0.1.0.alpha"
              );

            const facetIndex: number = await instance.callStatic[
              "getFacetIndex(address)"
            ](walletFacets[i].address);
            expect(facetIndex).to.equal(i + 1);
          }

          for (let i = 0; i < anotherWalletFacets.length; i++) {
            const transaction = await instance[
              "addFacet(string,address,string)"
            ](
              anotherWalletFacets[i].name,
              anotherWalletFacets[i].address,
              "0.1.0.alpha"
            );

            await expect(transaction)
              .to.emit(instance, "FacetIsAdded")
              .withArgs(
                anotherWalletFacets[i].name,
                anotherWalletFacets[i].address,
                "0.1.0.alpha"
              );

            const facetIndex: number = await instance.callStatic[
              "getFacetIndex(address)"
            ](anotherWalletFacets[i].address);
            expect(facetIndex).to.equal(i + 3);
          }
          console.log(await instance.getFacets());
        });
      });
      describe("#createWallet(bytes32,address,(uint8,address)[])", function () {
        it("should emit event", async function () {
          await instance["setDiamond(address)"](walletDiamond.address);

          for (let i = 0; i < walletFacets.length; i++) {
            const transaction = await instance[
              "addFacet(string,address,string)"
            ](walletFacets[i].name, walletFacets[i].address, "0.1.0.alpha");

            await expect(transaction)
              .to.emit(instance, "FacetIsAdded")
              .withArgs(
                walletFacets[i].name,
                walletFacets[i].address,
                "0.1.0.alpha"
              );

            const facetIndex: number = await instance.callStatic[
              "getFacetIndex(address)"
            ](walletFacets[i].address);
            expect(facetIndex).to.equal(i + 1);
          }

          for (let i = 0; i < anotherWalletFacets.length; i++) {
            const transaction = await instance[
              "addFacet(string,address,string)"
            ](
              anotherWalletFacets[i].name,
              anotherWalletFacets[i].address,
              "0.1.0.alpha"
            );

            await expect(transaction)
              .to.emit(instance, "FacetIsAdded")
              .withArgs(
                anotherWalletFacets[i].name,
                anotherWalletFacets[i].address,
                "0.1.0.alpha"
              );

            const facetIndex: number = await instance.callStatic[
              "getFacetIndex(address)"
            ](anotherWalletFacets[i].address);
            expect(facetIndex).to.equal(i + 3);
          }

          await walletDiamond["initOwner(address)"](diamond.address);

          const hashId = ethers.utils.formatBytes32String("1");

          const trx = await instance[
            "createWallet(bytes32,address,(uint8,address)[])"
          ](hashId, alice.address, verifiers);

          const receipt = await trx.wait();
          const args = receipt.events[0].args;

          await expect(trx)
            .to.emit(instance, "WalletIsCreated")
            .withArgs(args[0]);
        });
      });
    });
  });
  describe("::ZkWalletDiamond", function () {
    let newAliceWallet: Contract | ZkWalletDiamond;
    const hashId: string = ethers.utils.formatBytes32String("1");

    beforeEach(async function () {
      await instance["setDiamond(address)"](walletDiamond.address);

      for (let i = 0; i < walletFacets.length; i++) {
        await instance["addFacet(string,address,string)"](
          walletFacets[i].name,
          walletFacets[i].address,
          "0.1.0.alpha"
        );
      }

      for (let i = 0; i < anotherWalletFacets.length; i++) {
        await instance["addFacet(string,address,string)"](
          anotherWalletFacets[i].name,
          anotherWalletFacets[i].address,
          "0.1.0.alpha"
        );
      }

      await walletDiamond["initOwner(address)"](diamond.address);

      const tx = await instance[
        "createWallet(bytes32,address,(uint8,address)[])"
      ](hashId, alice.address, verifiers);

      const receipt = await tx.wait();
      newAliceWallet = await ethers.getContractAt(
        "ZkWalletDiamond",
        receipt.events[0].args[0]
      );
    });
    describe("#owner()", function () {
      it("alice should be owner", async function () {
        expect(await newAliceWallet.owner()).to.equal(alice.address);
      });
    });
    describe("#facets()", function () {
      it("should have facets", async function () {
        console.log(await newAliceWallet.facets());
      });
    });
  });
});
