/**
 * Created by zhangyuntao on 2018/10/9.
 */

const { pool } = require('../models/sql')
const { sql_m, sql_mc, sql_moni, sql_jg, sql_s } = require('../config/config.json');
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
                return resolve(null)
            }
            // console.log('和mysql数据库连接成功');
            conn.query(sql, (err2, result) => {
                conn.release();
                if (err2) {
                    console.log('查询数据库失败' + sql);
                    console.log(err2)
                    return resolve(null)
                }
                return resolve(result)
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

        let mainData = await connectionPromise(sql_s, sql);
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

    stuffturnover: async (req, res) => {
        let { btime, etime, group } = req.query;
        if (!btime || !etime || Moment(new Date(etime)).isBefore(new Date(btime))) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }
        let connectionPromise = (db, sql) => {
            let connection = mysql.createConnection(db);
            return new Promise(function (resolve, reject) {
                connection.connect(function (err) {
                    if (err) {
                        console.log(err)
                        return resolve({ code: 500, msg: 'connect db error' })
                    }
                    console.log('连接到数据库' + db.host)
                });
                connection.query(sql, function (err, result) {
                    connection.end();
                    if (err) {
                        console.log('查询数据库失败' + sql);
                        console.log(err, '-------------------------')
                        return resolve({ code: 500, msg: 'select db error' })
                    }
                    return resolve(result)

                });
            })
        }
        let sql = ''
        for (let i = 0; i < 10; i++) {
            sql = sql + 'select CREATE_USER_CODE as ucode,CREATE_USER_NAME as uname,OP_CODE as code,COUNT(*) as count from t_exp_waybill_check_' + i + '\n' +
                'where CREATE_TIME> "' + btime + '" and CREATE_TIME< "' + etime + '" \n' +
                ' and OP_CODE in ("171","131","110","111" )' + '\n' +
                'GROUP BY MODIFY_USER_CODE,CREATE_USER_NAME,OP_CODE' + '\n'
            if (i < 9) {
                sql = sql +
                    'UNION ALL' + '\n'

            }

        }
        // console.log(sql)
        let iData = connectionPromise(sql_m, sql);
        // let oData = connectionPromise(sql_mc, sql);
        Promise.all([iData]).then((result) => {
            res.send({ code: 200, data: result[0] })
            iData = null;
            oData = null;
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })
            iData = null;
            oData = null;
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
        // console.log(groups, type, groupConfig)

        if (!btime || !etime || !groups[group]) {
            res.send({
                code: 500,
                msg: 'params is invaid'
            })
            return;
        }

        let totalList = [];
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

        totalList = list.map(m => {
            return `select MODIFY_TERMINAL,count(MODIFY_TERMINAL) as num
            from ${m}
            where MODIFY_TERMINAL in ('${ips}') and (create_time>'${btime}' and create_time<'${etime}') and OP_CODE ='${type == 'gotc' ? 171 : 131}'
            group by MODIFY_TERMINAL`
        })

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {

            let data = []
            let timeList = {}
            for (let i = 0; i < result.length; i++) {
                let tlist = result[i] || [];
                for (let j = 0; j < tlist.length; j++) {
                    let ext = tlist[j];
                    if (!ext || !ext.MODIFY_TERMINAL) continue;
                    let t = ext.MODIFY_TERMINAL;
                    if (!timeList[t]) {
                        timeList[t] = ext.num
                    }
                    timeList[t] = parseInt(timeList[t]) + parseInt(ext.num)
                }
            }


            for (let i in timeList) {

                if (timeList.hasOwnProperty(i)) {
                    let gg = {
                        ip: currentGroup[i],
                        count: timeList[i]
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

        let totalList = [];
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

        totalList = list.map(m => {
            return `select MODIFY_TERMINAL,count(MODIFY_TERMINAL) as num
            from ${m}
            where MODIFY_TERMINAL in ('${ips}') and (create_time>'${btime}' and create_time<'${etime}') and OP_CODE ='${type == 'gotc' ? 171 : 131}'
            group by MODIFY_TERMINAL`
        })

        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            // console.log(result,)               //['成功了', 'success']

            // pool.end()

            let data = []

            let timeList = {}
            for (let i = 0; i < result.length; i++) {
                let tlist = result[i] || [];
                for (let j = 0; j < tlist.length; j++) {
                    let ext = tlist[j];
                    if (!ext || !ext.MODIFY_TERMINAL) continue;
                    let t = ext.MODIFY_TERMINAL;
                    if (!timeList[t]) {
                        timeList[t] = ext.num
                    }
                    timeList[t] = parseInt(timeList[t]) + parseInt(ext.num)
                }
            }




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
                    if (timeList.hasOwnProperty(gips[i])) {

                        gg['count'] = parseInt(gg['count']) + parseInt(timeList[gips[i]])
                    }
                }

                data.push(gg)


            }

            res.send({ code: 200, data })
            promistList = null;
            totalList = null;
        }).catch((error) => {
            console.log(error)
            res.send({ code: 500, msg: error })
            promistList = null;
            totalList = null;
        })

    },

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

