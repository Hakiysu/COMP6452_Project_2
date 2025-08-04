// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface IMeatBatchContract {
    function grantRole(bytes32 role, address account) external;
    function revokeRole(bytes32 role, address account) external;
    function hasRole(bytes32 role, address account) external view returns (bool);

    function DEFAULT_ADMIN_ROLE() external view returns (bytes32);
    function FARMER_ROLE() external view returns (bytes32);
    function SLAUGHTER_ROLE() external view returns (bytes32);
    function INSPECTOR_ROLE() external view returns (bytes32);
    function REGULATOR_ROLE() external view returns (bytes32);
    function CONSUMER_ROLE() external view returns (bytes32);
}

contract AccessManager is AccessControl {
    IMeatBatchContract public meatBatch;
 

    constructor(address meatBatchAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        meatBatch = IMeatBatchContract(meatBatchAddress);
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

    // ----- 基础授权函数 -----

    function grantRoleTo(address user, string memory role) public onlyAdmin {
        bytes32 roleHash = _getRoleHash(role);
        meatBatch.grantRole(roleHash, user);
    }

    function revokeRoleFrom(address user, string memory role) public onlyAdmin {
        bytes32 roleHash = _getRoleHash(role);
        meatBatch.revokeRole(roleHash, user);
    }

    // ----- 特定角色授权函数 -----

    function grantFarmer(address user) external onlyAdmin {
        meatBatch.grantRole(meatBatch.FARMER_ROLE(), user);
    }

    function grantSlaughter(address user) external onlyAdmin {
        meatBatch.grantRole(meatBatch.SLAUGHTER_ROLE(), user);
    }

    function grantInspector(address user) external onlyAdmin {
        meatBatch.grantRole(meatBatch.INSPECTOR_ROLE(), user);
    }

    function grantRegulator(address user) external onlyAdmin {
        meatBatch.grantRole(meatBatch.REGULATOR_ROLE(), user);
    }

    function grantConsumer(address user) external onlyAdmin {
        meatBatch.grantRole(meatBatch.CONSUMER_ROLE(), user);
    }

    function revokeFarmer(address user) external onlyAdmin {
        meatBatch.revokeRole(meatBatch.FARMER_ROLE(), user);
    }

    function revokeSlaughter(address user) external onlyAdmin {
        meatBatch.revokeRole(meatBatch.SLAUGHTER_ROLE(), user);
    }

    function revokeInspector(address user) external onlyAdmin {
        meatBatch.revokeRole(meatBatch.INSPECTOR_ROLE(), user);
    }

    function revokeRegulator(address user) external onlyAdmin {
        meatBatch.revokeRole(meatBatch.REGULATOR_ROLE(), user);
    }

    function revokeConsumer(address user) external onlyAdmin {
        meatBatch.revokeRole(meatBatch.CONSUMER_ROLE(), user);
    }

    // ----- 查询 -----

    function hasAnyRole(address user) external view returns (bool) {
        return (
            meatBatch.hasRole(meatBatch.FARMER_ROLE(), user) ||
            meatBatch.hasRole(meatBatch.SLAUGHTER_ROLE(), user) ||
            meatBatch.hasRole(meatBatch.INSPECTOR_ROLE(), user) ||
            meatBatch.hasRole(meatBatch.REGULATOR_ROLE(), user) ||
            meatBatch.hasRole(meatBatch.CONSUMER_ROLE(), user)
        );
    }

    // ----- 内部工具函数 -----

    function _getRoleHash(string memory role) internal view returns (bytes32) {
        bytes32 roleHash;

        if (keccak256(bytes(role)) == keccak256("FARMER_ROLE")) {
            roleHash = meatBatch.FARMER_ROLE();
        } else if (keccak256(bytes(role)) == keccak256("SLAUGHTER_ROLE")) {
            roleHash = meatBatch.SLAUGHTER_ROLE();
        } else if (keccak256(bytes(role)) == keccak256("INSPECTOR_ROLE")) {
            roleHash = meatBatch.INSPECTOR_ROLE();
        } else if (keccak256(bytes(role)) == keccak256("REGULATOR_ROLE")) {
            roleHash = meatBatch.REGULATOR_ROLE();
        } else if (keccak256(bytes(role)) == keccak256("CONSUMER_ROLE")) {
            roleHash = meatBatch.CONSUMER_ROLE();
        } else {
            revert("Invalid role");
        }

        return roleHash;
    }
}
