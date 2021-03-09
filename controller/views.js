/**
 * Created by zhangyuntao on 2018/10/9.
 */

// const { pool } = require('../models/sql')
const client = require('../models/redis')
const { jg, chg } = require('../config/flow-net.json')
const Moment = require('moment')
const { pool } = require('../models/sql')
const list = ['t_exp_waybill_check_0', 't_exp_waybill_check_1', 't_exp_waybill_check_2', 't_exp_waybill_check_3', 't_exp_waybill_check_4', 't_exp_waybill_check_5', 't_exp_waybill_check_6', 't_exp_waybill_check_7', 't_exp_waybill_check_8', 't_exp_waybill_check_9']

const { gotc } = require('../config/groups.json')

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




module.exports = {
    every10Min: async (req, res) => {
        // let time = new Date()
        // let times = [];
        // for (let i = 1; i < 11; i++) {
        //     times.unshift(Moment(time).subtract(Moment(time).minute() % 10 + 10 * i, "minutes").format('yyyy-MM-DD HH:mm'))
        // }

        // times = times.map(m => m.split(' ')[1])

        client.hgetall('todaymin10', (err, reply) => {
            if (err || !reply) {
                console.log(err)
                res.send({ code: 500, msg: 'redis fail' })
                return
            }
            let data = []
            for (let j in reply) {
                if (reply.hasOwnProperty(j) && reply[j]) {
                    let t = reply[j].split('-')
                    data.push({
                        t: j,
                        d: parseInt(t[0]),
                        u: parseInt(t[1]),

                    })


                }
            }

            console.log(data)
            res.send({ code: 200, data })

        });


    },

    totalCount: async (req, res) => {
        let { type } = req.query;
        if (type == 'add') {
            let time = new Date()
            let late = Moment(time).subtract(Moment(time).minute() % 10 + 10, "minutes").format('yyyy-MM-DD HH:mm')
            late = late.split(' ')[1]
            client.hmget('todaymin10', late, (err, reply) => {
                if (err || !reply) {
                    console.log(err)
                    res.send({ code: 500, msg: 'redis fail' })
                    return
                }
                let j = reply[0].split('-')
                // let data = {
                //     time: late,
                //     d: j[0] || 0,
                //     y: j[1] || 0,
                // }
                let data = parseInt(j[0]) + parseInt(j[1])
                res.send({ code: 200, data })

            });
        } else {
            client.hgetall('todaymin10', (err, reply) => {
                if (err || !reply) {
                    console.log(err)
                    res.send({ code: 500, msg: 'redis fail' })
                    return
                }
                let data = 0
                for (let t in reply) {
                    if (reply.hasOwnProperty(t) && reply[t]) {
                        let ej = reply[t].split('-')
                        data = data + parseInt(ej[0]) + parseInt(ej[1])

                    }
                }

                res.send({ code: 200, data })

            });
        }
    },
    outVol: async (req, res) => {
        // let { type } = req.query;
        client.hgetall('todaymin30', (err, reply) => {
            if (err || !reply) {
                console.log(err)
                res.send({ code: 500, msg: 'redis fail' })
                return
            }

            console.log(reply)
            let d1 = {}
            let d2 = {}
            for (let dd1 in chg) {
                if (chg.hasOwnProperty(dd1)) {
                    d1[dd1] = reply[dd1] || 0
                }
            }
            for (let dd2 in jg) {
                if (jg.hasOwnProperty(dd2)) {
                    d2[dd2] = reply[dd2] || 0
                }
            }
            res.send({ code: 200, data: { d1, d2 } })

        });

    },
    getDWS: async (req, res) => {

        let jg = gotc['进港卸货'];
        let chg = gotc['出港卸货'];
        // let ips=[]
        let jgips = []
        let chgips = []

        for (let i in jg) {
            if (jg.hasOwnProperty(i)) {
                jgips.push(i)
            }
        }

        for (let i in chg) {
            if (chg.hasOwnProperty(i)) {
                chgips.push(i)
            }
        }
        let ips = jgips.concat(chgips)
        // let ips = [
        //     "172.19.11.53",
        //     "172.19.11.52",
        //     "172.19.11.51",
        //     "172.19.11.50",
        //     "172.19.11.49",
        //     "172.19.11.48",
        //     "172.19.11.47",
        //     "172.19.11.46",
        //     "172.19.11.45",
        //     "172.19.11.44",
        //     "172.19.11.43",
        //     "172.19.11.42",
        //     "172.19.11.41",
        //     "172.19.11.40",
        //     "172.19.11.39",
        //     "172.19.11.38",
        //     "172.19.11.37",
        //     "172.19.11.36",
        //     "172.19.11.35",
        //     "172.19.11.34",
        //     "172.19.11.33",
        //     "172.19.11.32",
        //     "172.19.11.31",
        //     "172.19.11.30",
        //     "172.19.11.29",
        //     "172.19.11.28",
        //     "172.19.11.27",
        //     "172.19.11.26",
        //     "172.19.11.25",
        //     "172.19.11.24",
        //     "172.19.11.23",
        //     "172.19.11.22",
        //     "172.19.11.21",
        //     "172.19.11.20",
        //     "172.19.11.19",
        //     "172.19.11.18",
        //     "172.19.11.17",
        //     "172.19.11.16",
        //     "172.19.11.15",
        //     "172.19.11.14",
        //     "172.19.11.13",
        //     "172.19.11.12",
        //     "172.19.11.11"]

        let totalList = []
        let time = new Date()
        let c8 = Moment(time).set({ 'hour': 08, 'minute': 00, 'second': 00 }).format('yyyy-MM-DD HH:mm:ss');
        let c20 = Moment(time).set({ 'hour': 20, 'minute': 00, 'second': 00 }).format('yyyy-MM-DD HH:mm:ss');

        let begin = '';
        if (Moment(time).isBefore(c8)) {
            begin = Moment(c20).subtract(1, "days").format('yyyy-MM-DD HH:mm')
        } else if (Moment(c8).isBefore(time) && Moment(time).isBefore(c20)) {
            begin = Moment(c8).format('yyyy-MM-DD HH:mm')
        } else {
            begin = Moment(c20).format('yyyy-MM-DD HH:mm')
        }

        let late = Moment(time).subtract(Moment(time).minute(), "minute").format('yyyy-MM-DD HH:mm')
        let before = Moment(late).subtract(1, "hour").format('yyyy-MM-DD HH:mm')
        let count = Moment(late).diff(Moment(begin), 'hour')

        ips = ips.join("','")

        if (count < 0) return
        totalList = list.map(m => {
            return `select
          MODIFY_TERMINAL,
          sum(create_time>'${before}' and create_time<'${late}') as bf1 ,
          count(MODIFY_TERMINAL) as total
          from ${m}
          where MODIFY_TERMINAL in ('${ips}') and  (create_time>'${begin}' and create_time<'${late}') and OP_CODE='171'
          group by MODIFY_TERMINAL `
        })


        let promistList = totalList.map(m => connectionPromise(m))
        Promise.all(promistList).then((result) => {
            let timeList = {}

            for (let i = 0; i < result.length; i++) {
                let tlist = result[i] || [];
                for (let j = 0; j < tlist.length; j++) {
                    let ext = tlist[j];
                    // if (!ext || !ext.MODIFY_TERMINAL) continue;
                    let t = ext.MODIFY_TERMINAL;
                    if (!timeList[t]) {
                        timeList[t] = {
                            ip: ext.MODIFY_TERMINAL,
                            bf1: ext.bf1,
                            total: ext.total
                        }
                    }
                    timeList[t]['bf1'] = parseInt(timeList[t]['bf1']) + parseInt(ext.bf1)
                    timeList[t]['total'] = parseInt(timeList[t]['total']) + parseInt(ext.total)
                }
            }

            // console.log(timeList)

            let jgList = jgips.map(m => {

                let obj = {
                    ip: m,
                    name: jg[m],
                    bf1: timeList[m].bf1,
                    total: timeList[m].total,

                }


                return obj
            })

            let chgList = chgips.map(m => {

                let obj = {
                    ip: m,
                    name: chg[m],
                    bf1: timeList[m] ? timeList[m].bf1 : 0,
                    total: timeList[m] ? timeList[m].total : 0,

                }
                return obj
            })

            res.send({ code: 200, data: { jgList, chgList } })


        }).catch((error) => {
            console.log(error)

        })
    }
};

