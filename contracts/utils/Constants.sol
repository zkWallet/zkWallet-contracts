//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// semaphore
uint256 constant SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
uint8 constant MAX_DEPTH = 32;

// semaphoreGroupsBase
bytes32 constant GET_GROUP_ADMIN_TYPEHASH = keccak256(
  "getGroupAdmin(uint256)"
);

bytes32 constant UPDATE_GROUP_ADMIN_TYPEHASH = keccak256(
  "createGroup(uint256,uint8,uint256,address)"
);

bytes32 constant CREATE_GROUP_TYPEHASH = keccak256(
  "createGroup(uint256,uint8,uint256,address)"
);

bytes32 constant ADD_MEMBER_TYPEHASH = keccak256(
  "addMember(uint256,uint256)"
);

bytes32 constant REMOVE_MEMBER_TYPEHASH = keccak256(
  "removeMember(uint256,uint256 identityCommitment,uint256[] calldata,uint8[] calldata)"
);

bytes32 constant ADD_MEMBERS_TYPEHASH = keccak256(
  "addMember(uint256,uint256[] memory)"
);

bytes32 constant REMOVE_MEMBERS_TYPEHASH = keccak256(
  "removeMembers(uint256,RemoveMembersDTO[] calldata)"
);

// guardians
uint constant MIN_GUARDIANS = 3;
uint constant MAX_GUARDIANS = 10;
uint constant GUARDIAN_PENDING_PERIODS = 3 days;

bytes32 constant GET_GUARDIAN_TYPEHASH = keccak256(
  "getGuardian(uint256)"
);

bytes32 constant GET_GUARDIANS_TYPEHASH = keccak256(
  "getGuardians(bool)"
);

bytes32 constant NUM_GUARDIANS_TYPEHASH = keccak256(
  "numGuardians(bool)"
);

bytes32 constant REQUIRE_MAJORITY_TYPEHASH = keccak256(
  "requireMajority(GuardianDTO[] calldata)"
);

bytes32 constant SET_INITIAL_GUARDIANS_TYPEHASH = keccak256(
  "setInitialGuardians(uint256[] memory)"
);

bytes32 constant REMOVE_GUARDIAN_TYPEHASH = keccak256(
  "removeGuardian(uint256)"
);

bytes32 constant REMOVE_GUARDIANS_TYPEHASH = keccak256(
  "removeGuardians(uint256[] memory)"
);