/**
 * Created by zhangyuntao on 2018/10/9.
 */
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    next()

});
const count = require('../controller/count');
const user = require('../controller/user');
//users 
router.post('/userlogin', (req, res) => {
    user.login(req, res);
});
router.post('/userout', (req, res) => {
    user.logout(req, res);
});
router.use((req, res, next) => {
    let users = req.session.users;
    if (!users) {
        res.json({ code: 302, data: '/' });
        return
    }
    next();
});
router.post('/count/groups', (req, res) => {
    count.countGroups(req, res);
});
router.get('/count/egroup', (req, res) => {
    count.countGroupOne(req, res);
});
router.get('/orders/:ids', (req, res) => {
    count.orders(req, res);
});

router.get('/testttt', (req, res) => {
    count.testttt(req, res);
});




module.exports = router;