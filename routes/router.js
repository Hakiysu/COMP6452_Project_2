const express = require('express');
const router = express.Router();
const path = require('path');
const batchRoutes = require('./meatBatch');
const regulatorRoutes = require('./regulator');
// ...其它路由模块

// let user login, use index.html as home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));

});

router.use('/batch', batchRoutes);
router.use('/regulator', regulatorRoutes);

module.exports = router;