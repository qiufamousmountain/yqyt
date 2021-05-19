import React from 'react';
// import ReactDOM from 'react-dom';

import {
    emitter,
    PAGELOADING,
    SNACKBAR,
} from '../util/EventEmitter';
import { axios } from '../util/server'
import Moment from 'moment'
import DatePickers from 'react-datepicker'
import xlsx from "xlsx"
import _ from 'lodash';//引入lodash辅助工具

// import { order, orderViews, dViews } from '../../config/order.json'
const codeV = {
    110: '建包',
    111: '装车',
    131: '上车',
    171: '下车',
}
window.HASDOWNLOAD = false
export default class Turnover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btime: '',
            etime: '',
            viewData: [],

        }
    }

    componentWillMount() {


    }



    componentDidMount() {


    }

    getData() {


        let { btime, etime } = this.state
        if (!btime || !etime) {
            emitter.emit(SNACKBAR, '选择时间段')
            return
        }
        emitter.emit(PAGELOADING, true)

        axios.get(`/api/stuffturnover`, {
            params: {
                btime, etime
            }
        }).then((response) => {

            let resData = response.data
            emitter.emit(PAGELOADING, false)

            if (resData.code == 200) {

                let data = resData.data;
                data = data.map(m => {
                    m.codev = codeV[m.code]
                    return m
                })
                this.setState({
                    viewData: data,
                })
            } else {
                emitter.emit(SNACKBAR, resData.msg)

            }
        })
            .catch((error) => {
                console.log(error);
            });
    }

    exportExcel() {
        if (HASDOWNLOAD) return

        let { viewData, btime, etime } = this.state
        HASDOWNLOAD = true
        emitter.emit(PAGELOADING, true)
        emitter.emit(SNACKBAR, '正在下载请稍等...')
        this.timeers = setTimeout(() => {
            clearInterval(this.timeers)
            emitter.emit(PAGELOADING, false)
            HASDOWNLOAD = false
        }, 3000)
        //excel的导出
        //先定义需要导出的字段

        let _headers = ['ucode', 'uname', 'codev', 'code', 'count']
        let headersExport = ['工号', '姓名', '操作类型', '操作码', '操作量']

            .map((v, i) => _.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))

            .reduce((prev, next) => _.assign({}, prev, { [next.position]: { v: next.v } }), {});

        let dataExport = viewData

            .map((v, i) => _headers.map((k, j) => _.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))

            .reduce((prev, next) => prev.concat(next))

            .reduce((prev, next) => _.assign({}, prev, { [next.position]: { v: next.v } }), {});

        // 合并 headersExport 和 dataExport
        const output = _.assign({}, headersExport, dataExport);
        // 获取所有单元格的位置
        const outputPos = _.keys(output);
        // 计算出范围
        const ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

        // 构建 workbook 对象
        const workbook = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': _.assign({}, output, { '!ref': ref })
            }
        };
        const strs = `员工操作${btime}-${etime}.xlsx`;
        // 导出 Excel
        // const buffer = xlsx.writeFile(wb, strs, { type: "buffer" });//使用插件内置的方法导出写入流
        // res.set('Content-Type', 'application/vnd.openxmlformats');
        // res.set('Content-Disposition', 'attachment; filename="OKR-' + '(' + moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') + ')' + '.xlsx"');
        // res.end(buffer, 'binary');
        let wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        let wbout = xlsx.write(workbook, wopts);
        let blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        }); // 字符串转ArrayBuffer
        function s2ab(s) {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        this.openDownloadDialog(blob, strs)


    }

    openDownloadDialog(url, saveName) {

        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效

        var event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }


    render() {
        const {
            viewData, btime, etime
        } = this.state;
        console.log(viewData)
        return (
            <div className='views'>
                <div className="filter-control">

                    <div className="filter-item filter-item-turnover ">
                        开始时间：
                            <DatePickers
                            todayButton={"今天"}
                            timeFormat="HH:mm"
                            selected={btime ? new Date(btime) : null}
                            showTimeSelect
                            onChange={(date) => {
                                let btime = ''

                                if (etime && !Moment(date).isBefore(etime)) {
                                    emitter.emit(SNACKBAR, '结束时间不能早于开始时间');
                                    btime = ''
                                } else {
                                    btime = Moment(date).format('yyyy-MM-DD HH:mm');
                                }
                                this.setState({
                                    btime
                                })
                            }}
                            customInput={<button className="mdc-button">
                                <div className="mdc-button__ripple"></div>
                                <span className='pick-button'>
                                    {btime || '请选择'}
                                </span></button>}
                            dateFormat='yyyy-MM-dd HH:mm'

                        />
                    </div>
                    <div className="filter-item  filter-item-turnover ">
                        结束时间：
                            <DatePickers
                            todayButton={"今天"}
                            timeFormat="HH:mm"
                            selected={etime ? new Date(etime) : null}
                            showTimeSelect
                            onChange={(date) => {
                                let etime = ''
                                if (btime && !Moment(btime).isBefore(date)) {
                                    emitter.emit(SNACKBAR, '开始时间不能晚于结束时间');
                                    etime = ''
                                } else {
                                    etime = Moment(date).format('yyyy-MM-DD HH:mm');
                                }
                                this.setState({
                                    etime
                                })
                            }}
                            customInput={<button className="mdc-button">
                                <div className="mdc-button__ripple"></div>
                                <span className='pick-button'>
                                    {etime || '请选择'}
                                </span></button>}
                            dateFormat='yyyy-MM-dd HH:mm'
                        />


                    </div>

                    <button className="mdc-button mdc-button--raised"
                        onClick={this.getData.bind(this)}
                    >
                        <span className="mdc-button__label">查看</span>
                    </button>

                </div>
                <div className="echart-box echart-box-turnover">
                    {viewData.length > 0
                        ?
                        <div className="mdc-data-table">

                            <div className="mdc-data-table__table-container">
                                <table className="mdc-data-table__table" aria-label="Dessert calories">
                                    <thead>
                                        <tr className="mdc-data-table__header-row">

                                            <th className="mdc-data-table__header-cell" role="columnheader" scope="col">工号</th>
                                            <th className="mdc-data-table__header-cell" role="columnheader" scope="col">姓名</th>
                                            <th className="mdc-data-table__header-cell" role="columnheader" scope="col">操作编码</th>
                                            <th className="mdc-data-table__header-cell" role="columnheader" scope="col">操作类型</th>
                                            <th className="mdc-data-table__header-cell" role="columnheader" scope="col">操作量</th>
                                        </tr>
                                    </thead>
                                    <tbody className="mdc-data-table__content">
                                        {
                                            viewData.map((m, i) => {

                                                return (<tr className="mdc-data-table__row" key={'table__row' + i}>

                                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col">{m['ucode']}</th>
                                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col">{m['uname']}</th>
                                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col">{m['code']}</th>
                                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col">{m['codev']}</th>
                                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col">{m['count']}</th>


                                                </tr>)
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        : <div>请查询..</div>
                    }
                    {
                        viewData.length > 0
                            ? <div className="mdc-button-export"
                                onClick={this.exportExcel.bind(this)}
                            >
                                <span className="mdc-button-export__label">将数据导出成EXCEL</span>
                            </div>
                            : null
                    }
                </div>



            </div>


        )
    }
}