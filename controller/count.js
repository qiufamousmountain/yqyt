/**
 * Created by zhengliuyang on 2018/10/9.
 */

// const { connection } = require('../models/sql')
const { groups,groupsView } = require('../config/config.json')
const config = require('../config/config.json');

const mysql = require('mysql');
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
            let connection = mysql.createConnection(config.sql);
            return new Promise(function (resolve, reject) {
                connection.connect(function (err) {
                    if (err) {
                        return reject(sql)
                    }
                });
                connection.query(sql, function (err, result) {
                    connection.end();

                    if (err) {
                        return reject(sql)

                    }
                    if (!(result && result[0])) {
                        return reject(sql)

                    }
                    return resolve({
                        ip, count: result[0]["count(0)"]
                    })

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
            console.log(result,)               //['成功了', 'success']
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
                        ip:groupsView[group][ip], count: data[ip]
                    })
                }

            }
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
        let connectionPromise = ({ g, sql }) => {
            let connection = mysql.createConnection(config.sql);
            return new Promise(function (resolve, reject) {
                connection.connect(function (err) {
                    if (err) {
                        return reject(sql)
                    }
                });
                connection.query(sql, function (err, result) {
                    connection.end();

                    if (err) {
                        return reject(sql)

                    }
                    if (!(result && result[0])) {
                        return reject(sql)

                    }
                    return resolve({
                        g, count: result[0]["count(0)"]
                    })

                });


            })
        }
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
            console.log(result,)               //['成功了', 'success']
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
            res.send({ code: 200, data: arr })
        }).catch((error) => {
            console.log(error)
        })

    },



};