// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserAccessControl is AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant SLAUGHTER_ROLE = keccak256("SLAUGHTER_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function grantRoleTo(string memory roleName, address user) external onlyRole(ADMIN_ROLE) {
        bytes32 role = _getRole(roleName);
        _grantRole(role, user);
    }

    function revokeRoleFrom(string memory roleName, address user) external onlyRole(ADMIN_ROLE) {
        bytes32 role = _getRole(roleName);
        _revokeRole(role, user);
    }

    function hasAnyRole(address user) external view returns (bool) {
        return hasRole(FARMER_ROLE, user)
            || hasRole(SLAUGHTER_ROLE, user)
            || hasRole(INSPECTOR_ROLE, user)
            || hasRole(REGULATOR_ROLE, user)
            || hasRole(ADMIN_ROLE, user);
    }

    function _getRole(string memory roleName) internal pure returns (bytes32) {
        if (keccak256(bytes(roleName)) == keccak256("FARMER_ROLE")) return FARMER_ROLE;
        if (keccak256(bytes(roleName)) == keccak256("SLAUGHTER_ROLE")) return SLAUGHTER_ROLE;
        if (keccak256(bytes(roleName)) == keccak256("INSPECTOR_ROLE")) return INSPECTOR_ROLE;
        if (keccak256(bytes(roleName)) == keccak256("REGULATOR_ROLE")) return REGULATOR_ROLE;
        if (keccak256(bytes(roleName)) == keccak256("ADMIN_ROLE")) return ADMIN_ROLE;
        revert("Invalid role");
    }
}
