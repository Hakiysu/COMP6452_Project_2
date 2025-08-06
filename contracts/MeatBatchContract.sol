// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserContract {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function FARMER_ROLE() external view returns (bytes32);
    function SLAUGHTER_ROLE() external view returns (bytes32);
    function INSPECTOR_ROLE() external view returns (bytes32);
    function REGULATOR_ROLE() external view returns (bytes32);
    function ADMIN_ROLE() external view returns (bytes32);
}

contract MeatBatchContract {
    IUserContract public userContract;

    constructor(address userContractAddress) {
        userContract = IUserContract(userContractAddress);
    }

    enum BatchStatus {
        Created,
        Fed,
        Slaughtered,
        Inspected,
        Approved,
        Recheck,
        Rejected
    }

    struct Batch {
        string batchId;
        address owner_wallet_address;
        string animalType;
        BatchStatus status;
        uint256 createdAt;
        uint256 updatedAt;
        bool exists;
        bool passedInspection;
    }

    struct Record {
        string stage;
        string content;
        address createdBy;
        uint256 createdAt;
    }

    mapping(string => Batch) public batches;
    mapping(string => Record[]) public batchRecords;
    string[] public allBatchIds;

    // --- 修饰符 ---
    modifier onlyRole(bytes32 role) {
        require(userContract.hasRole(role, msg.sender), "Unauthorized: Invalid role");
        _;
    }

    modifier onlyRegulator() {
        require(userContract.hasRole(userContract.REGULATOR_ROLE(), msg.sender), "Only regulator can perform this action");
        _;
    }

    modifier onlyOwner(string memory _batchId) {
        require(batches[_batchId].owner_wallet_address == msg.sender, "Only batch owner can perform this action");
        _;
    }

    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].exists, "Batch does not exist");
        _;
    }

    // --- 事件 ---
    event BatchCreated(string indexed batchId, address indexed owner, string animalType, uint256 timestamp);
    event BatchStatusChanged(string indexed batchId, BatchStatus previousStatus, BatchStatus newStatus, address indexed operator, uint256 timestamp);
    event RecordAdded(string indexed batchId, string stage, string content, address indexed createdBy, uint256 timestamp);
    event BatchInspected(string indexed batchId, bool passed, address indexed inspector, uint256 timestamp);
    event BatchApproved(string indexed batchId, address indexed regulator, uint256 timestamp);
    event BatchRejected(string indexed batchId, string reason, address indexed regulator, uint256 timestamp);
    event BatchReturnedForReview(string indexed batchId, string reason, address indexed regulator, uint256 timestamp);


    function setUserContract(address _userContract) external onlyRole(userContract.ADMIN_ROLE()) {
    userContract = IUserContract(_userContract);
}

    // --- 核心函数 ---
    function createBatch(string memory _batchId, string memory _animalType)
        public
        onlyRole(userContract.FARMER_ROLE())
    {
        require(!batches[_batchId].exists, "Batch ID already exists");

        batches[_batchId] = Batch({
            batchId: _batchId,
            owner_wallet_address: msg.sender,
            animalType: _animalType,
            status: BatchStatus.Created,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            exists: true,
            passedInspection: false
        });

        allBatchIds.push(_batchId);

        emit BatchCreated(_batchId, msg.sender, _animalType, block.timestamp);
        emit BatchStatusChanged(_batchId, BatchStatus.Created, BatchStatus.Created, msg.sender, block.timestamp);
    }

    function feedBatch(string memory _batchId, string memory _jsonData)
        public
        batchExists(_batchId)
        onlyRole(userContract.FARMER_ROLE())
        onlyOwner(_batchId)
    {
        Batch storage batch = batches[_batchId];
        require(batch.status == BatchStatus.Created, "Must be in created state");

        batch.status = BatchStatus.Fed;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Fed", _jsonData);
        emit BatchStatusChanged(_batchId, BatchStatus.Created, BatchStatus.Fed, msg.sender, block.timestamp);
    }

    function slaughterBatch(string memory _batchId, string memory _jsonData)
        public
        batchExists(_batchId)
        onlyRole(userContract.SLAUGHTER_ROLE())
    {
        Batch storage batch = batches[_batchId];
        require(batch.status == BatchStatus.Fed, "Must be in fed state");

        batch.status = BatchStatus.Slaughtered;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Slaughtered", _jsonData);
        emit BatchStatusChanged(_batchId, BatchStatus.Fed, BatchStatus.Slaughtered, msg.sender, block.timestamp);
    }

    function inspectBatchPass(string memory _batchId, string memory _jsonData)
        public
        batchExists(_batchId)
        onlyRole(userContract.INSPECTOR_ROLE())
    {
        Batch storage batch = batches[_batchId];
        require(
            batch.status == BatchStatus.Slaughtered || batch.status == BatchStatus.Recheck,
            "Must be in slaughtered or recheck state"
        );

        BatchStatus prev = batch.status;
        batch.status = BatchStatus.Inspected;
        batch.passedInspection = true;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Inspected", _jsonData);
        emit BatchInspected(_batchId, true, msg.sender, block.timestamp);
        emit BatchStatusChanged(_batchId, prev, BatchStatus.Inspected, msg.sender, block.timestamp);
    }

    function inspectBatchFail(string memory _batchId, string memory _jsonData)
        public
        batchExists(_batchId)
        onlyRole(userContract.INSPECTOR_ROLE())
    {
        Batch storage batch = batches[_batchId];
        require(batch.status == BatchStatus.Slaughtered || batch.status == BatchStatus.Recheck, "Must be in slaughtered or recheck state");

        batch.status = BatchStatus.Recheck;
        batch.passedInspection = false;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Inspect Failed", _jsonData);
        emit BatchInspected(_batchId, false, msg.sender, block.timestamp);
        emit BatchReturnedForReview(_batchId, "Inspect failed, please recheck your batch", msg.sender, block.timestamp);
        emit BatchStatusChanged(_batchId, BatchStatus.Slaughtered, BatchStatus.Recheck, msg.sender, block.timestamp);
    }

    function approveBatch(string memory _batchId, string memory _jsonData)
        public
        batchExists(_batchId)
        onlyRole(userContract.REGULATOR_ROLE())
    {
        Batch storage batch = batches[_batchId];
        require(batch.status == BatchStatus.Inspected, "Batch must be inspected");
        require(batch.passedInspection, "Must have passed inspection");

        batch.status = BatchStatus.Approved;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Approved", _jsonData);
        emit BatchApproved(_batchId, msg.sender, block.timestamp);
        emit BatchStatusChanged(_batchId, BatchStatus.Inspected, BatchStatus.Approved, msg.sender, block.timestamp);
    }

    function rejectBatch(string memory _batchId, string memory _jsonData)
        public
        batchExists(_batchId)
        onlyRole(userContract.REGULATOR_ROLE())
    {
        Batch storage batch = batches[_batchId];
        require(batch.status == BatchStatus.Inspected, "Batch must be inspected");

        batch.status = BatchStatus.Rejected;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Rejected", _jsonData);
        emit BatchRejected(_batchId, _jsonData, msg.sender, block.timestamp);
        emit BatchInspected(_batchId, false, msg.sender, block.timestamp);
        emit BatchStatusChanged(_batchId, BatchStatus.Inspected, BatchStatus.Rejected, msg.sender, block.timestamp);
    }

    function addRecord(string memory _batchId, string memory _stage, string memory _content)
        public
        batchExists(_batchId)
    {
        batchRecords[_batchId].push(Record({
            stage: _stage,
            content: _content,
            createdBy: msg.sender,
            createdAt: block.timestamp
        }));

        emit RecordAdded(_batchId, _stage, _content, msg.sender, block.timestamp);
    }

    // --- Getter Functions ---
    function getBatchById(string memory _batchId)
        public
        view
        returns (
            string memory,
            address,
            string memory,
            uint256,
            BatchStatus,
            bool,
            uint256
        )
    {
        require(batches[_batchId].exists, "Batch does not exist");
        Batch memory b = batches[_batchId];
        return (
            b.batchId,
            b.owner_wallet_address,
            b.animalType,
            b.createdAt,
            b.status,
            b.exists,
            b.updatedAt
        );
    }

    function getAllBatchIds() public view returns (string[] memory) {
        return allBatchIds;
    }

    function getBatchRecordsByBatchId(string memory _batchId) public view returns (Record[] memory) {
        return batchRecords[_batchId];
    }

    function getAllBatchRecords() public view returns (Record[] memory) {
        uint256 totalRecords = 0;
        for (uint256 i = 0; i < allBatchIds.length; i++) {
            totalRecords += batchRecords[allBatchIds[i]].length;
        }

        Record[] memory allRecords = new Record[](totalRecords);
        uint256 index = 0;

        for (uint256 i = 0; i < allBatchIds.length; i++) {
            Record[] memory records = batchRecords[allBatchIds[i]];
            for (uint256 j = 0; j < records.length; j++) {
                allRecords[index++] = records[j];
            }
        }

        return allRecords;
    }

    function getBatchReadableStatus(string memory _batchId) public view returns (string memory) {
        BatchStatus status = batches[_batchId].status;
        if (status == BatchStatus.Created) return "Created";
        if (status == BatchStatus.Fed) return "Fed";
        if (status == BatchStatus.Slaughtered) return "Slaughtered";
        if (status == BatchStatus.Inspected) return "Inspected";
        if (status == BatchStatus.Approved) return "Approved";
        if (status == BatchStatus.Recheck) return "Recheck";
        if (status == BatchStatus.Rejected) return "Rejected";
        return "Unknown";
    }
}
