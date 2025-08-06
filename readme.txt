📚 Dependencies
Runtime
    express: Web server
    ethers: Ethereum JavaScript library
    sqlite3: Off-chain lightweight DB
    @openzeppelin/contracts: Role-based smart contract templates
Development
    hardhat: Ethereum development environment, it contain ethers.js
    @nomicfoundation/hardhat-toolbox: Hardhat plugins/tools
Install them via: npm ci



🚀 How to Run
1. Install dependencies
    npm ci # if you download package-lock.json, it already uploaded to Github
2. Compile contracts
    npx hardhat compile
3. Start local blockchain
    npx hardhat node
4. Deploy contracts on local env
    npx hardhat ignition deploy ./ignition/modules/deploy2Localhost.js --network localhost
5. Initialize SQLite database
    node database/init.js
# This will create a backend.db file in the database directory.
6. Start backend server
    node app.js
# Use Postman to test API endpoints
# Example endpoint: `GET http://localhost:3000/api/meatBatch/getAll`

7. Run blockchain unit test
    npx hardhat test
# it will run test files (batch_test.js & user_test.js) in test directory via hardhat 