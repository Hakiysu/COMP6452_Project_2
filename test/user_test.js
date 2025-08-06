const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("UserAccessControl + MeatBatchContract Permission Test", function () {
  let deployer, admin, farmer, slaughterer, inspector, regulator, outsider;
  let userAccess, meatBatch;

  beforeEach(async function () {
    [deployer, admin, farmer, slaughterer, inspector, regulator, outsider] = await ethers.getSigners();

    const UserAccessFactory = await ethers.getContractFactory("UserAccessControl");
    userAccess = await UserAccessFactory.deploy();
    await userAccess.waitForDeployment();

    const MeatBatchFactory = await ethers.getContractFactory("MeatBatchContract");
    meatBatch = await MeatBatchFactory.deploy(userAccess.target);
    await meatBatch.waitForDeployment();

    // give admin with ADMIN_ROLE
    const ADMIN_ROLE = await userAccess.ADMIN_ROLE();
    await userAccess.grantRoleTo("ADMIN_ROLE", admin.address);

    // grant roles to users
    await userAccess.connect(admin).grantRoleTo("FARMER_ROLE", farmer.address);
    await userAccess.connect(admin).grantRoleTo("SLAUGHTER_ROLE", slaughterer.address);
    await userAccess.connect(admin).grantRoleTo("INSPECTOR_ROLE", inspector.address);
    await userAccess.connect(admin).grantRoleTo("REGULATOR_ROLE", regulator.address);

    // set the user contract address in MeatBatchContract
    await meatBatch.connect(admin).setUserContract(userAccess.target);
  });

  it("admin can GRANT & REVOKE -> FARMER_ROLE", async () => {
    const FARMER_ROLE = await userAccess.FARMER_ROLE();

    await userAccess.connect(admin).grantRoleTo("FARMER_ROLE", outsider.address);
    expect(await userAccess.hasRole(FARMER_ROLE, outsider.address)).to.be.true;

    await userAccess.connect(admin).revokeRoleFrom("FARMER_ROLE", outsider.address);
    expect(await userAccess.hasRole(FARMER_ROLE, outsider.address)).to.be.false;
  });

  it("non admin cannot grant or revoke", async () => {
    const ADMIN_ROLE = await userAccess.ADMIN_ROLE();

    await expect(
      userAccess.connect(outsider).grantRoleTo("FARMER_ROLE", outsider.address)
    ).to.be.revertedWithCustomError(userAccess, "AccessControlUnauthorizedAccount")
      .withArgs(outsider.address, ADMIN_ROLE);

    await expect(
      userAccess.connect(outsider).revokeRoleFrom("FARMER_ROLE", outsider.address)
    ).to.be.revertedWithCustomError(userAccess, "AccessControlUnauthorizedAccount")
      .withArgs(outsider.address, ADMIN_ROLE);
  });

  it("illegal role name should revert", async () => {
    await expect(
      userAccess.connect(admin).grantRoleTo("HACKER_ROLE", outsider.address)
    ).to.be.revertedWith("Invalid role");

    await expect(
      userAccess.connect(admin).revokeRoleFrom("HACKER_ROLE", outsider.address)
    ).to.be.revertedWith("Invalid role");
  });

  it("hasAnyRole return true/false correctly", async () => {
    expect(await userAccess.hasAnyRole(outsider.address)).to.be.false;

    await userAccess.connect(admin).grantRoleTo("FARMER_ROLE", outsider.address);
    expect(await userAccess.hasAnyRole(outsider.address)).to.be.true;


    await userAccess.connect(admin).revokeRoleFrom("INSPECTOR_ROLE", outsider.address);
    expect(await userAccess.hasAnyRole(outsider.address)).to.be.true;
  });

  it("user who don't have FARMER_ROLE cannot create batch", async () => {
    await expect(
      meatBatch.connect(outsider).createBatch("B001", "Cow")
    ).to.be.revertedWith("Unauthorized: Invalid role");
  });

  it("user who have FARMER_ROLE but not owner, cannot feed others batch", async () => {
    await meatBatch.connect(farmer).createBatch("B002", "Sheep");

    await userAccess.connect(admin).grantRoleTo("FARMER_ROLE", outsider.address);

    await expect(
      meatBatch.connect(outsider).feedBatch("B002", "not your cow")
    ).to.be.revertedWith("Only batch owner can perform this action");
  });

  it("user who not is SLAUGHTER_ROLE cannot slaughter batch", async () => {
    await meatBatch.connect(farmer).createBatch("B003", "Pig");
    await meatBatch.connect(farmer).feedBatch("B003", "fed well");

    await expect(
      meatBatch.connect(outsider).slaughterBatch("B003", "illegal op")
    ).to.be.revertedWith("Unauthorized: Invalid role");
  });

  it("user who have SLAUGHTER_ROLE can slaughter batch", async () => {
    await meatBatch.connect(farmer).createBatch("B004", "Duck");
    await meatBatch.connect(farmer).feedBatch("B004", "feed");

    await expect(
      meatBatch.connect(slaughterer).slaughterBatch("B004", "ok")
    ).to.emit(meatBatch, "RecordAdded")
     .withArgs("B004", "Slaughtered", "ok", slaughterer.address, anyValue);
  });

  it("Cannot perform inspection without INSPECTOR_ROLE", async () => {
    await meatBatch.connect(farmer).createBatch("B005", "Chicken");
    await meatBatch.connect(farmer).feedBatch("B005", "ok");
    await meatBatch.connect(slaughterer).slaughterBatch("B005", "ok");

    await expect(
      meatBatch.connect(outsider).inspectBatchPass("B005", "pass")
    ).to.be.revertedWith("Unauthorized: Invalid role");
  });

  it("Cannot approve without REGULATOR_ROLE", async () => {
    await meatBatch.connect(farmer).createBatch("B006", "Beef");
    await meatBatch.connect(farmer).feedBatch("B006", "ok");
    await meatBatch.connect(slaughterer).slaughterBatch("B006", "ok");
    await meatBatch.connect(inspector).inspectBatchPass("B006", "good");

    await expect(
      meatBatch.connect(outsider).approveBatch("B006", "try")
    ).to.be.revertedWith("Unauthorized: Invalid role");
  });
});
