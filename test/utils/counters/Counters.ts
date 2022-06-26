import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { describeBehaviorOfCounters } from "@simplicy/spec";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { CountersMock__factory, CountersMock } from "@simplicy/typechain-types";

describe.only("CountersMock", function () {
  let owner: SignerWithAddress;
  let instance: CountersMock;
  let firstIndex: BigNumber;

  before(async function () {
    [owner] = await ethers.getSigners();
    firstIndex = ethers.constants.One;
  });

  beforeEach(async function () {
    instance = await new CountersMock__factory(owner).deploy();
  });
  describeBehaviorOfCounters(async () => instance, {
    getFirstIndex: async () => firstIndex,
    current: (index: BigNumber) => instance.current(index),
    increment: (index: BigNumber) => instance.increment(index),
    decrement: (index: BigNumber) => instance.decrement(index),
    reset: (index: BigNumber) => instance.reset(index),
  });
});
