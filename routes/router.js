const express = require('express');
const router = express.Router();
const path = require('path');
const meatBatchRoutes = require('./meatBatchRouter');
const regulatorRoutes = require('./regulatorRouter');
// ...其它路由模块

// let user login, use index.html as home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));

});

router.use('/meatBatch', meatBatchRoutes);
router.use('/regulator', regulatorRoutes);

// test json request and response
router.post('/test', (req, res) => {
    console.log("Received data:", req.body);
    res.json({ success: true, message: "Data received successfully", data: req.body });
});

module.exports = router;