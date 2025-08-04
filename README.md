# COMP6452_Project_2


## Main Dev Environment
1. **Hardhat**: A development environment to compile, deploy, test, and debug Ethereum software.
2. **Solidity**: The programming language for writing smart contracts.
3. **Ethers.js**: A library for interacting with the Ethereum blockchain and its ecosystem.
4. **Express.js**: A web framework for building RESTful APIs.
5. **Postman**: A tool for testing APIs, useful for sending requests to the backend server.
6. **Node.js**: JavaScript runtime for building the backend server.

## Project Structure
```
COMP6452_Project_2/
├── artifacts/                      # Hardhat compiled contracts (automatically generated)
├── cache/                          # Hardhat compilation cache (automatically generated)
├── contracts/                      # Solidity contract source code
│   ├── MeatBatchContract.sol       # Meat batch contract
│   └── UserAccessControl.sol       # User access control contract
├── controllers/                    # Controllers for handling business logic
│   ├── meatBatchController.js      # Controller for meat batch operations
│   └── userController.js           # Controller for user operations
├── database/                       # Database files (e.g., SQLite, JSON)
│   ├── backend.db                  # Off-chain meat batch data
│   └── index.js                    # Database initialization and connection
├── ignition/                       # Hardhat Ignition deployment module (optional)
│   └── modules/
│       └── MeatBatchDeployment.js  # Ignition deployment configuration
├── node_modules/                   # Node.js dependencies
├── routes/                         # Route definitions (Express)
│   ├── router.js                   # Example: GET /batchId to read on-chain data
│   ├── meatBatchRouter.js          # Meat batch related routes
│   └── userRouter.js               # User related routes
├── services/                       # Service layer
│   ├── contract/                   # Controller for meat batch operations
│   │   ├── meatBatchContractService.js     # Business logic for meat batch operations
│   │   └── userContractService.js          # Controller for user operations
│   ├── userService.js              # Business logic for user operations
│   └── meatContract.js        # Exports contract object for calling contract methods
├── app.js                     # Express 应用入口
├── config.js                  # 项目配置文件（RPC、私钥、合约地址等）
├── hardhat.config.js          # Hardhat 配置
├── package.json               # 项目信息与依赖
├── package-lock.json          # 锁定依赖版本
└── README.md                  # 项目说明
```

# HOW TO RUN
1. Compile the contracts:
   - Run `npx hardhat compile` to compile the Solidity contracts.
2. Start a local blockchain node:
   - Run `npx hardhat node` to start a local blockchain node.
3. Start the local backend server:
   - Run `node app.js` to start the local backend server.
4. Deploy the contract:
   - Run `npx hardhat ignition deploy ./ignition/modules/MeatBatchDeployment.js --network localhost` to deploy the contract to the local blockchain.
5. Access the API endpoints:
   - Use Postman or a web browser to access the API endpoints. (I write some Postman scripts to test the API)
   - For example, `http://localhost:3000/api/batch` to access the meat batch API.






## MeatBatch Module
This module is responsible for managing the lifecycle of meat batches, including their creation, processing, and status updates. It interacts with the `MeatBatch` smart contract deployed on the blockchain.

1. /api/meatBatch: Endpoint to meat batch center
  1. /api/meatBatch/create: Endpoint to create a new meat batch
  2. /api/meatBatch/addRecord: Endpoint to add a record to a meat batch
  3. /api/meatBatch/getStatus: Endpoint to get the status of a meat batch by ID
  4. /api/meatBatch/getAll: Endpoint to get all meat batches
  5. /api/meatBatch/progress: Endpoint to progress a meat batch to the next stage
2. /api/regulator: Endpoint to register a new regulator center




# about data
OFFCHAIN: 
  meat_batches: id, batch_id, creator_wallet_address, animal_type, status, created_at, updated_at
  batch_records: id, batch_id, stage, content, created_by, created_at
  regulator_actions: id, action, action_data, wallet, timestamp, details
  users: id, wallet_address, role, created_at

ONCHAIN:
  meat_batches: id, batch_id, owner_wallet_address, animal_type, status, created_at, updated_at
  batch_records: id, batch_id, stage, content, created_by, created_at



# FARMER:
create batch: 
  createBatch(batchId, animalType, creator_wallet_address, create_timestamp, status)



ADDR：
0 as admin/creator
1-5 as farmer
6-10 as slaughter
11-15 as inspector
16-19 as regulator

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (10000 ETH)
Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba

Account #6: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (10000 ETH)
Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e

Account #7: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (10000 ETH)
Private Key: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356

Account #8: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (10000 ETH)
Private Key: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

Account #9: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (10000 ETH)
Private Key: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

Account #10: 0xBcd4042DE499D14e55001CcbB24a551F3b954096 (10000 ETH)
Private Key: 0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897

Account #11: 0x71bE63f3384f5fb98995898A86B02Fb2426c5788 (10000 ETH)
Private Key: 0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82

Account #12: 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a (10000 ETH)
Private Key: 0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1

Account #13: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec (10000 ETH)
Private Key: 0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd

Account #14: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (10000 ETH)
Private Key: 0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa

Account #15: 0xcd3B766CCDd6AE721141F452C550Ca635964ce71 (10000 ETH)
Private Key: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61

Account #16: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30 (10000 ETH)
Private Key: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0

Account #17: 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E (10000 ETH)
Private Key: 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd

Account #18: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 (10000 ETH)
Private Key: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0

Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e
