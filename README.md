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
Account balance: 10010000000000000000000
aliceWallet 0xBa15895E78550495Bb8a9979ABCb106b2EdC9F63
Account balance: 10010000000000000000000
bobWallet 0x8Fd1C63CCc49E316CB9fdeB45f8Fb3944aBed4aC
Account balance: 10010000000000000000000
Verifier16 contract has been deployed to: 0x083409136b251DC1A8c47958874C80197424dFdF
Verifier17 contract has been deployed to: 0xe3E689D1cb070713C88A18C3A13f266B4fD58778
Verifier18 contract has been deployed to: 0x727C8e95D76Feef514c1AF34d4CDAE61266FC2Ba
Verifier19 contract has been deployed to: 0x1c0966796C46C8e4230B9f4D1Fe151Efa1eB75fD
Verifier20 contract has been deployed to: 0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f
Verifier21 contract has been deployed to: 0x9b28bED203EDd813d6D278FC8AF9743CEeB081A0
Verifier22 contract has been deployed to: 0xb1a9662b07263CB7419eBa90fA7cF835ee686965
Verifier23 contract has been deployed to: 0x1CB9e127D7f25C2dE99de822B72B47da85a3D37E
Verifier24 contract has been deployed to: 0xf6CBd386fAE126414Ac3eAD9b6419Ed620f17446
Verifier25 contract has been deployed to: 0xc241533F9D0F9DEC506d5D8da68C430BAFd26e5A
Verifier26 contract has been deployed to: 0x0D47a2Ca986fCCAFCe7b93178383c64855241704
Verifier27 contract has been deployed to: 0x17aBCcd552D3D026dCfDA1BB1E3F4C107Fcb288b
Verifier28 contract has been deployed to: 0xE1F42c534828d93B31f21657F0bfe48C879A1107
Verifier29 contract has been deployed to: 0x38f81B60CAd3BD9eaE067Db896f315246f95D948
Verifier30 contract has been deployed to: 0x121Bd49eE3aa9Ad46E5C2e1Ac709Bd74969A04F3
Verifier31 contract has been deployed to: 0x6Dc6AC6320AA8af453648B09007b8F121fdD13E7
Verifier32 contract has been deployed to: 0xF9328111a2C3d81A581A18c4061Dd7DC27127A8a
WalletFactoryDiamond contract has been deployed to: 0xB51049AffFA9C2DF44654BACC65A9aF45013a027
[ { name: 'WalletFactoryFacet' } ]
WalletFactoryFacet contract has been deployed to: 0xF7A90fa8450b79F2727c5709Cc4Da4f1C03cA55e
SimplicyWalletDiamond contract has been deployed to: 0x8BeFc64AA83f6a822376D2fEd3BF928d870264Fb
PoseidonT3 contract has been deployed to: 0x07AfCA0456B59962588006a10895A15bCb751C71
[
  { name: 'ERC20Facet' },
  { name: 'ERC721Facet' },
  { name: 'RecoveryFacet' },
  { name: 'SemaphoreFacet' },
  { name: 'SemaphoreVotingFacet' }
]
ERC20Facet contract has been deployed to: 0xaC71914E2A22f92d3F75106043aA4E7248Eda9C3
ERC721Facet contract has been deployed to: 0x4FEbbDE06b713Ecb9829b771d3dc18bD1F9DcbBE
RecoveryFacet contract has been deployed to: 0x1A51d1C41be8a8A8F3092C65Ca0c3a0777a65f06
SemaphoreFacet contract has been deployed to: 0x890be5081e75781F81d6eB86EF19Bceb21C9e160
SemaphoreVotingFacet contract has been deployed to: 0x3Efcd0a84EfFDFD8C16FC2a47eEf2CF0f4CA4352
WalletFactoryDiamond version: 0.0.1
walletFactoryFacetVersion: 0.0.1
SimplicyWalletDiamond version: 0.0.1
#addFacet==================================== 5
Verifier20 0x6a8DC73b21AE2A517BD3CFcf53CE32c89566BB6f
Alice setVerifiers transaction hash:  0xb36c5a0e6d4d5a3d5413825fa23781e55e5a07598e55b764294532c48799388e
Bob setVerifiers transaction hash:  0xe21c21ffe67281ba44fc2a445d262bf541763b4ae8c57e3f54e42445a7491e03
```

## Deployment on Testnet
```

```

## Contribute

zkWallet Contracts exists thanks to its contributors. There are many ways you can participate and help build high quality software. Check out the [contribution guide](CONTRIBUTING.md)!

## License

zkWallet Contracts is released under the [Apache 2.0 License](LICENSE).