const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("MeatBatchContract Integration with UserAccessControl", function () {
  let owner, farmer, slaughterer, inspector, regulator, outsider;
  let userContract, meatBatch;

  beforeEach(async function () {
    ethers.provider.resolveName = async (name) => name;

    [owner, farmer, slaughterer, inspector, regulator, outsider] = await ethers.getSigners();

    // deploy UserAccessControl
    const UserContract = await ethers.getContractFactory("UserAccessControl");
    userContract = await UserContract.deploy();
    await userContract.waitForDeployment();

    // deploy MeatBatchContract with userContract address
    const MeatBatch = await ethers.getContractFactory("MeatBatchContract");
    meatBatch = await MeatBatch.deploy(userContract.target);
    await meatBatch.waitForDeployment();

    // grant roles to users by owner
    await userContract.connect(owner).grantRoleTo("FARMER_ROLE", farmer.address);
    await userContract.connect(owner).grantRoleTo("SLAUGHTER_ROLE", slaughterer.address);
    await userContract.connect(owner).grantRoleTo("INSPECTOR_ROLE", inspector.address);
    await userContract.connect(owner).grantRoleTo("REGULATOR_ROLE", regulator.address); 
  });

  it("only FARMER_ROLE can create batch", async function () {
    await expect(
      meatBatch.connect(outsider).createBatch("B001", "Cow")
    ).to.be.revertedWith("Unauthorized: Invalid role");

    await expect(
      meatBatch.connect(farmer).createBatch("B001", "Cow")
    ).to.emit(meatBatch, "BatchCreated")
      .withArgs("B001", farmer.address, "Cow", anyValue);
  });

  it("full lifecycle: create -> feed -> slaughter -> inspect pass -> approve", async function () {
    await meatBatch.connect(farmer).createBatch("B100", "Pig");

    await expect(meatBatch.connect(farmer).feedBatch("B100", "fed_data"))
      .to.emit(meatBatch, "RecordAdded")
      .withArgs("B100", "Fed", "fed_data", farmer.address, anyValue);

    await expect(meatBatch.connect(slaughterer).slaughterBatch("B100", "slaughter_data"))
      .to.emit(meatBatch, "RecordAdded")
      .withArgs("B100", "Slaughtered", "slaughter_data", slaughterer.address, anyValue);

    await expect(meatBatch.connect(inspector).inspectBatchPass("B100", "pass_data"))
      .to.emit(meatBatch, "BatchInspected")
      .withArgs("B100", true, inspector.address, anyValue);

    await expect(meatBatch.connect(regulator).approveBatch("B100", "approved_data"))
      .to.emit(meatBatch, "BatchApproved")
      .withArgs("B100", regulator.address, anyValue);
  });

  it("reject batch and prevent approval", async function () {
    await meatBatch.connect(farmer).createBatch("B200", "Sheep");
    await meatBatch.connect(farmer).feedBatch("B200", "feed");
    await meatBatch.connect(slaughterer).slaughterBatch("B200", "slaughter");

    await meatBatch.connect(inspector).inspectBatchFail("B200", "bad meat");

    await expect(
      meatBatch.connect(regulator).approveBatch("B200", "try approval")
    ).to.be.revertedWith("Batch must be inspected");
  });

  it("reject batch after inspection pass", async function () {
    await meatBatch.connect(farmer).createBatch("B300", "Duck");
    await meatBatch.connect(farmer).feedBatch("B300", "feed");
    await meatBatch.connect(slaughterer).slaughterBatch("B300", "slaughter");
    await meatBatch.connect(inspector).inspectBatchPass("B300", "ok");

    await expect(
      meatBatch.connect(regulator).rejectBatch("B300", "docs missing")
    ).to.emit(meatBatch, "BatchRejected")
      .withArgs("B300", "docs missing", regulator.address, anyValue);
  });

  it("only batch owner can feed batch", async function () {
    await meatBatch.connect(farmer).createBatch("B400", "Cow");
    await userContract.connect(owner).grantRoleTo("FARMER_ROLE", outsider.address);

    await expect(
      meatBatch.connect(outsider).feedBatch("B400", "data")
    ).to.be.revertedWith("Only batch owner can perform this action");
  });

  it("getBatchReadableStatus returns correct values", async function () {
    await meatBatch.connect(farmer).createBatch("B500", "Pig");
    expect(await meatBatch.getBatchReadableStatus("B500")).to.equal("Created");

    await meatBatch.connect(farmer).feedBatch("B500", "feed");
    expect(await meatBatch.getBatchReadableStatus("B500")).to.equal("Fed");
  });

  it("getBatchById returns correct batch data", async function () {
    await meatBatch.connect(farmer).createBatch("B600", "Chicken");
    const [batchId, ownerAddress, animalType, createdAt, status, exists, updatedAt] = await meatBatch.getBatchById("B600");

    expect(batchId).to.equal("B600");
    expect(ownerAddress).to.equal(farmer.address);
    expect(animalType).to.equal("Chicken");
    expect(exists).to.be.true;
  });
});
