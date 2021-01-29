/**
 * Created by zhangyuntao on 2018/10/9.
 */
const express = require('express');
const router = express.Router();


const count = require('../controller/count');
const user = require('../controller/user');
const views = require('../controller/views');
const client = require('../models/redis');

//users 
router.post('/userlogin', (req, res) => {
    user.login(req, res);
});
router.post('/userout', (req, res) => {
    user.logout(req, res);
});
// router.use((req, res, next) => {
//     let users = req.session.yto_u;
//     if (!users) {
//         res.json({ code: 302, data: '/' });
//         return
//     }
//     next();
// });


router.use((req, res, next) => {
    if (!req.session.yto_u) {
        res.json({ code: 302, data: '/' });
        return
    }
    let yto_u = req.session.yto_u;
    let { id, clientID } = yto_u;

    client.get(id, async (err, reply) => {
        if (err) {
            next(err);
        } else {
            if (reply) {
                let r = JSON.parse(reply);
                if (clientID != r.clientID) {
                    req.session.destroy((err) => {
                        res.json({ code: 402, data: '/' })
                        return
                    })
                } else {
                    res.cookie('yto_u', yto_u, { signed: true, maxAge: 60 * 1000, httpOnly: true });
                    next();

                }
            } else {

                res.json({ code: 302, data: '/' });
                return

            }
        }
    });

});


router.get('/every10Min', (req, res) => {
    views.every10Min(req, res);
});
router.get('/totalcount', (req, res) => {
    views.totalCount(req, res);
});
router.get('/outVol', (req, res) => {
    views.outVol(req, res);
});





//下车
router.post('/countgroup', (req, res) => {
    count.countgroup(req, res);
});
router.get('/countgroup', (req, res) => {
    count.countgroupOne(req, res);
});


//重复
router.get('/repeat', (req, res) => {
    count.repeated(req, res);
});
router.get('/repeateddetail', (req, res) => {
    count.repeateddetail(req, res);
});




router.get('/settings/:settings', (req, res) => {
    count.getSettings(req, res);
});


//环保袋使用量
router.get('/count/package', (req, res) => {
    count.countPackage(req, res);
});
router.get('/orders/:ids', (req, res) => {
    count.orders(req, res);
});





module.exports = router;