/**
 * Created by zhengliuyang on 2018/10/9.
 */

const { pool } = require('../models/sql')
const { sql_m, sql_moni } = require('../config/config.json');

const { gotc, gotcView } = require('../config/gotc.json')
const { gitc, gitcView } = require('../config/gitc.json')
const { gipda, gipdaView } = require('../config/gipda.json')

const Moment = require('moment')
const mysql = require('mysql');
const list = ['t_exp_waybill_check_0', 't_exp_waybill_check_1', 't_exp_waybill_check_2', 't_exp_waybill_check_3', 't_exp_waybill_check_4', 't_exp_waybill_check_5', 't_exp_waybill_check_6', 't_exp_waybill_check_7', 't_exp_waybill_check_8', 't_exp_waybill_check_9']


const connectionPromise = ({ g, sql }) => {
    return new Promise(function (resolve, reject) {

        pool.getConnection((err, conn) => {
            if (err) {
                // console.log('和mysql数据库建立连接失败' + sql)
                console.log(err)
                return resolve({ g, count: 0 })

            }
            // console.log('和mysql数据库连接成功');
            conn.query(sql, (err2, result) => {
                conn.release();

                if (err2) {
                    console.log('查询数据库失败' + sql);
                    return resolve({ g, count: 0 })

                }
                // console.log(result[0]["count(0)"]);
                return resolve({ g, count: result[0]["count(0)"] })

            })

        });

    })
}

const countGroup = (result) => {
    let data = {}

    for (let i = 0; i < result.length; i++) {
        if (data.hasOwnProperty(result[i].g)) {
            data[result[i].g] = data[result[i].g] + result[i].count

        } else {
            data[result[i].g] = result[i].count

        }
    }
    let arr = []
    for (let g in data) {
        if (data.hasOwnProperty(g)) {
            arr.push({
                group: g, count: data[g]
            })
        }

    }

    return arr
}

const connectionIPPromise = ({ ip, sql }) => {

    return new Promise(function (resolve, reject) {

        pool.getConnection((err, conn) => {
            if (err) {
                console.log('和mysql数据库建立连接失败' + sql)
                console.log(err)
                return resolve({ ip, count: 0 })

            }
            // console.log('和mysql数据库连接成功');
            conn.query(sql, (err2, result) => {
                conn.release();

                if (err2) {
                    console.log('查询数据库失败' + sql);
                    return resolve({ ip, count: 0 })

                }
                return resolve({ ip, count: result[0]["count(0)"] })

            })

        });



    })
}

const countIP = (result, view) => {
    let data = {}
    for (let i = 0; i < result.length; i++) {
        if (data.hasOwnProperty(result[i].ip)) {
            data[result[i].ip] = data[result[i].ip] + result[i].count

        } else {
            data[result[i].ip] = result[i].count

        }
    }
    let arr = []
    for (let ip in data) {
        if (data.hasOwnProperty(ip)) {
            arr.push({
                ip: view[ip], count: data[ip]
            })
        }



    }
    return arr
}
module.exports = {

    //下车
    countgotcOne: async (req, res) => {

        let { btime, etime, group } = req.query;

        if (!btime || !etime || !gotc[group] || gotc[group].length < 1) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        btime = btime.split('/').join('-')

        etime = etime.split('/').join('-')

        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < gotc[group].length; j++) {
                let ip = gotc[group][j]
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL='${ip}' and (create_time between '${btime}' and '${etime}')`
                totalList.push({ ip, sql })

            }
        }

        let promistList = totalList.map(m => connectionIPPromise(m))
        Promise.all(promistList).then((result) => {
            // console.log(result,)               //['成功了', 'success']

            // pool.end()

            res.send({ code: 200, data: countIP(result, gotcView[group]), group })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },

    countgotc: async (req, res) => {

        let { btime, etime, group } = req.body;
        console.log(btime, etime, group)
        if (!btime || !etime || group.length < 1) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }

        btime = btime.split('/').join('-')
        etime = etime.split('/').join('-')

        // const pool = mysql.createPool(config.sql);
        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < group.length; j++) {

                let ips = gotc[group[j]].join("','")
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL in ('${ips}') and (create_time between '${btime}' and '${etime}')`
                totalList.push({ g: group[j], sql })

            }
        }

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            //console.log(result,)               //['成功了', 'success']

            // pool.end()
            res.send({ code: 200, data: countGroup(result) })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },

    //详单查询
    orders: async (req, res) => {
        let { ids } = req.params;
        if (!ids && ids !== '0') {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        ids = ids.trim()
        let page = ids.charAt(ids.length - 1);
        if (isNaN(page)) {
            res.send({
                code: 500,
                msg: '请输入正确的单号'
            })
            return;
        }
        let sql = `select WAYBILL_NO, OP_CODE,CREATE_TIME, CONTAINER_NO,MODIFY_TERMINAL from t_exp_waybill_check_${page} where WAYBILL_NO = '${ids}'`;
        let osql = `select waybillNo, latticeNo,createDate from t_exp_waybill_check_${page} where waybillNo = '${ids}' and opCode='171'`;
        let connectionPromise = (db, sql) => {
            let connection = mysql.createConnection(db);
            return new Promise(function (resolve, reject) {
                connection.connect(function (err) {
                    if (err) {
                        console.log(err)
                        return resolve({ code: 500, msg: 'connect db error' })
                    }

                });
                connection.query(sql, function (err, result) {
                    connection.end();
                    if (err) {
                        console.log('查询数据库失败' + sql);
                        return resolve({ code: 500, msg: 'select db error' })
                    }
                    return resolve(result)

                });
            })
        }

        let mainData = await connectionPromise(sql_m, sql);
        let oData = await connectionPromise(sql_moni, osql);
        // console.log(mainData, '------------mainData------------------')
        // console.log(oData, '----------------oData--------------')
        if (mainData.code == 500) {

            res.send(mainData);
            return
        }

        mainData = mainData.map(m => {

            m['latticeNo'] = ''


            if (!(oData.code == 500)) {
                for (let i = 0; i < oData.length; i++) {

                    let tm = Moment(m.CREATE_TIME).diff(Moment(oData[i].createDate), 'minute')

                    if (Math.abs(tm) < 2) {

                        m['latticeNo'] = oData[i].latticeNo
                    }

                }
            }


            return m
        })

        res.send({ code: 200, data: mainData })

    },


    //上车狂扫
    countgitcOne: async (req, res) => {

        let { btime, etime, group } = req.query;

        if (!btime || !etime || !gitc[group] || gitc[group].length < 1) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        btime = btime.split('/').join('-')
        etime = etime.split('/').join('-')
        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < gitc[group].length; j++) {
                let ip = gitc[group][j]
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL='${ip}' and (create_time between '${btime}' and '${etime}')`
                totalList.push({ ip, sql })

            }
        }

        let promistList = totalList.map(m => connectionIPPromise(m))
        Promise.all(promistList).then((result) => {
            // console.log(result,)               //['成功了', 'success']

            // pool.end()

            res.send({ code: 200, data: countIP(result, gitcView[group]), group })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },

    countgitc: async (req, res) => {

        let { btime, etime, group } = req.body;
        console.log(btime, etime, group)
        if (!btime || !etime || group.length < 1) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }

        btime = btime.split('/').join('-')
        etime = etime.split('/').join('-')

        // const pool = mysql.createPool(config.sql);

        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < group.length; j++) {

                let ips = gitc[group[j]].join("','")
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL in ('${ips}') and (create_time between '${btime}' and '${etime}')`
                totalList.push({ g: group[j], sql })

            }
        }

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            //console.log(result,)               //['成功了', 'success']

            // pool.end()
            res.send({ code: 200, data: countGroup(result) })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },
    //上车pda
    countgipdaOne: async (req, res) => {
        let { btime, etime, group } = req.query;
        if (!btime || !etime || !gipda[group] || gipda[group].length < 1) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        btime = btime.split('/').join('-')
        etime = etime.split('/').join('-')
        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < gipda[group].length; j++) {
                let ip = gipda[group][j]
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL='${ip}' and (create_time between '${btime}' and '${etime}')`
                totalList.push({ ip, sql })
            }
        }

        let promistList = totalList.map(m => connectionIPPromise(m))
        Promise.all(promistList).then((result) => {
            res.send({ code: 200, data: countIP(result, gipdaView[group]), group })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })
        })

    },
    countgipda: async (req, res) => {

        let { btime, etime, group } = req.body;
        console.log(btime, etime, group)
        if (!btime || !etime || group.length < 1) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }

        btime = btime.split('/').join('-')
        etime = etime.split('/').join('-')

        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < group.length; j++) {
                let ips = gipda[group[j]].join("','")
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL in ('${ips}') and (create_time between '${btime}' and '${etime}')`
                totalList.push({ g: group[j], sql })

            }
        }

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            res.send({ code: 200, data: countGroup(result) })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },

    //包使用量
    countPackage: async (req, res) => {

        let { btime, etime } = req.query;
        if (!btime || !etime) {
            res.send({
                code: 500,
                msg: 'query is invaid'
            })
            return;
        }

        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            let u = `select count(0) from ${list[i]}  where OP_CODE='110' and MODIFY_USER_NAME LIKE '%#9%' AND (CREATE_TIME between '${btime}' and '${etime}')`;
            let t = `select count(0) from ${list[i]}  where OP_CODE='110' and MODIFY_USER_NAME LIKE '%#%' AND (CREATE_TIME between '${btime}' and '${etime}')`;
            totalList.push({ g: '总数', sql: t }, { g: '已使用', sql: u })
        }


        let connectionPro = ({ g, sql }) => {
            let connection = mysql.createConnection(sql_m);
            return new Promise(function (resolve, reject) {
                connection.connect(function (err) {
                    if (err) {
                        console.log(err)
                        return resolve({ g, count: 0 })
                    }
                    connection.query(sql, function (err2, result) {
                        connection.end();
                        if (err2) {
                            console.log('查询数据库失败' + sql);
                            return resolve({ g, count: 0 })

                        }
                        console.log(result);
                        return resolve({ g, count: result[0]["count(0)"] })

                    });
                });

            })
        }
        let promistList = totalList.map(m => connectionPro(m))
        Promise.all(promistList).then((result) => {
            //console.log(result,)               //['成功了', 'success']

            let arr = []

            let useds = countGroup(result).filter(m => m.group == '已使用')
            let totals = countGroup(result).filter(m => m.group == '总数');

            arr.push(useds[0])
            arr.push({ "group": "未使用", "count":totals[0].count - useds[0].count })
            // pool.end()
            res.send({ code: 200, data: arr })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },
};