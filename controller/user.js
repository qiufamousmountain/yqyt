/**
 */
// const path = require('path');//解析需要遍历的文件夹
const { users } = require('../config/config.json')
// const utils = require('./utils');
const crypto = require('crypto');

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
            let USER = user['user'];
            req.session.yto_u = USER;
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
        req.session.destroy((err) => {
            res.json({ code: 200, data: '/' })
        })


    },
};
