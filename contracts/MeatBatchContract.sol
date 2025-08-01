// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MeatBatchContract {
    address public manager;
    
    struct Batch {
        string batchId;
        string producer;
        string origin;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(string => Batch) public batches;
    string[] public batchIds;
    
    event BatchCreated(
        string batchId,
        string producer,
        string origin,
        uint256 timestamp,
        address createdBy
    );
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }
    
    constructor() {
        manager = msg.sender;
    }
    
    function createBatch(
        string memory _batchId,
        string memory _producer,
        string memory _origin
    ) public onlyManager {
        require(!batches[_batchId].exists, "Batch ID already exists");
        
        Batch memory newBatch = Batch({
            batchId: _batchId,
            producer: _producer,
            origin: _origin,
            timestamp: block.timestamp,
            exists: true
        });
        
        batches[_batchId] = newBatch;
        batchIds.push(_batchId);
        
        emit BatchCreated(
            _batchId,
            _producer,
            _origin,
            block.timestamp,
            msg.sender
        );
    }
    
    function getBatch(string memory _batchId) public view returns (
        string memory,
        string memory,
        string memory,
        uint256,
        bool
    ) {
        Batch memory batch = batches[_batchId];
        return (
            batch.batchId,
            batch.producer,
            batch.origin,
            batch.timestamp,
            batch.exists
        );
    }
    
    function getAllBatchIds() public view returns (string[] memory) {
        return batchIds;
    }
    
    function batchExists(string memory _batchId) public view returns (bool) {
        return batches[_batchId].exists;
    }
    
    function transferManager(address newManager) public onlyManager {
        require(newManager != address(0), "Invalid address");
        manager = newManager;
    }
}