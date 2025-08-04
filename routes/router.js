const express = require('express');
const router = express.Router();
const path = require('path');
const meatBatchRoutes = require('./meatBatchRouter');
const userRoutes = require('./userRouter');
// ...其它路由模块

// let user login, use index.html as home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));

});

router.use('/meatBatch', meatBatchRoutes);
router.use('/user', userRoutes);


module.exports = router;