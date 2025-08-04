const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("MeatBatchContract & StepValidationContract", function () {
  let owner, other, submitter;
  let MeatBatch, meatBatch;
  let StepValidation, stepValidation;

  beforeEach(async () => {
    [owner, other, submitter] = await ethers.getSigners();

    MeatBatch = await ethers.getContractFactory("MeatBatchContract");
    meatBatch = await MeatBatch.connect(owner).deploy();

    StepValidation = await ethers.getContractFactory("StepValidationContract");
    stepValidation = await StepValidation.connect(owner).deploy(meatBatch.target);
  });

  describe("MeatBatchContract", () => {
    it("deployer is manager", async () => {
      expect(await meatBatch.manager()).to.equal(owner.address);
    });

    it("manager can create batch and query it", async () => {
      await expect(
        meatBatch.connect(owner).createBatch("B001", "AliceFarm", "Wonderland")
      )
        .to.emit(meatBatch, "BatchCreated")
        .withArgs(
          "B001",
          "AliceFarm",
          "Wonderland",
          anyValue,
          owner.address
        );

      expect(await meatBatch.batchExists("B001")).to.be.true;

      const batchIds = await meatBatch.getAllBatchIds();
      expect(batchIds).to.deep.equal(["B001"]);

      const batch = await meatBatch.getBatch("B001");
      expect(batch[0]).to.equal("B001");
      expect(batch[1]).to.equal("AliceFarm");
      expect(batch[2]).to.equal("Wonderland");
      expect(batch[4]).to.be.true;
    });

    it("cannot create duplicate batch", async () => {
      await meatBatch.connect(owner).createBatch("B001", "A", "O");
      await expect(
        meatBatch.connect(owner).createBatch("B001", "A", "O")
      ).to.be.revertedWith("Batch ID already exists");
    });

    it("non-manager cannot create batch", async () => {
      await expect(
        meatBatch.connect(other).createBatch("B002", "X", "Y")
      ).to.be.revertedWith("Only manager can call this function");
    });

    it("manager can transferManager and new manager works", async () => {
      await meatBatch.connect(owner).transferManager(other.address);
      expect(await meatBatch.manager()).to.equal(other.address);

      await expect(
        meatBatch.connect(other).createBatch("B003", "Foo", "Bar")
      ).to.not.be.reverted;
    });

    it("transferManager to zero address reverts", async () => {
      await expect(
        meatBatch.connect(owner).transferManager("0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("StepValidationContract", () => {
    beforeEach(async () => {
      await meatBatch.connect(owner).createBatch("B100", "Producer", "Origin");
    });

    it("only manager can add/remove submitter", async () => {
      await expect(
        stepValidation.connect(other).addSubmitter(submitter.address)
      ).to.be.revertedWith("Only manager can call this function");

      await expect(
        stepValidation.connect(owner).addSubmitter(submitter.address)
      )
        .to.emit(stepValidation, "SubmitterAdded")
        .withArgs(submitter.address);

      await expect(
        stepValidation.connect(owner).addSubmitter(submitter.address)
      ).to.be.revertedWith("Submitter already authorized");

      await expect(
        stepValidation.connect(other).removeSubmitter(submitter.address)
      ).to.be.revertedWith("Only manager can call this function");

      await expect(
        stepValidation.connect(owner).removeSubmitter(submitter.address)
      )
        .to.emit(stepValidation, "SubmitterRemoved")
        .withArgs(submitter.address);

      await expect(
        stepValidation.connect(owner).removeSubmitter(submitter.address)
      ).to.be.revertedWith("Submitter not authorized");
    });

    it("authorized submitter can addCheckpoint and query", async () => {
      await stepValidation.connect(owner).addSubmitter(submitter.address);
      expect(await stepValidation.isSubmitterAuthorized(submitter.address)).to.be.true;

      await expect(
        stepValidation.connect(other).addCheckpoint(
          "B100",
          "Loc",
          5,
          "Tom",
          "OK",
          "Good"
        )
      ).to.be.revertedWith("Not authorized submitter");

      await expect(
        stepValidation.connect(submitter).addCheckpoint(
          "",
          "Loc",
          5,
          "Tom",
          "OK",
          "Good"
        )
      ).to.be.revertedWith("Batch does not exist");

      await expect(
        stepValidation.connect(submitter).addCheckpoint(
          "B100",
          "LocA",
          7,
          "Tom",
          "Note",
          "Pass"
        )
      )
        .to.emit(stepValidation, "CheckpointAdded")
        .withArgs(
          "B100",
          "LocA",
          7,
          "Tom",
          "Note",
          "Pass",
          anyValue,
          submitter.address
        );

      expect(await stepValidation.getCheckpointCount("B100")).to.equal(1);

      const cps = await stepValidation.getCheckpoints("B100");
      const cp = cps[0];
      expect(cp.batchId).to.equal("B100");
      expect(cp.location).to.equal("LocA");
      expect(cp.temperature).to.equal(7);
      expect(cp.submitterName).to.equal("Tom");
      expect(cp.statusNote).to.equal("Note");
      expect(cp.compliance).to.equal("Pass");
      expect(cp.submitter).to.equal(submitter.address);
    });

    it("updateBatchContract onlyManager", async () => {
      await expect(
        stepValidation.connect(other).updateBatchContract(other.address)
      ).to.be.revertedWith("Only manager can call this function");

      await expect(
        stepValidation.connect(owner).updateBatchContract(other.address)
      ).to.not.be.reverted;
    });
  });

  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
