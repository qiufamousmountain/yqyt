/**
 * Created by zhengliuyang on 2018/10/9.
 */

const { pool } = require('../models/sql')
const { sql_m, sql_moni } = require('../config/config.json');

const { gotc, gotcView } = require('../config/gotc.json')
const { gitc, gitcView } = require('../config/gitc.json')

const Moment = require('moment')
const mysql = require('mysql');

const list = ['t_exp_waybill_check_0', 't_exp_waybill_check_1', 't_exp_waybill_check_2', 't_exp_waybill_check_3', 't_exp_waybill_check_4', 't_exp_waybill_check_5', 't_exp_waybill_check_6', 't_exp_waybill_check_7', 't_exp_waybill_check_8', 't_exp_waybill_check_9']
module.exports = {


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

        let connectionPromise = ({ ip, sql }) => {

            return new Promise(function (resolve, reject) {

                pool.getConnection((err, conn) => {
                    if (err) {
                        console.log('和mysql数据库建立连接失败' + sql)
                        console.log(err)
                        return reject(sql)

                    } else {
                        // console.log('和mysql数据库连接成功');
                        conn.query(sql, (err2, result) => {
                            if (err2) {
                                console.log('查询数据库失败' + sql);
                                return reject(sql)

                            } else {


                                conn.release();
                                return resolve({
                                    ip, count: result[0]["count(0)"]
                                })
                            }
                        })
                    }
                });



            })
        }
        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < gotc[group].length; j++) {
                let ip = gotc[group][j]
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL='${ip}' and (create_time between '${btime}' and '${etime}')`
                totalList.push({ ip, sql })

            }
        }

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            // console.log(result,)               //['成功了', 'success']
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
                        ip: gotcView[group][ip], count: data[ip]
                    })
                }

            }
            // pool.end()

            res.send({ code: 200, data: arr, group })
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

        let connectionPromise = ({ g, sql }) => {
            return new Promise(function (resolve, reject) {

                pool.getConnection((err, conn) => {
                    if (err) {
                        // console.log('和mysql数据库建立连接失败' + sql)
                        console.log(err)
                        return reject(sql)

                    } else {
                        // console.log('和mysql数据库连接成功');
                        conn.query(sql, (err2, result) => {
                            if (err2) {
                                console.log('查询数据库失败' + sql);
                                return reject(sql)

                            } else {
                                // console.log(result[0]["count(0)"]);
                                conn.release();
                                return resolve({
                                    g, count: result[0]["count(0)"]
                                })
                            }
                        })
                    }
                });

            })
        }




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
            // pool.end()
            res.send({ code: 200, data: arr })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },
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
        console.log(mainData, '------------mainData------------------')
        console.log(oData, '----------------oData--------------')
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


        // let connection = mysql.createConnection(db);


        // connection.connect(function (err) {


        //     if (err) {
        //         res.send({
        //             code: 500,
        //             msg: 'db connect error'
        //         })
        //         return
        //     }

        // });
        // connection.query(sql, function (err, result) {
        //     connection.end();

        //     if (err) {
        //         res.send({
        //             code: 500,
        //             msg: 'db error'
        //         })
        //         return

        //     }
        //     res.send({ code: 200, data: result })

        // });

        // pool.getConnection((err, conn) => {
        //     if (err) {
        //         // console.log('和mysql数据库建立连接失败' + sql)
        //         res.send({
        //             code: 500,
        //             msg: 'db connect error'
        //         })
        //         return

        //     } else {
        //         // console.log('和mysql数据库连接成功');
        //         conn.query(sql, (err2, result) => {
        //             if (err2) {
        //                 res.send({
        //                     code: 500,
        //                     msg: 'db error'
        //                 })
        //                 return

        //             } else {
        //                 // console.log(result[0]["count(0)"]);
        //                 conn.release();
        //                 res.send({ code: 200, data: result })

        //             }



        //         })
        //     }
        // });

    },

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

        let connectionPromise = ({ ip, sql }) => {

            return new Promise(function (resolve, reject) {

                pool.getConnection((err, conn) => {
                    if (err) {
                        console.log('和mysql数据库建立连接失败' + sql)
                        console.log(err)
                        return reject(sql)

                    } else {
                        // console.log('和mysql数据库连接成功');
                        conn.query(sql, (err2, result) => {
                            if (err2) {
                                console.log('查询数据库失败' + sql);
                                return reject(sql)

                            } else {


                                conn.release();
                                return resolve({
                                    ip, count: result[0]["count(0)"]
                                })
                            }
                        })
                    }
                });



            })
        }
        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < gitc[group].length; j++) {
                let ip = gitc[group][j]
                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL='${ip}' and (create_time between '${btime}' and '${etime}')`
                totalList.push({ ip, sql })

            }
        }

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            // console.log(result,)               //['成功了', 'success']
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
                        ip: gitcView[group][ip], count: data[ip]
                    })
                }

            }
            // pool.end()

            res.send({ code: 200, data: arr, group })
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

        let connectionPromise = ({ g, sql }) => {
            return new Promise(function (resolve, reject) {

                pool.getConnection((err, conn) => {
                    if (err) {
                        // console.log('和mysql数据库建立连接失败' + sql)
                        console.log(err)
                        return reject(sql)

                    } else {
                        // console.log('和mysql数据库连接成功');
                        conn.query(sql, (err2, result) => {
                            if (err2) {
                                console.log('查询数据库失败' + sql);
                                return reject(sql)

                            } else {
                                // console.log(result[0]["count(0)"]);
                                conn.release();
                                return resolve({
                                    g, count: result[0]["count(0)"]
                                })
                            }
                        })
                    }
                });

            })
        }




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
            // pool.end()
            res.send({ code: 200, data: arr })
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })

        })

    },

    countPackage: async (req, res) => {

        let { btime, etime } = req.query;
        if (!btime || !etime) {
            res.send({
                code: 500,
                msg: 'query is invaid'
            })
            return;
        }

        res.send({ code: 200 ,data:[]})
        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            let t = `select COUNT(0)from ${list[i]}  where OP_CODE='110' and MODIFY_USER_NAME LIKE '%#98%' AND (CREATE_TIME between '${btime}' and '${etime}')`;
            let t = `select COUNT(0)from ${list[i]}  where OP_CODE='110' and MODIFY_USER_NAME LIKE '%#%' AND (CREATE_TIME between '${btime}' and '${etime}')`;
            totalList.push({ t })
        }


    },
};