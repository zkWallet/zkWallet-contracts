# zkWallet circuits and contracts

This repository was generated using [Hardhat](https://github.com/NomicFoundation/hardhat) and contains all the smart contracts used in the zkSocialRecoveryWallet application.

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
Account balance: 10004909274830000000000
ZkWalletFactoryDiamond contract has been deployed to: 0xF64a874474EFAe562B3Ccec0d081C64b862696ed
PoseidonT3 contract has been deployed to: 0x56924BaA61e1F121218282336156Cc170c41B051
Verifier16 contract has been deployed to: 0xDF84B7D104276bE843a81FA0e7Ce4e7e1F73CA7E
Verifier17 contract has been deployed to: 0x79c905Ce62b38100C2eA7C5A40836960d56f7420
Verifier18 contract has been deployed to: 0x298DeD46C68639Bbe9b9CbDFEb63Aa82EcDE75Aa
Verifier19 contract has been deployed to: 0x27C673cdcD056FBb93F701438aab771d3C00634e
Verifier20 contract has been deployed to: 0x4c469d74a65BCfBA0D9500457Cc76Daff220098a
Verifier21 contract has been deployed to: 0xbFeB824187A9E046cA37264e234E987f5CFE10F8
Verifier22 contract has been deployed to: 0x08cbB7504E4227D4BfaE9B50f765dFe5404CDE8a
Verifier23 contract has been deployed to: 0xdCa536459b8eFc88cDD8e6d84a080694a687E3C2
Verifier24 contract has been deployed to: 0xA8C8255D0565eD61bf9ED024fA6Ec796764B9D26
Verifier25 contract has been deployed to: 0xAfacB48B9cdB93BadFe8Baae0543F4BD95460739
Verifier26 contract has been deployed to: 0xf6Df4abe7e909789326E4c023Ecf33D1108FF601
Verifier27 contract has been deployed to: 0xe5d7529917041ab3Bd2e67EAD06B54CD04b13aD3
Verifier28 contract has been deployed to: 0x2E4ea96cbF43BF4BBb699214eA988f28F17F3fF3
Verifier29 contract has been deployed to: 0x7445b0B183b5a74104fcF1A8fE70F9518c0D4605
Verifier30 contract has been deployed to: 0xD37b6C9Bd8dC97F7021856154D9773e3Df43995C
Verifier31 contract has been deployed to: 0x541252940a7F2e0b4E0Ab38737c9376c931a66C6
Verifier32 contract has been deployed to: 0xe0925FEf5F260b40bb64aDd86DFBFE7Da76B007F
[ { name: 'WalletFactoryFacet' } ]
WalletFactoryFacet contract has been deployed to: 0x878821Ef4f0F3Ab6e39bb342218C7497d9523cd1
[ { name: 'GuardianFacet' }, { name: 'SemaphoreGroupsFacet' } ]
GuardianFacet contract has been deployed to: 0x13522F1f4968BD85cDE1294536774430551518dB
SemaphoreGroupsFacet contract has been deployed to: 0x20Aea34C2441539D5A2497f2DF98bB93575c18ac
[
  { name: 'RecoveryFacet' },
  { name: 'ERC20ServiceFacet' },
  { name: 'ERC721ServiceFacet' },
  { name: 'SemaphoreFacet' },
  { name: 'EtherServiceFacet' }
]
RecoveryFacet contract has been deployed to: 0x8d9CB131635555E812418354648c1B645796031a
ERC20ServiceFacet contract has been deployed to: 0x18b61b36FC991c095765Ed2c1D04E0875cDc21ac
ERC721ServiceFacet contract has been deployed to: 0x5A8215DDfcC356c9526499818eAd868ba4B9422C
SemaphoreFacet contract has been deployed to: 0xe198d7010AfF9ADA90E349F69481Ad96856ee05b
EtherServiceFacet contract has been deployed to: 0x40A94B5B3C1A3fb8D1F0FEA8F38FC6d69AE1161e
ZkWalletDiamond deployed at: 0xaed142a9A54871C0bD58e1014E30fAf2F581d697
[
  [
    'GuardianFacet',
    '0x13522F1f4968BD85cDE1294536774430551518dB',
    '0.1.0.alpha',
    name: 'GuardianFacet',
    facetAddress: '0x13522F1f4968BD85cDE1294536774430551518dB',
    version: '0.1.0.alpha'
  ],
  [
    'SemaphoreGroupsFacet',
    '0x20Aea34C2441539D5A2497f2DF98bB93575c18ac',
    '0.1.0.alpha',
    name: 'SemaphoreGroupsFacet',
    facetAddress: '0x20Aea34C2441539D5A2497f2DF98bB93575c18ac',
    version: '0.1.0.alpha'
  ],
  [
    'RecoveryFacet',
    '0x8d9CB131635555E812418354648c1B645796031a',
    '0.1.0.alpha',
    name: 'RecoveryFacet',
    facetAddress: '0x8d9CB131635555E812418354648c1B645796031a',
    version: '0.1.0.alpha'
  ],
  [
    'ERC20ServiceFacet',
    '0x18b61b36FC991c095765Ed2c1D04E0875cDc21ac',
    '0.1.0.alpha',
    name: 'ERC20ServiceFacet',
    facetAddress: '0x18b61b36FC991c095765Ed2c1D04E0875cDc21ac',
    version: '0.1.0.alpha'
  ],
  [
    'ERC721ServiceFacet',
    '0x5A8215DDfcC356c9526499818eAd868ba4B9422C',
    '0.1.0.alpha',
    name: 'ERC721ServiceFacet',
    facetAddress: '0x5A8215DDfcC356c9526499818eAd868ba4B9422C',
    version: '0.1.0.alpha'
  ],
  [
    'SemaphoreFacet',
    '0xe198d7010AfF9ADA90E349F69481Ad96856ee05b',
    '0.1.0.alpha',
    name: 'SemaphoreFacet',
    facetAddress: '0xe198d7010AfF9ADA90E349F69481Ad96856ee05b',
    version: '0.1.0.alpha'
  ],
  [
    'EtherServiceFacet',
    '0x40A94B5B3C1A3fb8D1F0FEA8F38FC6d69AE1161e',
    '0.1.0.alpha',
    name: 'EtherServiceFacet',
    facetAddress: '0x40A94B5B3C1A3fb8D1F0FEA8F38FC6d69AE1161e',
    version: '0.1.0.alpha'
  ]
]
Alice address 0x2FBf87AFCD35c291441Bc1dA23dabdbDB77b2100
✨  Done in 352.21s.
```

## Deployment on Mainnet
```

```

## Contribute

zkWallet Contracts exists thanks to its contributors. There are many ways you can participate and help build high quality software. Check out the [contribution guide](CONTRIBUTING.md)!

## License

zkWallet Contracts is released under the [Apache 2.0 License](LICENSE).