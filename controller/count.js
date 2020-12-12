/**
 * Created by zhangyuntao on 2018/10/9.
 */

const { pool } = require('../models/sql')
const { sql_m, sql_moni } = require('../config/config.json');
const groupConfig = require('../config/groups.json')
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
module.exports = {
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
            arr.push({ "group": "未使用", "count": totals[0].count - useds[0].count })
            // pool.end()
            res.send({ code: 200, data: arr })
            promistList = null;
            totalList = null;
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })
            promistList = null;
            totalList = null;
        })

    },
    getSettings: async (req, res) => {

        let { settings } = req.params;
        if (!settings) {
            res.send({
                code: 500,
                msg: 'query is invaid'
            })
            return;
        }


        let settingData = groupConfig[settings]
        let data=[]
        for (let i in settingData) {
            if (settingData.hasOwnProperty(i)) {
                data.push({
                    check: false,
                    name: i,
                })
            }
        }

        res.send({ code: 200, data })
        settingData = null;

        // try {
        //     let settingData = fs.readFileSync(path.join(__dirname, '../config') + `/${settings}.json`, 'utf-8')

        //     settingData = JSON.parse(settingData)

        //     let data = []

        //     for (let i in settingData[settings]) {
        //         if (settingData[settings].hasOwnProperty(i)) {
        //             data.push({
        //                 check: false,
        //                 name: i,
        //             })
        //         }
        //     }

        //     res.send({ code: 200, data })
        //     settingData = null;

        // } catch (e) {
        //     console.log(e)
        //     res.send({ code: 500, msg: 'has none' })

        // }





    },
    countgroupOne: async (req, res) => {

        let { btime, etime, group, type } = req.query;
        let groups = groupConfig[type] || {};
        if (!btime || !etime || !groups[group]) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        btime = btime.split('/').join('-')

        etime = etime.split('/').join('-')

        let totalList = [];



        if (!groups.hasOwnProperty(group)) {
            res.send({ code: 200, msg: 'this group is invaid' })
            return
        }


        let ips = []
        let currentGroup = groups[group]
        for (let i in currentGroup) {
            if (currentGroup.hasOwnProperty(i)) {
                ips.push(i)
            }
        }

        for (let j = 0; j < ips.length; j++) {
            let ip = ips[j]
            for (let i = 0; i < list.length; i++) {

                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL='${ip}' and (create_time between '${btime}' and '${etime}')`
                totalList.push({ ip, sql })

            }
        }

        let promistList = totalList.map(m => connectionIPPromise(m))
        Promise.all(promistList).then((result) => {
            // console.log(result,)               //['成功了', 'success']
            // pool.end()
            let data = {}


            for (let i = 0; i < result.length; i++) {
                let cur = result[i]
                if (data.hasOwnProperty(cur.ip)) {
                    data[cur.ip] = data[cur.ip] + cur.count

                } else {
                    data[cur.ip] = cur.count

                }
            }
            let arr = []
            for (let ip in data) {
                if (data.hasOwnProperty(ip)) {
                    arr.push({
                        ip: currentGroup[ip], count: data[ip]
                    })
                }



            }
            res.send({ code: 200, data: arr, group })
            promistList = null;
            totalList = null;
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })
            promistList = null;
            totalList = null;
        })

    },

    countgroup: async (req, res) => {

        let { btime, etime, group, type } = req.body;
        let groups = groupConfig[type] || {};

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
        for (let j = 0; j < group.length; j++) {

            let g = group[j];
            if (!groups.hasOwnProperty(group[j])) continue
            let ipsList = groups[g];
            let ips = []
            for (let i in ipsList) {
                if (ipsList.hasOwnProperty(i)) {
                    ips.push(i)
                }
            }
            ips = ips.join("','")
            for (let i = 0; i < list.length; i++) {

                let sql = `select count(0) from ${list[i]} where MODIFY_TERMINAL in ('${ips}') and (create_time between '${btime}' and '${etime}')`
                totalList.push({ g, sql })
            }

        }

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            console.log(result,)               //['成功了', 'success']

            // pool.end()

            let data = {}

            for (let i = 0; i < result.length; i++) {

                let cur = result[i]
                if (data.hasOwnProperty(cur.g)) {
                    data[cur.g] = data[cur.g] + cur.count

                } else {
                    data[cur.g] = cur.count

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
            promistList = null;
            totalList = null;
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })
            promistList = null;
            totalList = null;
        })

    },

};

