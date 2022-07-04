import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import {
  IGuardianFacet,
  ISemaphoreFacet,
  ISemaphoreGroupsFacet,
  IERC20ServiceFacet,
  IERC721ServiceFacet,
  IEtherServiceFacet,
  IRecoveryFacet,
  IWalletFactoryFacet,
  IZkWalletDiamond,
  ZkWalletDiamond,
  ZkWalletDiamond__factory,
  ZkWalletFactoryDiamond,
} from "@simplicy/typechain-types";
import { expect } from "chai";
import { ethers, run } from "hardhat";
import { DeployedContract, Verifier, Facet } from "../../types";

describe("ZkWalletFactoryDiamond", function () {
  let owner: SignerWithAddress;
  let nonOwner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  let diamond: ZkWalletFactoryDiamond;
  let instance: Contract | IWalletFactoryFacet;
  let aliceGuardianInstance: Contract | IGuardianFacet;
  let aliceSemaphoreInstance: Contract | ISemaphoreFacet;
  let aliceGroupsInstance: Contract | ISemaphoreGroupsFacet;
  let aliceERC20Instance: Contract | IERC20ServiceFacet;
  let aliceERC721Instance: Contract | IERC721ServiceFacet;
  let aliceRecoveryInstance: Contract | IRecoveryFacet;
  let aliceEtherInstance: Contract | IEtherServiceFacet;

  let walletDiamond: IZkWalletDiamond;

  let facetCuts: { target: string; action: number; selectors: any }[] = [];

  let facets: DeployedContract[] | any;
  let walletFacets: DeployedContract[] | any;
  let anotherWalletFacets: DeployedContract[] | any;

  const deployedContracts: { name: string; address: string }[] = [];
  let verifiers: Verifier[] = [];
  let verifier20: string;

  const depth = Number(process.env.TREE_DEPTH);

  before(async function () {
    [owner, nonOwner, alice, bob] = await ethers.getSigners();
  });

  beforeEach(async function () {
    diamond = await run("deploy:diamond", {
      name: "ZkWalletFactoryDiamond",
      logs: false,
    });

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

    walletFacets = await run("deploy:facets-with-poseidon", {
      library: poseidonT3Address,
      facets: [{ name: "GuardianFacet" }, { name: "SemaphoreGroupsFacet" }],
      logs: false,
    });

    anotherWalletFacets = await run("deploy:facets", {
      facets: [
        { name: "RecoveryFacet" },
        { name: "ERC20ServiceFacet" },
        { name: "ERC721ServiceFacet" },
        { name: "SemaphoreFacet" },
        { name: "EtherServiceFacet" },
      ],
      logs: false,
    });

    const newFacets: Facet[] = [
      {
        name: "GuardianFacet",
        facetAddress: walletFacets[0].address,
        version: "0.1.0.alpha",
      },
      {
        name: "SemaphoreGroupsFacet",
        facetAddress: walletFacets[1].address,
        version: "0.1.0.alpha",
      },
      {
        name: "ERC20ServiceFacet",
        facetAddress: anotherWalletFacets[0].address,
        version: "0.1.0.alpha",
      },
      {
        name: "ERC721ServiceFacet",
        facetAddress: anotherWalletFacets[1].address,
        version: "0.1.0.alpha",
      },
      {
        name: "RecoveryFacet",
        facetAddress: anotherWalletFacets[2].address,
        version: "0.1.0.alpha",
      },
      {
        name: "SemaphoreFacet",
        facetAddress: anotherWalletFacets[3].address,
        version: "0.1.0.alpha",
      },
      {
        name: "EtherServiceFacet",
        facetAddress: anotherWalletFacets[4].address,
        version: "0.1.0.alpha",
      },
    ];

    const verifier: string = "Verifier" + 20;
    const foundVerifier = deployedContracts.filter((obj) => {
      return obj.name === verifier;
    });

    verifier20 = foundVerifier[0].address;
    console.log("verifier20", verifier20);

    verifiers = [
      {
        merkleTreeDepth: depth,
        contractAddress: foundVerifier[0].address,
      },
    ];

    // console.log("verifiers", verifiers);
    // console.log("newFacets", newFacets);

    walletDiamond = await new ZkWalletDiamond__factory(owner).deploy(
      owner.address,
      newFacets,
      verifiers
    );
    console.log(walletDiamond);
    console.log("walletDiamond.address", walletDiamond.address);
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
          // await instance["setDiamond(address)"](walletDiamond.address);

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

          const hashId = ethers.utils.formatBytes32String("1");

          const trx = await instance[
            "createWallet(bytes32,address,(uint8,address)[])"
          ](hashId, alice.address, verifiers);

          const receipt = await trx.wait();
          console.log("Alice address", receipt.events[0].address);

          await expect(trx).to.emit(instance, "WalletIsCreated");
        });
      });
    });
  });
  describe("::ZkWalletDiamond", function () {
    let newAliceWallet: Contract | ZkWalletDiamond;
    const hashId: string = ethers.utils.formatBytes32String("1");

    beforeEach(async function () {
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

      const tx = await instance[
        "createWallet(bytes32,address,(uint8,address)[])"
      ](hashId, alice.address, verifiers);

      const receipt = await tx.wait();
      newAliceWallet = await ethers.getContractAt(
        "ZkWalletDiamond",
        receipt.events[0].address
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
      describe("::GuardianFacet", function () {
        beforeEach(async function () {
          aliceGuardianInstance = await ethers.getContractAt(
            "GuardianFacet",
            newAliceWallet.address
          );
        });
        describe("#guardianFacetVersion()", function () {
          it("should return the correct version", async function () {
            expect(
              await aliceGuardianInstance.callStatic["guardianFacetVersion()"]()
            ).to.equal("0.1.0.alpha");
          });
        });
      });
      describe("::SemaphoreGroupFacet", function () {
        beforeEach(async function () {
          aliceGroupsInstance = await ethers.getContractAt(
            "SemaphoreGroupsFacet",
            newAliceWallet.address
          );
        });
        describe("#semaphoreGroupsFacetVersion()", function () {
          it("should return the correct version", async function () {
            expect(
              await aliceGroupsInstance.callStatic[
                "semaphoreGroupsFacetVersion()"
              ]()
            ).to.equal("0.1.0.alpha");
          });
        });
        // describe("#getGroupAdmin(uint256)", function () {
        //   it("should return the correct group admin", async function () {
        //     expect(
        //       await aliceGroupsInstance.callStatic["getGroupAdmin(uint256)"](1)
        //     ).to.equal(owner.address);
        //   });
        // });
      });
      describe("::ERC20ServiceFacet", function () {
        beforeEach(async function () {
          aliceERC20Instance = await ethers.getContractAt(
            "ERC20ServiceFacet",
            newAliceWallet.address
          );
        });
        describe("#erc20ServiceFacetVersion()", function () {
          it("should return the correct version", async function () {
            expect(
              await aliceERC20Instance.callStatic[
                "erc20ServiceFacetVersion()"
              ]()
            ).to.equal("0.1.0.alpha");
          });
        });
      });
      describe("::ERC721ServiceFacet", function () {
        beforeEach(async function () {
          aliceERC721Instance = await ethers.getContractAt(
            "ERC721ServiceFacet",
            newAliceWallet.address
          );
        });
        describe("#erc721ServiceFacetVersion()", function () {
          it("should return the correct version", async function () {
            expect(
              await aliceERC721Instance.callStatic[
                "erc721ServiceFacetVersion()"
              ]()
            ).to.equal("0.1.0.alpha");
          });
        });
      });
      describe("::RecoveryFacet", function () {
        beforeEach(async function () {
          aliceRecoveryInstance = await ethers.getContractAt(
            "RecoveryFacet",
            newAliceWallet.address
          );
        });
        describe("#recoveryFacetVersion()", function () {
          it("should return the correct version", async function () {
            expect(
              await aliceRecoveryInstance.callStatic["recoveryFacetVersion()"]()
            ).to.equal("0.1.0.alpha");
          });
        });
      });
      describe("::SemaphoreFacet", function () {
        beforeEach(async function () {
          aliceSemaphoreInstance = await ethers.getContractAt(
            "SemaphoreFacet",
            newAliceWallet.address
          );
        });
        describe("#semaphoreFacetVersion()", function () {
          it("should return the correct version", async function () {
            expect(
              await aliceSemaphoreInstance.callStatic[
                "semaphoreFacetVersion()"
              ]()
            ).to.equal("0.1.0.alpha");
          });
        });
        describe("#getVerifier(uint8)", function () {
          it("should return the correct verifier address", async function () {
            expect(
              await aliceSemaphoreInstance.callStatic["getVerifier(uint8)"](20)
            ).to.equal(verifier20);
          });
        });
      });
      describe("::EtherServiceFacet", function () {
        let amountInEther = "0.01";

        beforeEach(async function () {
          aliceEtherInstance = await ethers.getContractAt(
            "EtherServiceFacet",
            newAliceWallet.address
          );

          const tx = {
            to: walletDiamond.address,
            value: ethers.utils.parseEther(amountInEther),
          };

          alice.sendTransaction(tx).then((txObj) => {
            console.log("txHash", txObj.hash);
          });
          describe("#etherServiceFacetVersion()", function () {
            it("should return the correct version", async function () {
              expect(
                await aliceEtherInstance.callStatic[
                  "etherServiceFacetVersion()"
                ]()
              ).to.equal("0.1.0.alpha");
            });
          });
          describe("#getEtherBalance()", function () {
            it("should return the correct balance", async function () {
              expect(
                await aliceEtherInstance.callStatic["getEtherBalance()"]()
              ).to.equal(amountInEther);
            });
          });
          describe("#transferEther(to, amount)", function () {
            it("should emit event", async function () {
              const tx = await aliceEtherInstance.callStatic[
                "transferEther(address,uint256)"
              ](bob.address, ethers.utils.parseEther("0.01"));

              const receipt = await tx.wait();
              console.log(receipt);

              await expect(tx)
                .to.emit(aliceEtherInstance, "EtherTransfered")
                .withArgs(bob.address, ethers.utils.parseEther("0.01"));

              expect(
                await aliceEtherInstance.callStatic["getEtherBalance()"]()
              ).to.equal(amountInEther);
            });
          });
        });
      });
    });
  });
});
