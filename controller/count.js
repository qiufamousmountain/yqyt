/**
 * Created by zhangyuntao on 2018/10/9.
 */

const { pool } = require('../models/sql')
const groupConfig = require('../config/groups.json')
const Moment = require('moment')
const mysql = require('mysql');
const list = ['t_exp_waybill_check_0', 't_exp_waybill_check_1', 't_exp_waybill_check_2', 't_exp_waybill_check_3', 't_exp_waybill_check_4', 't_exp_waybill_check_5', 't_exp_waybill_check_6', 't_exp_waybill_check_7', 't_exp_waybill_check_8', 't_exp_waybill_check_9']

const connectionPromise = (sql) => {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                // console.log('和mysql数据库建立连接失败' + sql)
                console.log(err)
                return resolve([])
            }
            // console.log('和mysql数据库连接成功');
            conn.query(sql, (err2, result) => {
                conn.release();
                if (err2) {
                    console.log('查询数据库失败' + sql);
                    console.log(err2)
                    return resolve([])
                }


                return resolve(result)
            })

        });

    })
}


module.exports = {
    //操作量
    stuffturnover: async (req, res) => {
        let { btime, etime, group } = req.query;
        if (!btime || !etime || Moment(new Date(etime)).isBefore(new Date(btime))) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        let sql = ''
        for (let i = 0; i < 10; i++) {
            sql = sql + 'select CREATE_USER_CODE as ucode,CREATE_USER_NAME as uname,opCode as code,COUNT(*) as count from t_exp_waybill_check_' + i + '\n' +
                'where createDate> "' + btime + '" and createDate< "' + etime + '" \n' +
                ' and opCode in ("171","131","110","111" )' + '\n' +
                'GROUP BY MODIFY_USER_CODE,CREATE_USER_NAME,opCode' + '\n'
            if (i < 9) {
                sql = sql +
                    'UNION ALL' + '\n'
            }
        }
        // console.log(sql)
        let iData = connectionPromise(sql);
        res.send({ code: 200, iData })

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
        let data = []
        for (let i in settingData) {
            if (settingData.hasOwnProperty(i)) {
                data.push({
                    check: false,
                    name: i,
                })
            }
        }

        res.send({ code: 200, data })
        settingData = null
    },

    countgroupOne: async (req, res) => {

        let { btime, etime, group, type } = req.query;
        let groups = groupConfig[type] || {};
        // console.log(groups, type, groupConfig)

        if (!btime || !etime || !groups[group]) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }

        let ips = []

        let currentGroup = groups[group]
        for (let i in currentGroup) {
            if (currentGroup.hasOwnProperty(i)) {
                ips.push(i)
            }
        }

        if (ips.length < 1) {
            res.send({
                code: 500,
                msg: 'no such group'
            })
            return;
        }

        ips = ips.join("','")

        let sql = ''
        for (let i = 0; i < 10; i++) {
            sql = sql + `select compIP,count(compIP) as num from t_exp_waybill_check_${i}
            where compIP in ('${ips}') and (createDate>'${btime}' and createDate<'${etime}') and opCode ='${type == 'gotc' ? 171 : 131}'
            group by compIP` + '\n'
            if (i < 9) {
                sql = sql +
                    'UNION ALL' + '\n'
            }
        }
        // console.log(sql)
        let iData = await connectionPromise(sql);

        let ipbox = {}
        let data = []
        for (let j = 0; j < iData.length; j++) {

            let extT = iData[j];

            for (let b in extT) {
                if (extT.hasOwnProperty(b)) {
                    if (!extT.compIP) continue;
                    let t = extT.compIP;
                    if (!ipbox[t]) {
                        ipbox[t] = extT.num || 0
                    }
                    ipbox[t] = parseInt(ipbox[t]) + parseInt(extT.num)
                }
            }


        }

        for (let i in ipbox) {

            if (ipbox.hasOwnProperty(i)) {
                let gg = {
                    ip: currentGroup[i],
                    count: ipbox[i]
                }
                data.push(gg)

            }

        }

        data = data.sort((a, b) => {
            let lt = a.ip.match(/\d+/g)
            let bg = b.ip.match(/\d+/g)

            return lt[0] - bg[0]
        })

        res.send({ code: 200, data })

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
        let ips = []
        for (let j = 0; j < group.length; j++) {
            let g = group[j];
            if (!groups.hasOwnProperty(group[j])) continue
            let ipsList = groups[g];
            for (let i in ipsList) {
                if (ipsList.hasOwnProperty(i)) {
                    ips.push(i)
                }
            }
        }
        if (ips.length < 1) {
            res.send({
                code: 500,
                msg: 'no such group'
            })
            return;
        }
        ips = ips.join("','")

        let sql = ''
        for (let i = 0; i < 10; i++) {
            sql = sql + `select compIP,count(compIP) as num from t_exp_waybill_check_${i}
            where compIP in ('${ips}') and (createDate>'${btime}' and createDate<'${etime}') and opCode ='${type == 'gotc' ? 171 : 131}'
            group by compIP` + '\n'
            if (i < 9) {
                sql = sql +
                    'UNION ALL' + '\n'
            }
        }
        // console.log(sql)
        let iData = await connectionPromise(sql);


        let ipbox = {}

        for (let j = 0; j < iData.length; j++) {

            let extT = iData[j];

            for (let b in extT) {
                if (extT.hasOwnProperty(b)) {
                    if (!extT.compIP) continue;
                    let t = extT.compIP;
                    if (!ipbox[t]) {
                        ipbox[t] = extT.num || 0
                    }
                    ipbox[t] = parseInt(ipbox[t]) + parseInt(extT.num)
                }
            }


        }

        let data = []

        // let timeList = {}
        // for (let i = 0; i < iData.length; i++) {
        //     let tlist = iData[i] || [];

        //     for (let j = 0; j < tlist.length; j++) {
        //         let ext = tlist[j];
        //         console.log('ttttttttt',ext)

        //         if (!ext || !ext.compIP) continue;
        //         let t = ext.compIP;
        //         if (!timeList[t]) {
        //             timeList[t] = ext.num
        //         }
        //         timeList[t] = parseInt(timeList[t]) + parseInt(ext.num)
        //     }
        // }

        // console.log(timeList, 'tttttttlist')
        for (let j = 0; j < group.length; j++) {

            let g = group[j];
            let gg = {
                group: g,
                count: 0
            }
            if (!groups.hasOwnProperty(group[j])) {
                data.push(gg)
                continue
            }
            let ips = groups[g];
            let gips = []
            for (let i in ips) {
                if (ips.hasOwnProperty(i)) {
                    gips.push(i)
                }
            }

            for (let i = 0; i < gips.length; i++) {
                if (ipbox.hasOwnProperty(gips[i])) {

                    gg['count'] = parseInt(gg['count']) + parseInt(ipbox[gips[i]])
                }
            }

            data.push(gg)


        }
        // let arr = []
        // for (let b in ipbox) {
        //     if (ipbox.hasOwnProperty(b)) {
        //         arr.push({
        //             group: b,
        //             count: ipbox[b]
        //         })
        //     }
        // }



        // let ipbox2 = {}


        // console.log('sql+', sql, arr)
        // res.send({ code: 200, data: arr })
        res.send({ code: 200, data })
        // promistList = null;
        // totalList = null;

    },

    //重复操作 遗弃
    repeated: async (req, res) => {

        let { btime, etime } = req.query;

        if (!btime || !etime) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        let sql = `select num,COUNT(0) as cc from(select COUNT(0) as num from t_yto_scan where TIMEDCT>'${btime}' AND TIMEDCT<'${etime}' GROUP BY BARCODE HAVING num>2) a GROUP BY num`

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
                        console.log(err);

                        return resolve({ code: 500, msg: 'select db error' })
                    }
                    return resolve(result)

                });
            })
        }

        let mainData = await connectionPromise(sql_jg, sql)

        if (mainData.code == 500) {
            res.send(mainData)
            return
        }

        res.send({ code: 200, data: mainData })


    },
    repeateddetail: async (req, res) => {

        let { btime, etime, repeated } = req.query;

        if (!btime || !etime || !repeated) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        let sql = `select BARCODE,COUNT(0) as num from t_yto_scan where TIMEDCT>'${btime}' AND TIMEDCT<'${etime}' GROUP BY BARCODE HAVING num=${repeated} `

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
                        console.log(err);

                        return resolve({ code: 500, msg: 'select db error' })
                    }
                    return resolve(result)

                });
            })
        }

        let mainData = await connectionPromise(sql_jg, sql)

        if (mainData.code == 500) {
            res.send(mainData)
            return
        }

        console.log(mainData)
        let arr = []
        for (let b in mainData) {
            if (mainData.hasOwnProperty(b)) {
                arr.push(mainData[b].BARCODE)
            }
        }
        arr = arr.join("','")
        let tosql = `select BARCODE,TIMEDCT,IPADDR from t_yto_scan where TIMEDCT>'${btime}' AND TIMEDCT<'${etime}' and BARCODE in ('${arr}')`
        console.log(tosql, '-------------------------------------')

        let detailData = await connectionPromise(sql_jg, tosql)
        if (detailData.code == 500) {
            res.send(detailData)
            return
        }
        console.log(detailData, '-------------------------------------')

        res.send({ code: 200, data: detailData })


    },

};
