const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MeatBatchContract", function () {
  let MeatBatch, meatBatch, owner, addr1;

  beforeEach(async function () {
    MeatBatch = await ethers.getContractFactory("MeatBatchContract");
    [owner, addr1] = await ethers.getSigners();
    meatBatch = await MeatBatch.deploy();
    await meatBatch.deployed();
  });

  it("应该成功创建一个批次", async function () {
    const tx = await meatBatch.createBatch("12345", "Farm A");
    await tx.wait();
    const batch = await meatBatch.getBatch("12345");
    expect(batch.origin).to.equal("Farm A");
  });

  it("应该拒绝重复的 batchId", async function () {
    await meatBatch.createBatch("12345", "Farm A");
    await expect(
      meatBatch.createBatch("12345", "Farm B")
    ).to.be.revertedWith("Batch already exists");
  });
});
