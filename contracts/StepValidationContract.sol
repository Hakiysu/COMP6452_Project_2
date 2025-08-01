// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MeatBatchContract.sol";

contract StepValidationContract {
    address public manager;
    MeatBatchContract public batchContract;
    
    struct Checkpoint {
        string batchId;
        string location;
        int256 temperature;
        string submitterName;
        string statusNote;
        string compliance;
        uint256 timestamp;
        address submitter;
    }
    
    mapping(string => Checkpoint[]) public checkpoints;
    mapping(address => bool) public authorizedSubmitters;
    address[] public submitterList;
    
    event CheckpointAdded(
        string batchId,
        string location,
        int256 temperature,
        string submitterName,
        string statusNote,
        string compliance,
        uint256 timestamp,
        address submitter
    );
    
    event SubmitterAdded(address submitter);
    event SubmitterRemoved(address submitter);
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedSubmitters[msg.sender], "Not authorized submitter");
        _;
    }
    
    constructor(address _batchContractAddress) {
        manager = msg.sender;
        batchContract = MeatBatchContract(_batchContractAddress);
    }
    
    function addCheckpoint(
        string memory _batchId,
        string memory _location,
        int256 _temperature,
        string memory _submitterName,
        string memory _statusNote,
        string memory _compliance
    ) public onlyAuthorized {
        require(batchContract.batchExists(_batchId), "Batch does not exist");
        
        Checkpoint memory newCheckpoint = Checkpoint({
            batchId: _batchId,
            location: _location,
            temperature: _temperature,
            submitterName: _submitterName,
            statusNote: _statusNote,
            compliance: _compliance,
            timestamp: block.timestamp,
            submitter: msg.sender
        });
        
        checkpoints[_batchId].push(newCheckpoint);
        
        emit CheckpointAdded(
            _batchId,
            _location,
            _temperature,
            _submitterName,
            _statusNote,
            _compliance,
            block.timestamp,
            msg.sender
        );
    }
    
    function getCheckpoints(string memory _batchId) public view returns (Checkpoint[] memory) {
        return checkpoints[_batchId];
    }
    
    function getCheckpointCount(string memory _batchId) public view returns (uint256) {
        return checkpoints[_batchId].length;
    }
    
    function addSubmitter(address _submitter) public onlyManager {
        require(!authorizedSubmitters[_submitter], "Submitter already authorized");
        authorizedSubmitters[_submitter] = true;
        submitterList.push(_submitter);
        emit SubmitterAdded(_submitter);
    }
    
    function removeSubmitter(address _submitter) public onlyManager {
        require(authorizedSubmitters[_submitter], "Submitter not authorized");
        authorizedSubmitters[_submitter] = false;
        emit SubmitterRemoved(_submitter);
    }
    
    function isSubmitterAuthorized(address _submitter) public view returns (bool) {
        return authorizedSubmitters[_submitter];
    }
    
    function getAllSubmitters() public view returns (address[] memory) {
        return submitterList;
    }
    
    function transferManager(address newManager) public onlyManager {
        require(newManager != address(0), "Invalid address");
        manager = newManager;
    }
    
    function updateBatchContract(address _newBatchContractAddress) public onlyManager {
        batchContract = MeatBatchContract(_newBatchContractAddress);
    }
}