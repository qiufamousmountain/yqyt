/**
 * Created by zhangyuntao on 2018/10/9.
 */

const { pool } = require('../models/sql')
const client = require('../models/redis')
const Moment = require('moment')
module.exports = {
    every10Min: async (req, res) => {
        let time = new Date()
        let times = [];
        for (let i = 1; i < 11; i++) {
            times.unshift(Moment(time).subtract(Moment(time).minute() % 10 + 10 * i, "minutes").format('yyyy-MM-DD HH:mm'))
        }

        times = times.map(m => m.split(' ')[1])

        client.hmget('todaymin10', times, (err, reply) => {
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
                        t: times[j],
                        d: parseInt(t[0]),
                        u: parseInt(t[1]),

                    })


                }
            }

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
            res.send({ code: 200, data: { d1: reply } })

        });

    }
};

