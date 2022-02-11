/**
 */
// const path = require('path');//解析需要遍历的文件夹
const { users } = require('../config/config.json')
// const utils = require('./utils');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid')
const client = require('../models/redis');

module.exports = {

    login: async (req, res) => {
        const { id, password } = req.body;
        if (!id) {
            res.json({
                code: 500,
                msg: 'params has no id '
            });
            return
        }
        let user = users[id]
        if (!user) {
            res.json({
                code: 500,
                msg: '该用户不存在 '
            });
            return
        }
        let data = {}
        let hash = crypto.createHmac('sha256', "b4345e81163a950f")
            .update(user['password'])
            .digest('hex');

        if (user['id'] === id && hash == password) {
            // let USER = user['user'];
            // client.get(id, async (err, reply) => {
            //     if (err) {
            //         next(err);
            //     } else {
            //         if (reply) {
            //             let r = JSON.parse(reply);
            //         } else {
            //             let clientID = uuidv1();
            //             req.session.yto_u = { id, clientID, USER }
            //             client.set(redisKey, JSON.stringify({ id, clientID, USER }), (err, reply) => {
            //                 client.expire(redisKey, 300)
            //             });

            //         }
            //     }
            // });

            let USER = user['user'];
            let clientID = uuidv1();
            req.session.yto_u = { id, clientID, USER }
            client.set(id, JSON.stringify({ id, clientID, USER }), (err, reply) => {
                client.expire(id, 3600 * 24)
            });

            // req.session.destroy((err) => {
            //     res.json({ code: 402, data: '/' })
            // })


            data = {
                code: 200,
                data: '登录成功',
            }
        } else {
            data = {
                code: 500,
                msg: '密码错误',
            }
        }

        res.json(data)

    },
    addUser: async (req, res) => {


    },
    logout: async (req, res) => {

        let { id } = req.session.yto_u
        client.del(id);
        req.session.destroy((err) => {
            res.json({ code: 200, data: '/' })
        })


    },
};
