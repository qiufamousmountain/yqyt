const schedule = require('node-schedule');
const client = require('./redis');
const { pool } = require('../models/sql')
const Moment = require('moment')
const { jg, chg } = require('../config/flow-net.json')
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
// const timeList = {
//   '00:00': '0-0',
//   '00:10': '0-0',
//   '00:20': '0-0',
//   '00:30': '0-0',
//   '00:40': '0-0',
//   '00:50': '0-0',
//   '01:00': '0-0',
//   '01:10': '0-0',
//   '01:20': '0-0',
//   '01:30': '0-0',
//   '01:40': '0-0',
//   '01:50': '0-0',
//   '02:00': '0-0',
//   '02:10': '0-0',
//   '02:20': '0-0',
//   '02:30': '0-0',
//   '02:40': '0-0',
//   '02:50': '0-0',
//   '03:00': '0-0',
//   '03:10': '0-0',
//   '03:20': '0-0',
//   '03:30': '0-0',
//   '03:40': '0-0',
//   '03:50': '0-0',
//   '04:00': '0-0',
//   '04:10': '0-0',
//   '04:20': '0-0',
//   '04:30': '0-0',
//   '04:40': '0-0',
//   '04:50': '0-0',
//   '05:00': '0-0',
//   '05:10': '0-0',
//   '05:20': '0-0',
//   '05:30': '0-0',
//   '05:40': '0-0',
//   '05:50': '0-0',
//   '06:00': '0-0',
//   '06:10': '0-0',
//   '06:20': '0-0',
//   '06:30': '0-0',
//   '06:40': '0-0',
//   '06:50': '0-0',
//   '07:00': '0-0',
//   '07:10': '0-0',
//   '07:20': '0-0',
//   '07:30': '0-0',
//   '07:40': '0-0',
//   '07:50': '0-0',
//   '08:00': '0-0',
//   '08:10': '0-0',
//   '08:20': '0-0',
//   '08:30': '0-0',
//   '08:40': '0-0',
//   '08:50': '0-0',
//   '09:00': '0-0',
//   '09:10': '0-0',
//   '09:20': '0-0',
//   '09:30': '0-0',
//   '09:40': '0-0',
//   '09:50': '0-0',
//   '10:00': '0-0',
//   '10:10': '0-0',
//   '10:20': '0-0',
//   '10:30': '0-0',
//   '10:40': '0-0',
//   '10:50': '0-0',
//   '11:00': '0-0',
//   '11:10': '0-0',
//   '11:20': '0-0',
//   '11:30': '0-0',
//   '11:40': '0-0',
//   '11:50': '0-0',
//   '12:00': '0-0',
//   '12:10': '0-0',
//   '12:20': '0-0',
//   '12:30': '0-0',
//   '12:40': '0-0',
//   '12:50': '0-0',
//   '13:00': '0-0',
//   '13:10': '0-0',
//   '13:20': '0-0',
//   '13:30': '0-0',
//   '13:40': '0-0',
//   '13:50': '0-0',
//   '14:00': '0-0',
//   '14:10': '0-0',
//   '14:20': '0-0',
//   '14:30': '0-0',
//   '14:40': '0-0',
//   '14:50': '0-0',
//   '15:00': '0-0',
//   '15:10': '0-0',
//   '15:20': '0-0',
//   '15:30': '0-0',
//   '15:40': '0-0',
//   '15:50': '0-0',
//   '16:00': '0-0',
//   '16:10': '0-0',
//   '16:20': '0-0',
//   '16:30': '0-0',
//   '16:40': '0-0',
//   '16:50': '0-0',
//   '17:00': '0-0',
//   '17:10': '0-0',
//   '17:20': '0-0',
//   '17:30': '0-0',
//   '17:40': '0-0',
//   '17:50': '0-0',
//   '18:00': '0-0',
//   '18:10': '0-0',
//   '18:20': '0-0',
//   '18:30': '0-0',
//   '18:40': '0-0',
//   '18:50': '0-0',
//   '19:00': '0-0',
//   '19:10': '0-0',
//   '19:20': '0-0',
//   '19:30': '0-0',
//   '19:40': '0-0',
//   '19:50': '0-0',
//   '20:00': '0-0',
//   '20:10': '0-0',
//   '20:20': '0-0',
//   '20:30': '0-0',
//   '20:40': '0-0',
//   '20:50': '0-0',
//   '21:00': '0-0',
//   '21:10': '0-0',
//   '21:20': '0-0',
//   '21:30': '0-0',
//   '21:40': '0-0',
//   '21:50': '0-0',
//   '22:00': '0-0',
//   '22:10': '0-0',
//   '22:20': '0-0',
//   '22:30': '0-0',
//   '22:40': '0-0',
//   '22:50': '0-0',
//   '23:00': '0-0',
//   '23:10': '0-0',
//   '23:20': '0-0',
//   '23:30': '0-0',
//   '23:40': '0-0',
//   '23:50': '0-0'

// }


//hash
// 命令 行为 返回值 使用示例(略去回调函数)
// hset 在散列里面关联起给定的键值对 1(新增)/0(更新) hset('hash-key', 'sub-key', 'value') (不支持数组、字符串)
// hget 获取指定散列键的值 hget('hash-key', 'sub-key')
// hgetall 获取散列包含的键值对 json hgetall('hash-key')
// hdel 如果给定键存在于散列里面，则移除这个键 hdel('hash-key', 'sub-key')
// hmset 为散列里面的一个或多个键设置值 OK hmset('hash-key', obj)
// hmget 从散列里面获取一个或多个键的值 array hmget('hash-key', array)
// hlen 返回散列包含的键值对数量 hlen('hash-key')
// hexists 检查给定键是否在散列中 1/0 hexists('hash-key', 'sub-key')
// hkeys 获取散列包含的所有键 array hkeys('hash-key')
// hvals 获取散列包含的所有值 array hvals('hash-key')
// hincrby 将存储的键值以指定增量增加 返回增长后的值 hincrby('hash-key', 'sub-key', increment) (注：假如当前value不为为字符串，则会无输出，程序停止在此处)
// hincrbyfloat 将存储的键值以指定浮点数增加



//读取JavaScript(JSON)对象


const getTotal = () => {

  let totalList = []
  let time = new Date()
  let begin = Moment(time).startOf('day').format('yyyy-MM-DD HH:mm')
  let late = Moment(time).subtract(Moment(time).minute() % 10, "minutes").format('yyyy-MM-DD HH:mm')
  let count = Moment(late).diff(Moment(begin), 'minute')
  if (count < 0) return
  totalList = list.map(m => {
    return `select
    DATE_FORMAT(concat( date( create_time ), ' ', HOUR ( create_time ), ':', floor( MINUTE ( create_time ) / 10 ) * 10 ),
      '%Y-%m-%d %H:%i' ) AS t ,
    sum(OP_CODE ='131') as u ,
    sum(OP_CODE ='171') as d
    from ${m}
    where (create_time>'${begin}' and create_time<'${late}') and (OP_CODE ='131' or OP_CODE='171')
    group by DATE_FORMAT( t, '%Y-%m-%d %H:%i' )  `
  })

  let promistList = totalList.map(m => connectionPromise(m))
  Promise.all(promistList).then((result) => {
    let timeList = {}
    for (let i = 0; i < result.length; i++) {
      let tlist = result[i] || [];
      for (let j = 0; j < tlist.length; j++) {
        let ext = tlist[j];
        if (!ext || !ext.t) continue;
        let t = ext.t.split(' ')[1];
        if (!timeList[t]) {
          timeList[t] = [ext.d, ext.u]
        }
        timeList[t][0] = parseInt(timeList[t][0]) + parseInt(ext.d)
        timeList[t][1] = parseInt(timeList[t][1]) + parseInt(ext.u)
      }
    }
    for (let t in timeList) {
      if (timeList.hasOwnProperty(t)) {
        timeList[t] = timeList[t].join('-')
      }
    }

    client.hmset('todaymin10', timeList, (err) => {
      if (err) {
        console.log(err)

      }
    })
  }).catch((error) => {
    console.log(error)

  })
}

const getOutTotal = () => {

  let totalList = []
  let time = new Date()
  let begin = Moment(time).startOf('day').format('yyyy-MM-DD HH:mm')
  let late = Moment(time).subtract(Moment(time).minute() % 30, "minutes").format('yyyy-MM-DD HH:mm')
  let count = Moment(late).diff(Moment(begin), 'minute')
  if (count < 0) return
  // let str = [];
  // for (let i in chg) {
  //   if (chg.hasOwnProperty(i)) {
  //     str.push(` sum(NEXT_ORG_CODE in ('${chg[i].join("','")}')) as ${i} `)
  //   }
  // }

  // totalList = list.map(m => {
  //   return `select
  //   DATE_FORMAT(concat( date( create_time ), ' ', HOUR ( create_time ), ':', floor( MINUTE ( create_time ) / 30 ) * 30 ),
  //     '%Y-%m-%d %H:%i' ) AS t ,
  //     ${str.join(' , ')}
  //   from ${m}
  //   where (create_time>'${begin}' and create_time<'${late}') and OP_CODE ='131'
  //   group by DATE_FORMAT( t, '%Y-%m-%d %H:%i' )  `
  // })
  totalList = list.map(m => {
    return `select NEXT_ORG_CODE,count(NEXT_ORG_CODE) as n
    from ${m}
    where (create_time>'${begin}' and create_time<'${late}') and OP_CODE ='131'
    group by NEXT_ORG_CODE`
  })

  let promistList = totalList.map(m => connectionPromise(m))
  Promise.all(promistList).then((result) => {

    // console.log(result)
    let dataJson = {}

    for (let i = 0; i < result.length; i++) {
      let tlist = result[i] || [];
      for (let j = 0; j < tlist.length; j++) {
        let ext = tlist[j];
        if (!ext || !ext.NEXT_ORG_CODE) continue;

        if (!dataJson[ext.NEXT_ORG_CODE]) {
          dataJson[ext.NEXT_ORG_CODE] = ext.n
        }
        dataJson[ext.NEXT_ORG_CODE] = parseInt(dataJson[ext.NEXT_ORG_CODE]) + parseInt(ext.n)
      }
    }

    let timeList = {}

    for (let c in chg) {
      if (chg.hasOwnProperty(c)) {
        let centers = chg[c];
        for (let i = 0; i < centers.length; i++) {
          if (dataJson.hasOwnProperty(centers[i])) {
            if (!timeList[c]) {
              timeList[c] = dataJson[centers[i]]
            }
            timeList[c] = parseInt(timeList[c]) + parseInt(dataJson[centers[i]])
          }
        }
      }
    }
    for (let c in jg) {
      if (jg.hasOwnProperty(c)) {
        let centers = jg[c];
        for (let i = 0; i < centers.length; i++) {
          if (dataJson.hasOwnProperty(centers[i])) {
            if (!timeList[c]) {
              timeList[c] = dataJson[centers[i]]
            }
            timeList[c] = parseInt(timeList[c]) + parseInt(dataJson[centers[i]])
          }
        }
      }
    }
    // console.log(timeList)
    client.hmset('todaymin30', timeList, (err) => {
      if (err) {
        console.log(err)

      }
    })
  }).catch((error) => {
    console.log(error)

  })
}



const get10Min = () => {

  let totalList = []
  let time = new Date()
  let late = Moment(time).format('yyyy-MM-DD HH:mm')
  // console.log(late)
  let begin = Moment(time).subtract(Moment(time).minute() % 10 + 10, "minutes").format('yyyy-MM-DD HH:mm')
  totalList = list.map(m => {
    return `select
    DATE_FORMAT(concat( date( create_time ), ' ', HOUR ( create_time ), ':', floor( MINUTE ( create_time ) / 10 ) * 10 ),
      '%Y-%m-%d %H:%i' ) AS t ,
    sum(OP_CODE ='131') as u ,
    sum(OP_CODE ='171') as d
    from ${m}
    where (create_time>'${begin}' and create_time<'${late}') and (OP_CODE ='131' or OP_CODE='171')
    group by DATE_FORMAT( t, '%Y-%m-%d %H:%i' )  `
  })

  let promistList = totalList.map(m => connectionPromise(m))
  Promise.all(promistList).then((result) => {
    let timeList = {}

    for (let i = 0; i < result.length; i++) {
      let tlist = result[i] || [];
      for (let j = 0; j < tlist.length; j++) {
        let ext = tlist[j];
        if (!ext || !ext.t) continue;
        let t = ext.t.split(' ')[1];
        if (!timeList[t]) {
          timeList[t] = [ext.d, ext.u]
        }
        timeList[t][0] = parseInt(timeList[t][0]) + parseInt(ext.d)
        timeList[t][1] = parseInt(timeList[t][1]) + parseInt(ext.u)
      }
    }

    for (let t in timeList) {
      if (timeList.hasOwnProperty(t)) {
        timeList[t] = timeList[t].join('-')
      }
    }

    client.hmset('todaymin10', timeList, (err) => {
      if (err) {
        console.log(err)

      }
    })
  }).catch((error) => {
    console.log(error)

  })
}
const clearCache = () => {
  client.del('todaymin10', (err, object) => {
    console.log('todaymin10 cache has already del at ' + Moment(new Date()).format('yyyy-MM-DD HH:mm'))
  })
  client.del('todaymin30', (err, object) => {
    console.log('todaymin30 cache has already del at ' + Moment(new Date()).format('yyyy-MM-DD HH:mm'))
  })
}
const scheduleCronstyle = () => {
  //运行即请求
  //轮子

  clearCache()
  getTotal()
  getOutTotal()

  // client.hgetall('todaymin30', (err, reply) => {
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   console.log(reply)

  // });
  // client.hgetall('todaymin10', (err, reply) => {
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   console.log(reply)

  // });

  //每10分钟定时执行一次:
  schedule.scheduleJob('*/10 * * * *', () => {
    get10Min()
    console.log('get10Min at ' + Moment(new Date()).format('yyyy-MM-DD HH:mm'))


  });

  //每30分钟定时执行一次:
  schedule.scheduleJob('*/30 * * * *', () => {
    getOutTotal()
    console.log('getOutTotal at ' + Moment(new Date()).format('yyyy-MM-DD HH:mm'))

  });
  //每天00:00定时执行一次:
  schedule.scheduleJob('59 23 ? * *', () => {
    console.log('tonight cache must be clear ' + Moment(new Date()).format('yyyy-MM-DD HH:mm'))

    clearCache()

  });
}

module.exports = scheduleCronstyle;


// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ 一周的星期 (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── 月份 (1 - 12)
// │    │    │    └────────── 月份中的日子 (1 - 31)
// │    │    └─────────────── 小时 (0 - 23)
// │    └──────────────────── 分钟 (0 - 59)
// └───────────────────────── 秒 (0 - 59, OPTIONAL)


// 每分钟的第30秒触发： '30 * * * * *'

// 每小时的1分30秒触发 ：'30 1 * * * *'

// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

// 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'


