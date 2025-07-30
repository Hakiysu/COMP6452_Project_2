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