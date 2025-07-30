    // app.js
    const express = require('express');
    const bodyParser = require('body-parser');
    const { ethers } = require('ethers');

    const app = express();
    app.use(bodyParser.json());

    // Contract configuration
    const contractConfig = require('./config');


    // Contract address
    // maybe change, remember to update this from a new node deployment
    const contractAddress = contractConfig.CONTRACT_ADDRESS

    // Connect to local blockchain
    const provider = new ethers.JsonRpcProvider(contractConfig.RPC_URL);

    // 使用Hardhat本地默认第一个账户私钥作为 signer，通常会暴露在控制台里，先拿下来替换这里
    // Load signer from config, as admin account
    const privateKey = contractConfig.PRIVATE_KEY;
    const signer = new ethers.Wallet(privateKey, provider);

    // load routes
    const router = require('./routes/router');
    app.use('/api', router);





    // start the server
    const PORT = 3000;
    app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    });
