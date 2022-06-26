import { describeFilter } from "@solidstate/library";
import { ICounters } from "@simplicy/typechain-types";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";

export interface CountersBehaviorArgs {
  getFirstIndex: () => Promise<BigNumber>;
  current: (index: BigNumber) => Promise<ContractTransaction>;
  increment: (index: BigNumber) => Promise<ContractTransaction>;
  decrement: (index: BigNumber) => Promise<ContractTransaction>;
  reset: (index: BigNumber) => Promise<ContractTransaction>;
}

export function describeBehaviorOfCounters(
  deploy: () => Promise<ICounters>,
  { getFirstIndex, current, increment, decrement, reset }: CountersBehaviorArgs,
  skips?: string[]
) {
  const describe = describeFilter(skips);

  describe("::Counters", function () {
    let instance: ICounters;
    let firstIndex: BigNumber;

    beforeEach(async function () {
      instance = await deploy();
      firstIndex = await getFirstIndex();
    });
    describe("#current(uint256)", function () {
      it("returns the current counter", async function () {
        expect(
          await instance.callStatic["current(uint256)"](firstIndex)
        ).to.equal("0");
      });
    });
    describe("#increment(uint256)", function () {
      it("should emit event", async function () {
        const transaction = await instance["increment(uint256)"](firstIndex);

        await expect(transaction)
          .to.emit(instance, "Incremented")
          .withArgs("1", "1");
      });
      describe("#current(uint256)", function () {
        it("returns the current counter", async function () {
          await instance["increment(uint256)"](firstIndex);
          expect(
            await instance.callStatic["current(uint256)"](firstIndex)
          ).to.equal("1");
        });
      });
      describe("reverts if", function () {
        it("zero index", async function () {
          await expect(instance["increment(uint256)"](0)).to.be.revertedWith(
            "Counters: INDEX_OUT_OF_BOUNDS"
          );
        });
      });
    });
    describe("#decrement(uint256)", function () {
      it("should emit event", async function () {
        await instance.increment(firstIndex);

        const transaction = await instance["decrement(uint256)"](firstIndex);

        await expect(transaction)
          .to.emit(instance, "Decremented")
          .withArgs("1", "0");
      });
      describe("#current(uint256)", function () {
        it("returns the current counter", async function () {
          await instance.increment(firstIndex);

          await instance["decrement(uint256)"](firstIndex);
          expect(
            await instance.callStatic["current(uint256)"](firstIndex)
          ).to.equal("0");
        });
      });
      describe("reverts if", function () {
        it("zero index", async function () {
          await expect(instance["decrement(uint256)"](0)).to.be.revertedWith(
            "Counters: INDEX_OUT_OF_BOUNDS"
          );
        });
        it("non counter", async function () {
          await expect(
            instance["decrement(uint256)"](firstIndex)
          ).to.be.revertedWith("Counters: COUNTER_NOT_FOUND");
        });
      });
    });
    describe("#reset(uint256)", function () {
      it("should emit event", async function () {
        await instance.increment(firstIndex);

        const transaction = await instance["reset(uint256)"](firstIndex);

        await expect(transaction).to.emit(instance, "Reset").withArgs("1", "0");
      });
      describe("#current(uint256)", function () {
        it("returns the current counter", async function () {
          await instance.increment(firstIndex);

          await instance["reset(uint256)"](firstIndex);
          expect(
            await instance.callStatic["current(uint256)"](firstIndex)
          ).to.equal("0");
        });
      });
      describe("reverts if", function () {
        it("zero index", async function () {
          await expect(instance["reset(uint256)"](0)).to.be.revertedWith(
            "Counters: INDEX_OUT_OF_BOUNDS"
          );
        });
        it("non counter", async function () {
          await expect(
            instance["reset(uint256)"](firstIndex)
          ).to.be.revertedWith("Counters: COUNTER_NOT_FOUND");
        });
      });
    });
  });
}
