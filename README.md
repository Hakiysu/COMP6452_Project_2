# COMP6452\_Project\_2

A PoC blockchain-based meat supply chain system developed. The system uses Ethereum smart contracts, off-chain storage, and off-chain computation to trace and manage the lifecycle of meat batches.

---

## 📦 Main Tech Stack

| Component          | Technology               |
| ------------------ | ------------------------ |
| Smart Contract     | Solidity + OpenZeppelin  |
| Blockchain Tooling | Hardhat + Ethers.js      |
| Backend API        | Express.js + Node.js     |
| Database           | SQLite3 (off-chain data) |
| API Testing        | Postman                  |

---

## 🗂 Project Structure

```
COMP6452_Project_2/
├── configs/                     # Configuration files
│   └── accounts.json            # Accounts with addresses and private keys 
├── contracts/                   # Solidity smart contracts
│   ├── MeatBatchContract.sol    # Business logic for batch lifecycle
│   └── UserAccessControl.sol    # User role management
├── controllers/                 # Request/response logic, handles API calls, and interacts with services
│   ├── meatBatchController.js
│   └── userController.js
├── database/                    # Off-chain SQLite database
│   ├── init.js                  
│   ├── backend.db
│   └── index.js
├── ignition/                    # Hardhat deployment
│   └── modules/
│       ├── deploy2EthSepolia.js
│       └── deploy2Localhost.js
├── routes/                      # Express.js API routes, transfers requests to controllers
│   ├── router.js
│   ├── meatBatchRouter.js
│   └── userRouter.js
├── services/                    # Business logic layer, interacts with contracts and local database
│   ├── contract/
│   │   ├── utils.js
│   │   ├── meatBatchContractService.js
│   │   └── userContractService.js
│   ├── userService.js
│   └── meatBatchService.js
├── tests/                       # Test cases for project
│   ├── batch_test.js
│   └── user_test.js
├── app.js                       # Main Express entrypoint
├── config.js                    # Hardhat/contract setup
├── hardhat.config.js            # Hardhat project config
├── package.json                 # NPM dependencies
└── README.md                    # This file
```

---

## 📚 Dependencies

### Runtime

* `express`: Web server
* `ethers`: Ethereum JavaScript library
* `sqlite3`: Off-chain lightweight DB
* `@openzeppelin/contracts`: Role-based smart contract templates

### Development

* `hardhat`: Ethereum development environment, it contain ethers.js
* `@nomicfoundation/hardhat-toolbox`: Hardhat plugins/tools

Install them via:

```bash
npm ci
```

---

## 🚀 How to Run

1. **Install dependencies**

```bash
npm ci # if you download package-lock.json
```

2. **Compile contracts**

```bash
npx hardhat compile
```

3. **Start local blockchain**

```bash
npx hardhat node
```

4. **Deploy contracts**

```bash
npx hardhat ignition deploy ./ignition/modules/deploy2Localhost.js --network localhost
```

5. **Initialize SQLite database**

```bash
node database/init.js
```
This will create a `backend.db` file in the `database` directory.


6. **Start backend server**

```bash
node app.js
```

7. **Use Postman to test API endpoints**
```
Example endpoint: `GET http://localhost:3000/api/meatBatch/getAll`
```
---

## 🔗 Modules Overview

### MeatBatch Module

Handles meat batch lifecycle: creation, feeding, slaughtering, inspection pass or fail, and approval/rejection.

| Route                                                 | Description                        |
| ----------------------------------------------------- | ---------------------------------- |
| `POST /api/meatBatch/createBatch`                     | Create a new meat batch            |
| `POST /api/meatBatch/feedBatch`                       | Add feeding record                 |
| `POST /api/meatBatch/slaughterBatch`                  | Add slaughter record               |
| `POST /api/meatBatch/inspectBatchPass`                | Add inspection record              |
| `POST /api/meatBatch/inspectBatchFail`                | Add inspection failure record      |
| `POST /api/meatBatch/approveBatch`                    | Approve a batch                    |
| `POST /api/meatBatch/rejectBatch`                     | Reject a batch                     |
| `GET  /api/meatBatch/getAll`                          | Get all batches                    |
| `POST /api/meatBatch/getRecordByBatchId`              | Get off-chain batch data           |
| `POST /api/meatBatch/getBatchByIdOnchain`             | Get batch by ID (on-chain)         |
| `POST /api/meatBatch/getBatchRecordsByBatchIdOnchain` | Get batch records by ID (on-chain) |

### User Module

Manages roles for users (FARMER_ROLE, SLAUGHTER_ROLE, INSPECTOR_ROLE, REGULATOR_ROLE).

| Route                        | Description                 |
| ---------------------------- | --------------------------- |
| `POST /api/user/add`         | Add user with specific role |
| `POST /api/user/remove`      | Remove user from system     |
| `GET /api/user/get/:address` | Get role info by address    |
| `GET /api/user/all`          | Get all registered users    |
| `POST /api/user/balance`     | Get users balance           |

---

## 🧾 On-chain vs Off-chain Data

### On-chain

* Batch ID
* Owner wallet address
* Animal type
* Integrated record data
* Status & timestamps
* Role-based access control (RBAC)

### Off-chain (SQLite)

* User registration & role info
* Batch content (e.g. vaccine, fodder details)
* Regulator metadata/actions

---

## 🤓 User Address Role Mapping

| Role      | Accounts   |
| --------- | ---------- |
| Admin     | #0         |
| Farmer    | #1 \~ #5   |
| Slaughter | #6 \~ #10  |
| Inspector | #11 \~ #15 |
| Regulator | #16 \~ #19 |

You may refer to Hardhat's local network default accounts. **Never use them on mainnet.**

I pasted them in Postman test as comments for convenience.

---

## 📁 Sample Postman Collection

Import this into Postman to test endpoints:
[🔗 Postman Collection Link](https://web.postman.co/workspace/My-Workspace~649170c6-b220-46b4-83ff-0a551cea2067/collection/34364349-a0030d78-6c21-487d-82aa-41451c3355ed)

Or you can download the collection file (xxx.json) from the repository and import it manually.

---

## 📌 Notes

* Chain data is authoritative for ownership and access control.
* Off-chain DB is for UI/data expansion/testing purposes.
* User role assignment/revocation only exists on-chain, but user metadata is stored locally.
* Backend (`Express.js`) acts as an **oracle** to bridge smart contract data and database logic.

---

