const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("MeatBatchContract", function () {
  let owner, other;
  let meatBatch;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MeatBatchContract");
    meatBatch = await Factory.deploy();
  });

  it("1) only FARMER_ROLE can create batch", async function () {
    const FARMER_ROLE = await meatBatch.FARMER_ROLE();
    // other lacks role
    await expect(
      meatBatch.connect(other).createBatch("B001", "Cow")
    )
      .to.be.revertedWithCustomError(meatBatch, "AccessControlUnauthorizedAccount")
      .withArgs(other.address, FARMER_ROLE);
    // owner allowed
    await expect(
      meatBatch.connect(owner).createBatch("B001", "Cow")
    )
      .to.emit(meatBatch, "BatchCreated")
      .withArgs("B001", owner.address, "Cow", anyValue);
  });

  it("2) createBatch emits correct event arguments", async function () {
    await expect(meatBatch.createBatch("B002", "Pig"))
      .to.emit(meatBatch, "BatchCreated")
      .withArgs("B002", owner.address, "Pig", anyValue);
  });

  it("3) FARMER_ROLE cannot operate on others' batches", async function () {
    const FARMER_ROLE = await meatBatch.FARMER_ROLE();
    await meatBatch.grantRole(FARMER_ROLE, other.address);
    await meatBatch.createBatch("B010", "Ox");
    await expect(
      meatBatch.connect(other).feedBatch("B010", "data")
    ).to.be.revertedWith("Only batch owner can perform this action");
  });

  it("4) stages revert on wrong order", async function () {
    await meatBatch.createBatch("B100", "Cow");

    await expect(
      meatBatch.slaughterBatch("B100", "slaughter")
    ).to.be.revertedWith("Batch must be in fed state to slaughter");

    await expect(
      meatBatch.inspectBatch("B100", "inspect")
    ).to.be.revertedWith("Batch must be in slaughtered state to inspect");

    await expect(
      meatBatch.approveBatch("B100", "approve")
    ).to.be.revertedWith("Batch must be in inspected state to approve");
  });

  it("5) valid lifecycle transitions and events", async function () {
    await meatBatch.createBatch("B003", "Sheep");
    await expect(
      meatBatch.feedBatch("B003", "d1")
    ).to.emit(meatBatch, "RecordAdded").withArgs("B003", "Fed", owner.address, anyValue);
    await expect(
      meatBatch.slaughterBatch("B003", "d2")
    ).to.emit(meatBatch, "RecordAdded").withArgs("B003", "Slaughtered", owner.address, anyValue);
    await expect(
      meatBatch.inspectBatch("B003", "d3")
    ).to.emit(meatBatch, "RecordAdded").withArgs("B003", "Inspected", owner.address, anyValue);
    await expect(
      meatBatch.approveBatch("B003", "d4")
    ).to.emit(meatBatch, "RecordAdded").withArgs("B003", "Approved", owner.address, anyValue);
  });

  it("6) repeated stage calls revert", async function () {
    await meatBatch.createBatch("B004", "Goat");
    await meatBatch.feedBatch("B004", "data1");
    await expect(
      meatBatch.feedBatch("B004", "data2")
    ).to.be.reverted;
    await meatBatch.slaughterBatch("B004", "data3");
    await expect(
      meatBatch.slaughterBatch("B004", "data4")
    ).to.be.reverted;
  });

  it("7) getBatchById returns data and reverts for missing batch", async function () {
    await expect(
      meatBatch.getBatchById("Z")
    ).to.be.revertedWith("Batch does not exist");
    await meatBatch.createBatch("C3", "Sheep");
    const batch = await meatBatch.getBatchById("C3");
    expect(batch.batchId).to.equal("C3");
    expect(batch.owner_wallet_address).to.equal(owner.address);
    expect(batch.animalType).to.equal("Sheep");
    expect(batch.exists).to.be.true;
  });
});

describe("AccessManager", function () {
  let owner, other, user;
  let meatBatch, accessManager;

  beforeEach(async function () {
    [owner, other, user] = await ethers.getSigners();
    meatBatch = await ethers.getContractFactory("MeatBatchContract").then(f => f.deploy());
    accessManager = await ethers.getContractFactory("AccessManager").then(f => f.deploy(meatBatch.target));
    const ADMIN = await meatBatch.DEFAULT_ADMIN_ROLE();
    await meatBatch.grantRole(ADMIN, accessManager.target);
  });

  it("1) only admin can grantFarmer", async function () {
    await expect(
      accessManager.connect(other).grantFarmer(user.address)
    ).to.be.revertedWith("Not admin");
  });

  it("2) grantFarmer assigns FARMER_ROLE and emits RoleGranted", async function () {
    const FARMER = await meatBatch.FARMER_ROLE();
    await expect(
      accessManager.connect(owner).grantFarmer(user.address)
    ).to.emit(meatBatch, "RoleGranted").withArgs(FARMER, user.address, accessManager.target);
    expect(await meatBatch.hasRole(FARMER, user.address)).to.be.true;
  });

  it("3) revokeFarmer removes FARMER_ROLE and emits RoleRevoked", async function () {
    const FARMER = await meatBatch.FARMER_ROLE();
    await accessManager.connect(owner).grantFarmer(user.address);
    await expect(
      accessManager.connect(owner).revokeFarmer(user.address)
    ).to.emit(meatBatch, "RoleRevoked").withArgs(FARMER, user.address, accessManager.target);
    expect(await meatBatch.hasRole(FARMER, user.address)).to.be.false;
  });

  it("4) duplicate grantFarmer and revokeFarmer do not emit events", async function () {
    await accessManager.connect(owner).grantFarmer(user.address);
    await expect(
      accessManager.connect(owner).grantFarmer(user.address)
    ).to.not.emit(meatBatch, "RoleGranted");
    await accessManager.connect(owner).revokeFarmer(user.address);
    await expect(
      accessManager.connect(owner).revokeFarmer(user.address)
    ).to.not.emit(meatBatch, "RoleRevoked");
  });

  it("5) grantRoleTo emits RoleGranted for SLAUGHTER_ROLE", async function () {
    const SLAUGHTER = await meatBatch.SLAUGHTER_ROLE();
    await expect(
      accessManager.connect(owner).grantRoleTo(user.address, "SLAUGHTER_ROLE")
    ).to.emit(meatBatch, "RoleGranted").withArgs(SLAUGHTER, user.address, accessManager.target);
    expect(await meatBatch.hasRole(SLAUGHTER, user.address)).to.be.true;
  });

  it("6) revokeRoleFrom emits RoleRevoked for SLAUGHTER_ROLE", async function () {
    const SLAUGHTER = await meatBatch.SLAUGHTER_ROLE();
    await accessManager.connect(owner).grantRoleTo(user.address, "SLAUGHTER_ROLE");
    await expect(
      accessManager.connect(owner).revokeRoleFrom(user.address, "SLAUGHTER_ROLE")
    ).to.emit(meatBatch, "RoleRevoked").withArgs(SLAUGHTER, user.address, accessManager.target);
    expect(await meatBatch.hasRole(SLAUGHTER, user.address)).to.be.false;
  });

  it("7) duplicate generic grant and revoke do not emit events", async function () {
    await accessManager.connect(owner).grantRoleTo(user.address, "SLAUGHTER_ROLE");
    await expect(
      accessManager.connect(owner).grantRoleTo(user.address, "SLAUGHTER_ROLE")
    ).to.not.emit(meatBatch, "RoleGranted");
    await accessManager.connect(owner).revokeRoleFrom(user.address, "SLAUGHTER_ROLE");
    await expect(
      accessManager.connect(owner).revokeRoleFrom(user.address, "SLAUGHTER_ROLE")
    ).to.not.emit(meatBatch, "RoleRevoked");
  });

  it("8) grantRoleTo invalid role string reverts", async function () {
    await expect(
      accessManager.connect(owner).grantRoleTo(user.address, "UNKNOWN")
    ).to.be.revertedWith("Invalid role");
  });
});
