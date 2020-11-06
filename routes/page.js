const express = require('express');
const router = express.Router();


router.get('/login', async (req, res, next) => {
    res.render('login', {
        title: '华北圆通',
    });
});
router.use((req, res, next) => {
    let users = req.session.users;
    if (!users) {
        res.redirect('/login');
        return
    }
    next();
});
router.get('/*', async (req, res, next) => {
    let USER = req.session.users || {};

    res.render('index', {
        title: '华北圆通',
        USER
    });
});
module.exports = router;
