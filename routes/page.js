const express = require('express');
const router = express.Router();
const client = require('../models/redis');


router.get('/login', async (req, res, next) => {
    res.render('login', {
        title: '华北圆通',
    });
});



// router.use((req, res, next) => {


//     if (!req.session.yto_u) {
//         res.redirect('/login');
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
//                         res.redirect('/login');
//                         return
//                     })
//                 } else {
//                     next();

//                 }
//             } else {

//                 res.redirect('/login');
//                 return

//             }
//         }
//     });

// });


router.get('/*', async (req, res, next) => {
    let USER = req.session.yto_u || '';

    res.render('index', {
        title: '华北圆通',
        USER
    });
});
module.exports = router;
