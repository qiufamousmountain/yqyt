/**
 * Created by zhangyuntao on 2018/10/9.
 */
const express = require('express');
const router = express.Router();


const count = require('../controller/count');
const user = require('../controller/user');
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


// router.use((req, res, next) => {


//     if (!req.session.yto_u) {
//         res.json({ code: 302, data: '/' });
//         return
//     }
//     let { id, clientID } = req.session.yto_u;

//     client.get(id, async (err, reply) => {
//         if (err) {
//             next(err);
//         } else {
//             if (reply) {
//                 let r = JSON.parse(reply);
//                 if (clientID != r.clientID) {
//                     req.session.destroy((err) => {
//                         res.json({ code: 402, data: '/' })
//                         return
//                     })
//                 } else {
//                     next();

//                 }
//             } else {

//                 res.json({ code: 302, data: '/' });
//                 return

//             }
//         }
//     });

// });

//下车
router.post('/count/gotc', (req, res) => {
    count.countgotc(req, res);
});
router.get('/count/egotc', (req, res) => {
    count.countgotcOne(req, res);
});

//上车狂扫
router.post('/count/gitc', (req, res) => {
    count.countgitc(req, res);
});
router.get('/count/egitc', (req, res) => {
    count.countgitcOne(req, res);
});
//上车pda

router.post('/count/gipda', (req, res) => {
    count.countgipda(req, res);
});
router.get('/count/egipda', (req, res) => {
    count.countgipdaOne(req, res);
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