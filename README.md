# zkSocialRecoveryWallet circuits and contracts

This folder was generated using [Hardhat](https://github.com/NomicFoundation/hardhat) and contains all the smart contracts used in the zkSocialRecoveryWallet application.

## Install dependencies

```bash
yarn install
```

## Prepare for test and deployment

Setup Husky to format code on commit:

```bash
yarn prepare
```

Link local packages and install remaining dependencies via Lerna:
```bash
yarn lerna bootstrap
```
Compile contracts via Hardhat:

```bash
yarn compile
```

Automatically upgrade dependencies with yarn-up:

```bash
yarn upgrade-dependencies
```

##  Run tests

Test contracts with Hardhat and generate gas report using `hardhat-gas-reporter`:

```bash
yarn test
```

###  Test coverage
Generate a code coverage report using `solidity-coverage`:

```bash
yarn coverage
```

## Publication

Publish packages via Lerna:

```bash
yarn lerna-publish
```

## Deployment

### All contracts

```bash
yarn deploy:all --network harmonyTestnet
```

### Diamond

```bash
yarn deploy:diamond --name: 'WalletFactoryDiamond'
```

```bash
yarn deploy:diamond --name: 'SimplicyWalletDiamond'
```

### Facets

```bash
yarn deploy:facets --facets '[{"name": "ERC20Facet"}, {"name": "ERC721Facet"}, {"name": "RecoveryFacet"}, {"name": "WalletFactoryFacet"}, {"name": "SemaphoreFacet"}, {"name": "SemaphoreVotingFacet"}]'
```

### Facets with poseidon

```bash
yarn deploy:poseidonT3 --name: 'PoseidonT3'
```

```bash
yarn deploy:facet-with-poseidon --facets '[{"name": "GuardianFacet"}, {"name": "SemaphoreGroupsFacet"}]' --library: ${poseidonT3Address}
```

## File Structure

```text
├── build
│   ├── snark-artifacts
│   │   ├── semaphore.wasm
│   │   ├── semaphore.zkey
├── circuits
│   ├── semaphore.circom
│   ├── ecdh.circom
│   ├── tree
│   │   ├── hasherPoseidon.circom
│   │   ├── poseidon
│   │   │   ├── poseidonHashT3.circom
│   │   │   ├── poseidonHashT4.circom
│   │   │   ├── poseidonHashT5.circom
│   │   │   ├── poseidonHashT6.circom
├── contracts
│   ├── contracts
│   │   ├── diamond
│   │   │   ├── ISimplicyWalletDiamond.sol
│   │   │   ├── IWalletFactoryDiamond.sol
│   │   │   ├── SimplicyWalletDiamond.sol
│   │   │   ├── WalletFactoryDiamond.sol
│   │   ├── facets
│   │   │   ├── ERC20Facet.sol
│   │   │   ├── ERC721Facet.sol
│   │   │   ├── GuardianFacet.sol
│   │   │   ├── RecoveryFacet.sol
│   │   │   ├── SemaphoreFacet.sol
│   │   │   ├── SemaphoreGroupsFacet.sol
│   │   │   ├── WalletFactoryFacet.sol
│   │   ├── guardian
│   │   │   ├── Guardian.sol
│   │   │   ├── GuardianInternal.sol
│   │   │   ├── GuardianStorage.sol
│   │   │   ├── IGuardian.sol
│   │   │   ├── IGuardianInternal.sol
│   │   ├── interfaces
│   │   │   ├── IGuardianFacet.sol
│   │   │   ├── IVerifier.sol
│   │   │   ├── IzkWallet.sol
│   │   ├── recovery
│   │   │   ├── IRecovery.sol
│   │   │   ├── IRecoveryInternal.sol
│   │   │   ├── Recovery.sol
│   │   │   ├── RecoveryInternal.sol
│   │   │   ├── RecoveryMock.sol
│   │   │   ├── RecoveryStorage.sol
│   │   ├── semaphore
│   │   │   ├── base
│   │   │   │   ├── SemaphoreCoreBase
│   │   │   │   │   ├── ISemaphoreCoreBase.sol
│   │   │   │   │   ├── ISemaphoreCoreBaseInternal.sol
│   │   │   │   │   ├── SemaphoreCoreBase.sol
│   │   │   │   │   ├── SemaphoreCoreBaseInternal.sol
│   │   │   │   │   ├── SemaphoreCoreBaseMock.sol
│   │   │   │   │   ├── SemaphoreCoreBaseStorage.sol
│   │   │   │   ├── SemaphoreGroupsBase
│   │   │   │   │   ├── ISemaphoreGroupsBase.sol
│   │   │   │   │   ├── ISemaphoreGroupsInternal.sol
│   │   │   │   │   ├── SemaphoreGroupsBase.sol
│   │   │   │   │   ├── SemaphoreGroupsBaseInternal.sol
│   │   │   │   │   ├── SemaphoreGroupsBaseMock.sol
│   │   │   │   │   ├── SemaphoreGroupsBaseStorage.sol
│   │   │   ├── extensions
│   │   │   │   ├── SemaphoreVoting
│   │   │   │   │   ├── ISemaphoreVoting.sol
│   │   │   │   │   ├── ISemaphoreVotingInternal.sol
│   │   │   │   │   ├── SemaphoreVoting.sol
│   │   │   │   │   ├── SemaphoreVotingInternal.sol
│   │   │   │   │   ├── SemaphoreVotingStorage.sol
│   │   │   ├── ISemaphore.sol
│   │   │   ├── ISemaphoreGroups.sol
│   │   │   ├── ISemaphoreInternal.sol
│   │   │   ├── Semaphore.sol
│   │   │   ├── SemaphoreInternal.sol
│   │   │   ├── SemaphoreStorage.sol
│   │   ├── token
│   │   │   ├── ERC20
│   │   │   │   ├── ERC20Service.sol
│   │   │   │   ├── ERC20ServiceInternal.sol
│   │   │   │   ├── ERC20ServiceMock.sol
│   │   │   │   ├── ERC20ServiceStorage.sol
│   │   │   │   ├── IERC20Service.sol
│   │   │   │   ├── IERC20ServiceInternal.sol
│   │   │   ├── ERC721
│   │   │   │   ├── ERC721Service.sol
│   │   │   │   ├── ERC721ServiceInternal.sol
│   │   │   │   ├── ERC721ServiceStorage.sol
│   │   │   │   ├── IERC721Service.sol
│   │   │   │   ├── IERC721ServiceInternal.sol
│   │   │   ├── ERC1155
│   │   │   │   ├── ERC1155ServiceStorage.sol
│   │   ├── utils
│   │   │   ├── cryptography
│   │   │   │   ├── IncrementalBinaryTree
│   │   │   │   │   ├── IIncrementalBinaryTree.sol
│   │   │   │   │   ├── IIncrementalBinaryTreeInternal.sol
│   │   │   │   │   ├── IncrementalBinaryTreeInternal.sol
│   │   │   │   │   ├── IncrementalBinaryTreeStorage.sol
│   │   │   │   ├── Hashes.sol
│   │   │   ├── Constant.sol
│   │   ├── verifier
│   │   │   ├── Verifier16.sol
│   │   │   ├── Verifier17.sol
│   │   │   ├── Verifier18.sol
│   │   │   ├── Verifier19.sol
│   │   │   ├── Verifier20.sol
│   │   │   ├── Verifier21.sol
│   │   │   ├── Verifier22.sol
│   │   │   ├── Verifier23.sol
│   │   │   ├── Verifier24.sol
│   │   │   ├── Verifier25.sol
│   │   │   ├── Verifier26.sol
│   │   │   ├── Verifier27.sol
│   │   │   ├── Verifier28.sol
│   │   │   ├── Verifier29.sol
│   │   │   ├── Verifier30.sol
│   │   │   ├── Verifier31.sol
│   │   │   ├── Verifier32.sol
│   │   ├── wallet
│   │   │   ├── factory
│   │   │   │   ├── IWalletFactory.sol
│   │   │   │   ├── IWalletFactoryInternal.sol
│   │   │   │   ├── WalletFactory.sol
│   │   │   │   ├── WalletFactoryInternal.sol
│   │   │   │   ├── WalletFactoryStorage.sol
```

## Deployment on Devnet
```
network: harmonyDevnet
deployer 0xA023A773610B3DaD60f3c5787101D4681110e861
Account balance: 10007745809330000000000
aliceWallet 0xBa15895E78550495Bb8a9979ABCb106b2EdC9F63
Account balance: 10007753729720000000000
bobWallet 0x8Fd1C63CCc49E316CB9fdeB45f8Fb3944aBed4aC
Account balance: 10008998565590000000000
Verifier16 contract has been deployed to: 0x8d2171b7dDC7F6B0f04657835a6b19F04B821353
Verifier17 contract has been deployed to: 0x64D87dC944Fb6956Ff09b4a1da2BfBFf4F78f976
Verifier18 contract has been deployed to: 0xa8007c877333508A07eA9f16CF2a2415057Ec0BC
Verifier19 contract has been deployed to: 0x434a85Da614E439929e7480464B18c1cea043B19
Verifier20 contract has been deployed to: 0x21176AA38497bdeab3CdB4368CFF53c428B001f7
Verifier21 contract has been deployed to: 0x48164EcB1CB426C72DCE0421F4426daE264724a7
Verifier22 contract has been deployed to: 0x50c3B09c4b478bd88D0ED14B056AcaFb679Bd345
Verifier23 contract has been deployed to: 0xbDc6e16F514e8d8098ABc90Ab40482d5CbD7c9Aa
Verifier24 contract has been deployed to: 0x6c3Ebf4d06e9595248fA7cc506ad87CffE445dee
Verifier25 contract has been deployed to: 0x6fCe423A2fDDe6788a27a99b59e0Cb40579CE988
Verifier26 contract has been deployed to: 0xCD81D914F1032F7d4c4AB088546c7d70A438cFC3
Verifier27 contract has been deployed to: 0x9eE3cC20Eb1e6a695192A9EDB0512694d31d81bf
Verifier28 contract has been deployed to: 0x18145aa8e5eb71959EaAC9Be2B383A070E80300A
Verifier29 contract has been deployed to: 0x5a6A9c1412179ef061CDF328E6b66BB8c5F337B6
Verifier30 contract has been deployed to: 0x532E815c80198b78512858F4cf125be4858c5e9A
Verifier31 contract has been deployed to: 0xf3a727DFC9eC0ca43934Aa5c9424EeB040C9Fb7c
Verifier32 contract has been deployed to: 0xaA048F0280d8F8B72f6E0Ed3D17E91ba1d1a8387
WalletFactoryDiamond contract has been deployed to: 0xb9853e45b3537975035159ece4E9F53EC18480Fd
[ { name: 'WalletFactoryFacet' }, { name: 'CountersFacet' } ]
WalletFactoryFacet contract has been deployed to: 0x58aD3eEFB1832ef971CDe8e45A7239E7dd8f9444
CountersFacet contract has been deployed to: 0x02C1384694653D88919a1eF6EB8d3906a731640b
SimplicyWalletDiamond contract has been deployed to: 0x2338c67c687F3d6A28C27Df15325F06A6BF1C627
PoseidonT3 contract has been deployed to: 0x1fB6C0Cc4b846a4A25B41f3AAD59b4C719474E3F
[ { name: 'GuardianFacet' }, { name: 'SemaphoreGroupsFacet' } ]
GuardianFacet contract has been deployed to: 0x3d4370D915c52E801963533E0aC54EAF4a57177b
SemaphoreGroupsFacet contract has been deployed to: 0x7bA44FAF27B18d04Af0950f30617B5AAACceC038
[
  { name: 'ERC20Facet' },
  { name: 'ERC721Facet' },
  { name: 'RecoveryFacet' },
  { name: 'SemaphoreFacet' },
  { name: 'SemaphoreVotingFacet' }
]
ERC20Facet contract has been deployed to: 0x5BA6985e2F04cA4Ef362dCFF0Ac793E1715F2E10
ERC721Facet contract has been deployed to: 0xEA33dC1D03A626C899dfA6bD9BA61AcEce886AF1
RecoveryFacet contract has been deployed to: 0xC509433465D6e3b60CA192e81659BBEDffE7fd3b
SemaphoreFacet contract has been deployed to: 0xF6f822A0aaE0CDd6dDb6c0BA7284a74B006A0824
SemaphoreVotingFacet contract has been deployed to: 0x43133D828f1E4c209eB60B4fEbD01221C72E4Ca4
WalletFactoryDiamond version: 0.0.1
walletFactoryFacetVersion: 0.0.1
SimplicyWalletDiamond version: 0.0.1
#addDiamond====================================
txEvent: [
  {
    transactionIndex: 0,
    blockNumber: 6700748,
    transactionHash: '0xc9a2505310da12e72561a6bdcc734c5a88d0f87a414880095d884247ee84e279',
    address: '0xb9853e45b3537975035159ece4E9F53EC18480Fd',
    topics: [
      '0x4703b806ce253ec467a0cec6e96db61459e46d554e98ae0c96e6bffc747e3018'
    ],
    data: '0x0000000000000000000000002338c67c687f3d6a28c27df15325f06a6bf1c627',
    logIndex: 0,
    blockHash: '0xc5ab029a0f7cd96bca1bea5ea77dba31f6676dc9822601f5303d05429364da8c',
    args: [
      '0x2338c67c687F3d6A28C27Df15325F06A6BF1C627',
      wallet: '0x2338c67c687F3d6A28C27Df15325F06A6BF1C627'
    ],
    decode: [Function (anonymous)],
    event: 'DiamondIsSet',
    eventSignature: 'DiamondIsSet(address)',
    removeListener: [Function (anonymous)],
    getBlock: [Function (anonymous)],
    getTransaction: [Function (anonymous)],
    getTransactionReceipt: [Function (anonymous)]
  }
]
#addFacet==================================== 5
Verifier20 0x21176AA38497bdeab3CdB4368CFF53c428B001f7
Alice setVerifiers transaction hash:  0x373cd09c8caee24111fd00bb4a1990e3f252d4f545c2308ca2af46b6d9f29eb4
Bob setVerifiers transaction hash:  0xaafbb9e79f04fe1fbc1d2d7c516a32c637be99fe891519b113f48bba7fd27439
✨  Done in 460.53s.
```

## Deployment on Testnet
```

```

## Contribute

zkWallet Contracts exists thanks to its contributors. There are many ways you can participate and help build high quality software. Check out the [contribution guide](CONTRIBUTING.md)!

## License

zkWallet Contracts is released under the [Apache 2.0 License](LICENSE).