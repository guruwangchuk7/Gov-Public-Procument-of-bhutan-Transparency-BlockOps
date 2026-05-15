// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract UserRegistry is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AGENCY_ROLE = keccak256("AGENCY_ROLE");
    bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    enum UserRole {
        None,
        Admin,
        Agency,
        Supplier,
        Auditor
    }

    struct User {
        bytes32 identityHash;
        UserRole role;
        bool active;
        uint256 registeredAt;
        uint256 updatedAt;
    }

    mapping(address => User) public users;
    mapping(bytes32 => address) public identityToWallet;

    event UserRegistered(address indexed wallet, bytes32 indexed identityHash, UserRole role, uint256 timestamp);
    event UserRoleUpdated(address indexed wallet, UserRole oldRole, UserRole newRole, uint256 timestamp);
    event UserStatusChanged(address indexed wallet, bool active, uint256 timestamp);

    constructor(address admin) {
        require(admin != address(0), "UserRegistry: zero admin");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        bytes32 bootstrapIdentity = keccak256(abi.encodePacked("BOOTSTRAP_ADMIN", admin));
        users[admin] = User({
            identityHash: bootstrapIdentity,
            role: UserRole.Admin,
            active: true,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp
        });
        identityToWallet[bootstrapIdentity] = admin;

        emit UserRegistered(admin, bootstrapIdentity, UserRole.Admin, block.timestamp);
    }

    function registerUser(
        address wallet,
        bytes32 identityHash,
        UserRole role
    ) external onlyRole(ADMIN_ROLE) whenNotPaused {
        require(wallet != address(0), "UserRegistry: zero wallet");
        require(identityHash != bytes32(0), "UserRegistry: zero identity hash");
        require(role != UserRole.None, "UserRegistry: invalid role");
        require(users[wallet].registeredAt == 0, "UserRegistry: wallet already registered");
        require(identityToWallet[identityHash] == address(0), "UserRegistry: identity already linked");

        users[wallet] = User({
            identityHash: identityHash,
            role: role,
            active: true,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp
        });
        identityToWallet[identityHash] = wallet;
        _grantRole(_accessRoleFor(role), wallet);

        emit UserRegistered(wallet, identityHash, role, block.timestamp);
    }

    function updateUserRole(address wallet, UserRole newRole) external onlyRole(ADMIN_ROLE) whenNotPaused {
        require(newRole != UserRole.None, "UserRegistry: invalid role");
        User storage user = users[wallet];
        require(user.registeredAt != 0, "UserRegistry: unknown user");

        UserRole oldRole = user.role;
        require(oldRole != newRole, "UserRegistry: same role");

        _revokeRole(_accessRoleFor(oldRole), wallet);
        _grantRole(_accessRoleFor(newRole), wallet);

        user.role = newRole;
        user.updatedAt = block.timestamp;

        emit UserRoleUpdated(wallet, oldRole, newRole, block.timestamp);
    }

    function deactivateUser(address wallet) external onlyRole(ADMIN_ROLE) whenNotPaused {
        _setUserStatus(wallet, false);
    }

    function reactivateUser(address wallet) external onlyRole(ADMIN_ROLE) whenNotPaused {
        _setUserStatus(wallet, true);
    }

    function isActiveUser(address wallet) external view returns (bool) {
        return users[wallet].active;
    }

    function hasUserRole(address wallet, UserRole role) external view returns (bool) {
        User memory user = users[wallet];
        return user.active && user.role == role;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function _setUserStatus(address wallet, bool active) internal {
        User storage user = users[wallet];
        require(user.registeredAt != 0, "UserRegistry: unknown user");
        require(user.active != active, "UserRegistry: status unchanged");

        user.active = active;
        user.updatedAt = block.timestamp;

        emit UserStatusChanged(wallet, active, block.timestamp);
    }

    function _accessRoleFor(UserRole role) internal pure returns (bytes32) {
        if (role == UserRole.Admin) return ADMIN_ROLE;
        if (role == UserRole.Agency) return AGENCY_ROLE;
        if (role == UserRole.Supplier) return SUPPLIER_ROLE;
        if (role == UserRole.Auditor) return AUDITOR_ROLE;
        revert("UserRegistry: invalid role");
    }
}
