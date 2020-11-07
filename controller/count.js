/**
 * Created by zhengliuyang on 2018/10/9.
 */

const { pool } = require('../models/sql')
const { groups, groupsView } = require('../config/config.json')
// const config = require('../config/config.json');

// const mysql = require('mysql');

const list = ['t_exp_waybill_check_0', 't_exp_waybill_check_1', 't_exp_waybill_check_2', 't_exp_waybill_check_3', 't_exp_waybill_check_4', 't_exp_waybill_check_5', 't_exp_waybill_check_6', 't_exp_waybill_check_7', 't_exp_waybill_check_8', 't_exp_waybill_check_9']
module.exports = {


    countGroupOne: async (req, res) => {

        let { btime, etime, group } = req.query;
        if (!btime || !etime || !groups[group] || groups[group].length < 1) {
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
            for (let j = 0; j < groups[group].length; j++) {
                let ip = groups[group][j]
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
                        ip: groupsView[group][ip], count: data[ip]
                    })
                }

            }
            // pool.end()

            res.send({ code: 200, data: arr, group })
        }).catch((error) => {
            console.log(error)
        })

    },

    countGroups: async (req, res) => {

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




        // let connectionPromise = ({ g, sql }) => {
        //     let connection = mysql.createConnection(config.sql);
        //     return new Promise(function (resolve, reject) {
        //         connection.connect(function (err) {
        //             if (err) {
        //                 return reject(sql)
        //             }
        //         });
        //         connection.query(sql, function (err, result) {
        //             connection.end();

        //             if (err) {
        //                 return reject(sql)

        //             }
        //             if (!(result && result[0])) {
        //                 return reject(sql)

        //             }
        //             return resolve({
        //                 g, count: result[0]["count(0)"]
        //             })

        //         });


        //     })
        // }



        let totalList = [];
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < group.length; j++) {

                let ips = groups[group[j]].join("','")
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
        let sql = `select WAYBILL_NO, OP_CODE,CREATE_TIME, CONTAINER_NO,MODIFY_TERMINAL from t_exp_waybill_check_${page} where WAYBILL_NO = '${ids}'`

        pool.getConnection((err, conn) => {
            if (err) {
                // console.log('和mysql数据库建立连接失败' + sql)
                res.send({
                    code: 500,
                    msg: 'db connect error'
                })
                return

            } else {
                // console.log('和mysql数据库连接成功');
                conn.query(sql, (err2, result) => {
                    if (err2) {
                        res.send({
                            code: 500,
                            msg: 'db error'
                        })
                        return

                    } else {
                        // console.log(result[0]["count(0)"]);
                        conn.release();
                        res.send({ code: 200, data: result })

                    }



                })
            }
        });

    },
    testttt: async (req, res) => {

        let sql = `select * from t_exp_waybill_check_0 where MODIFY_TERMINAL = '172.19.11.43' and create_time >'2020-11-5 00:00' and create_time <'2020-11-5 02:00' `
        let data = {
            "ID": "ab3d855c-e7c0-4102-a300-76155f5bda44",
            "WAYBILL_NO": "NW1173997710",
            "EXP_TYPE": "20",
            "EFFECTIVE_TYPE_CODE": "T004",
            "EXPRESS_CONTENT_CODE": "PKG",
            "PKG_QTY": 1,
            "WEIGHT": 13.18,
            "OP_CODE": 171,
            "STATUS": "1",
            "CREATE_TIME": "2020-11-04T16:07:59.000Z",
            "SOURCE_ORG_CODE": "100901",
            "PREVIOUS_ORG_CODE": "", "NEXT_ORG_CODE": "100901",
            "DES_ORG_CODE": "100901", "CONTAINER_NO": "AQ757902013588", "IO_TYPE": "01", "EXTEND1": null,
            "EXTEND2": null, "EXTEND3": null, "EXTEND4": null, "EXTEND5": "00068901", "EXTEND6": "0.0;0.0;0.0",
            "EXTEND7": "13.18", "EXTEND8": "0.0", "EXTEND9": "0.0",
            "EXTEND10": "172.19.4.248/38-68-DD-32-72-A0/CV-PC/com.yto.exp.busigateway.commons.config.SystemConfig$$EnhancerBySpringCGLIB$$4561ff2c@3d72df33",
            "EXTEND11": null, "EXTEND12": 1, "NUMBER1": null,
            "NUMBER2": null, "EXTEND13": "null", "EXTEND14": null, "EXTEND15": null,
            "EXTEND16": null, "EXTEND17": null, "EXTEND18": null, "EXTEND19": null, "EXTEND20": null, "DESC1": null, "DESC2": null,
            "MODIFY_TIME": "2020-11-04T16:08:00.000Z", "AUX_OP_CODE": "NEW", "AUX_ROUTE_CODE": null, "CREATE_ORG_CODE": "100901",
            "CREATE_TERMINAL": "172.19.11.43/2.4.16/7", "CREATE_USER_CODE": "00068901",
            "CREATE_USER_NAME": "程泽强", "DEVICE_TYPE": "CV-PC", "FEE_AMT": null, "FEE_FLAG": "0",
            "FREQUENCY_NO": null, "MODIFY_ORG_CODE": "100901", "MODIFY_TERMINAL": "172.19.11.43",
            "MODIFY_USER_CODE": "00068901", "MODIFY_USER_NAME": "程泽强", "ORG_CODE": "100901", "REF_ID": null, "REMARK": "",
            "ROUTE_CODE": null, "BILL_SOURCE_ORG_CODE": null, "TRANS_FEE": null, "FEE_WEIGHT": null, "IN_OUT_FLAG": null,
            "TRANSPORT_TYPE_CODE": null, "MEMO": "成功", "DIFF_STATUS": null, "DEVICE_NO": null, "PACKAGE_TABLE_NO": null, "LATTICE_NO": null
        }

        let connection = mysql.createConnection(config.sql);
        connection.connect(function (err) {
            if (err) {
                res.send({
                    code: 500,
                    msg: 'db connect error',
                    a: err
                })
                return
            }
        });
        connection.query(sql, function (err, result) {
            connection.end();

            if (err) {
                res.send({
                    code: 500,
                    msg: 'db error'
                })
                return
            }
            if (!(result && result[0])) {
                res.send({ code: 200, data: [] })
                return
            }
            res.send({ code: 200, data: result[0] })

        });

    },

};