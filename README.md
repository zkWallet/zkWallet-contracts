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
Account balance: 10008879936080000000000
aliceWallet 0xBa15895E78550495Bb8a9979ABCb106b2EdC9F63
Account balance: 10008277444070000000000
bobWallet 0x8Fd1C63CCc49E316CB9fdeB45f8Fb3944aBed4aC
Account balance: 10009759814000000000000
Verifier16 contract has been deployed to: 0x8A2b8203aec1b11d130A7Db6D0D87D5c44995095
Verifier17 contract has been deployed to: 0x65f00e0df2a6c51c3014Cc231DC501BaA706b6ea
Verifier18 contract has been deployed to: 0xF2AcC0D3cBf8ACb6c37f59cBFd3E2AFff751Ce2a
Verifier19 contract has been deployed to: 0x4F33CD3bD38F0373594FaA42A4aE1a893e0f6A49
Verifier20 contract has been deployed to: 0x3259Af63799D2b3fF46EFC3C72626484F792f42b
Verifier21 contract has been deployed to: 0xaCdA7828C9300cd7B2B89F429CAaeec2D04CfCdc
Verifier22 contract has been deployed to: 0xCF97AeC8FbE72162b32E4EE6e3e1B14221293B92
Verifier23 contract has been deployed to: 0xa3BF9eAf67bCC620eE816E0539A1AC0573629710
Verifier24 contract has been deployed to: 0x19bE795aAfEd702EE152F3caCf074882e2824F5F
Verifier25 contract has been deployed to: 0x2A7f2AF05431De3A88Bb3F545E1e39E45fD0815A
Verifier26 contract has been deployed to: 0xF4918aF34B1Acbe8fB134d0CE0acd7D22Dd4C871
Verifier27 contract has been deployed to: 0xf7480Aff97dcF30833a738E00e4d104A0A29D5c8
Verifier28 contract has been deployed to: 0x5eDD93fCa95496A2bf6D1C95f1dB47302f80f0DF
Verifier29 contract has been deployed to: 0x92a829f24114AD40dD19B2e00CE84457d63B7756
Verifier30 contract has been deployed to: 0x42B456fac07492DeafF822b31372D13eD8CdD051
Verifier31 contract has been deployed to: 0x08F784a2f7741F81179Eb489f6916dc69bC5829c
Verifier32 contract has been deployed to: 0x5332243d6e870FdFfaC2c64F11c1C1D9bC59ea7b
WalletFactoryDiamond contract has been deployed to: 0xee6637D142A6A7f0a032aA3f17b14b07821d1407
[ { name: 'WalletFactoryFacet' }, { name: 'CountersFacet' } ]
WalletFactoryFacet contract has been deployed to: 0xF140101392132f00C4F974fF001594779F27e866
CountersFacet contract has been deployed to: 0x42C692f92F3872A5129D86AB84C782e2338597f1
SimplicyWalletDiamond contract has been deployed to: 0xA122cd999ff7f03D6AC9B986eBC888425195F1a7
PoseidonT3 contract has been deployed to: 0x90682d322415e1833E566A3747A361F0f69c5f05
[
  { name: 'ERC20Facet' },
  { name: 'ERC721Facet' },
  { name: 'RecoveryFacet' },
  { name: 'SemaphoreFacet' },
  { name: 'SemaphoreVotingFacet' }
]
ERC20Facet contract has been deployed to: 0x2Fd8f53Ba5D32A181D92e609fBf4A396fcA38de3
ERC721Facet contract has been deployed to: 0x1Fa26E1146AeCe5A617D79Df43132A21d58cAcb1
RecoveryFacet contract has been deployed to: 0xc12eF7d779bE1EaAF6d29fA5B5F76EBcFb4a3c5a
SemaphoreFacet contract has been deployed to: 0x32A7C90b35A424ae390ad02dC70C5dBfE40d12B9
SemaphoreVotingFacet contract has been deployed to: 0x9F1C425CC7ef7DfDC963Ff4562132dc276e3B094
WalletFactoryDiamond version: 0.0.1
walletFactoryFacetVersion: 0.0.1
SimplicyWalletDiamond version: 0.0.1
#addFacet==================================== 5
Verifier20 0x3259Af63799D2b3fF46EFC3C72626484F792f42b
Alice setVerifiers transaction hash:  0x451efad5993a47d155a17b573b2c7b0b9226c364f3c730ca5d06c424e943e6c9
Bob setVerifiers transaction hash:  0xc9db152c18348593eff6a8429dfbb7cb128021a7fe7b4eaace7579e186d6efaa
✨  Done in 411.77s.
```

## Deployment on Testnet
```

```

## Contribute

zkWallet Contracts exists thanks to its contributors. There are many ways you can participate and help build high quality software. Check out the [contribution guide](CONTRIBUTING.md)!

## License

zkWallet Contracts is released under the [Apache 2.0 License](LICENSE).