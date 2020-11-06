/**
 * Created by zhangyuntao on 2018/10/9.
 */
const express = require('express');
const router = express.Router();

router.use((req, res,next) => {
   next()

});
const count = require('../controller/count');
router.post('/count/groups', (req, res) => {
    count.countGroups(req, res);
});
router.get('/count/egroup', (req, res) => {
    count.countGroupOne(req, res);
});

module.exports = router;