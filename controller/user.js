/**
 */
// const path = require('path');//解析需要遍历的文件夹
const { users } = require('../config/config.json')
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
        if (!users[id]) {
            res.json({
                code: 500,
                msg: '该用户不存在 '
            });
            return
        }
        let data = {}

        if (users[id]['id'] === id && users[id]['password'] == password) {
            let USER = users[id]['user'];
            req.session.users = USER;
            data = {
                code: 200,
                data: '登录成功',
            }
        } else {
            data = {
                code: 500,
                data: '密码错误',
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
