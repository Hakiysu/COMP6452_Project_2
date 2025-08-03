// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MeatBatchContract {
    enum BatchStatus {
        Created,
        Fed,
        Slaughtered,
        Inspected,
        Approved,
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
    }

    struct Record {
        string stage;
        string content;
        address createdBy;
        uint256 createdAt;
    }

    address public regulator;

    mapping(string => Batch) public batches;
    mapping(string => Record[]) public batchRecords;
    string[] public allBatchIds;

    modifier onlyRegulator() {
        require(
            msg.sender == regulator,
            "Only regulator can perform this action"
        );
        _;
    }

    modifier onlyOwner(string memory _batchId) {
        require(
            batches[_batchId].owner_wallet_address == msg.sender,
            "Only batch owner can perform this action"
        );
        _;
    }

    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].exists, "Batch does not exist");
        _;
    }

    event BatchCreated(
        string batchId,
        address owner,
        string animalType,
        uint256 timestamp
    );
    event RecordAdded(
        string batchId,
        string stage,
        address createdBy,
        uint256 timestamp
    );
    event BatchStatusUpdated(
        string batchId,
        BatchStatus status,
        uint256 timestamp
    );
    event BatchInspected(
        string batchId,
        bool approved,
        string remarks,
        uint256 timestamp
    );

    constructor() {
        regulator = msg.sender;
    }

    function createBatch(
        string memory _batchId,
        string memory _animalType
    ) public {
        require(!batches[_batchId].exists, "Batch ID already exists");

        batches[_batchId] = Batch({
            batchId: _batchId,
            owner_wallet_address: msg.sender,
            animalType: _animalType,
            status: BatchStatus.Created,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            exists: true
        });

        allBatchIds.push(_batchId);
        emit BatchCreated(_batchId, msg.sender, _animalType, block.timestamp);
    }

    function feedBatch(
        string memory _batchId,
        string memory _jsonData
    ) public onlyOwner(_batchId) batchExists(_batchId) {
        Batch storage batch = batches[_batchId];
        require(
            batch.status == BatchStatus.Created,
            "Batch must be in created state to feed"
        );
        batch.status = BatchStatus.Fed;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Fed", _jsonData);

        emit BatchStatusUpdated(_batchId, batch.status, block.timestamp);
    }

    function slaughterBatch(
        string memory _batchId,
        string memory _jsonData
    ) public batchExists(_batchId) {
        Batch storage batch = batches[_batchId];
        require(
            batch.status == BatchStatus.Fed,
            "Batch must be in fed state to slaughter"
        );
        batch.status = BatchStatus.Slaughtered;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Slaughtered", _jsonData);

        emit BatchStatusUpdated(_batchId, batch.status, block.timestamp);
    }

    function inspectBatch(
        string memory _batchId,
        string memory _jsonData
    ) public onlyRegulator batchExists(_batchId) {
        Batch storage batch = batches[_batchId];
        require(
            batch.status == BatchStatus.Slaughtered,
            "Batch must be in slaughtered state to inspect"
        );
        batch.status = BatchStatus.Inspected;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Inspected", _jsonData);

        emit BatchStatusUpdated(_batchId, batch.status, block.timestamp);
    }

    function approveBatch(
        string memory _batchId,
        string memory remarks
    ) public onlyRegulator batchExists(_batchId) {
        Batch storage batch = batches[_batchId];
        require(
            batch.status == BatchStatus.Inspected,
            "Batch must be in inspected state to approve"
        );
        batch.status = BatchStatus.Approved;
        batch.updatedAt = block.timestamp;

        addRecord(_batchId, "Approved", remarks);

        emit BatchInspected(_batchId, true, remarks, block.timestamp);
    }

    function addRecord(
        string memory _batchId,
        string memory _stage,
        string memory _content
    ) public batchExists(_batchId) {
        batchRecords[_batchId].push(
            Record({
                stage: _stage,
                content: _content,
                createdBy: msg.sender,
                createdAt: block.timestamp
            })
        );

        emit RecordAdded(_batchId, _stage, msg.sender, block.timestamp);
    }

    // function progressStatus(string memory _batchId)
    //     public
    //     batchExists(_batchId)
    // {
    //     Batch storage batch = batches[_batchId];
    //     require(batch.status != BatchStatus.Approved && batch.status != BatchStatus.Rejected, "Cannot progress completed batch");
    //     batch.status = BatchStatus(uint(batch.status) + 1);
    //     batch.updatedAt = block.timestamp;

    //     emit BatchStatusUpdated(_batchId, batch.status, block.timestamp);
    // }

    // function inspectBatch(string memory _batchId, bool approve, string memory remarks)
    //     public
    //     batchExists(_batchId)
    //     onlyRegulator
    // {
    //     Batch storage batch = batches[_batchId];
    //     require(batch.status == BatchStatus.Inspected, "Batch must be in inspected state");
    //     batch.status = approve ? BatchStatus.Approved : BatchStatus.Rejected;
    //     batch.updatedAt = block.timestamp;

    //     addRecord(_batchId, approve ? "Approved" : "Rejected", remarks);

    //     emit BatchInspected(_batchId, approve, remarks, block.timestamp);
    // }

    function getBatchById(
        string memory _batchId
    )
        public
        view
        returns (
            string memory batchId,
            address owner_wallet_address,
            string memory animalType,
            uint256 createdAt,
            BatchStatus status,
            bool exists,
            uint256 updatedAt
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
        );}

    function getAllBatchIds() public view returns (string[] memory) {
        return allBatchIds;
    }

    function getBatchRecords(
        string memory _batchId
    ) public view returns (Record[] memory) {
        return batchRecords[_batchId];
    }
}
