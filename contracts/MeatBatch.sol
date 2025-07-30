// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MeatBatch {
    string public batchId;

    constructor(string memory _batchId) {
        batchId = _batchId;
    }
}
