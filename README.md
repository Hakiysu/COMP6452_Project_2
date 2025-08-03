# COMP6452_Project_2


## Dev Environment
- **VSCode**: Use for code editing and debugging.
- **Node.js**: Ensure you have Node.js installed for running the backend and Hardhat
- **Hardhat**: Use for local blockchain development and testing.
- **Postman**: Use for testing the RESTful API endpoints.
- **Solidity**: Use for writing smart contracts.
- **Ethers.js**: Use for interacting with the Ethereum blockchain in the backend.
- **Express.js**: Use for building the RESTful API server.
- **Mocha/Chai**: Use for testing the backend and smart contracts.
- **Sqlite**: Optional, for lightweight database needs.

## Project Structure
```
COMP6452_Project_2/
├── artifacts/                 # Hardhat 编译后的 ABI 和合约字节码（自动生成）
├── cache/                     # Hardhat 编译缓存（自动生成）
├── contracts/                 # Solidity 合约源码
│   ├── Lock.sol
│   └── MeatBatch.sol
├── ignition/                  # Hardhat Ignition 自动部署模块（可选）
│   └── modules/
│       └── meatBatch.js       # Ignition 部署配置
├── node_modules/              # Node.js 依赖目录
├── routes/                    # 路由定义（Express）
│   └── batch.js               # 示例：GET /batchId 读取链上数据
├── services/                  # 服务层（调用 ethers.js 连接链）
│   └── meatContract.js        # 导出合约对象，用于调用合约方法
├── scripts/                   # 手动部署脚本
│   └── deploy.js              # 使用 ethers 部署合约
├── test/                      # 测试脚本
│   └── lock.js
├── abi.js                     # 从 artifacts 里提取的精简 ABI（可选）
├── app.js                     # Express 应用入口
├── config.js                  # 项目配置文件（RPC、私钥、合约地址等）
├── hardhat.config.js          # Hardhat 配置
├── package.json               # 项目信息与依赖
├── package-lock.json          # 锁定依赖版本
└── README.md                  # 项目说明

```


## Backend
It will act as a RESTful API server, providing endpoints for the frontend to interact with the blockchain.

- Dependencies:
  - Express.js: For building the RESTful API server.
  - Ethers.js: For interacting with the Ethereum blockchain.
  - Body-parser: For parsing incoming request bodies.
  - Hardhat (for local blockchain)
  - Mocha/Chai (for testing)

- ROUTES:
  - `/api/trace`: Endpoint to trace the history of a meat product.

# HOW TO RUN
1. npx hardhat node: start a local blockchain node.
2. node app.js: start the local backend server.
3. npx hardhat ignition deploy ./ignition/modules/MeatBatchModule.js --network localhost
   - This will deploy the MeatBatch contract to the local blockchain.
4. Use Postman or a web browser to access the API endpoints. (I write some simple webpage to test the API)
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