import React from 'react';
import ReactDOM from 'react-dom';

import {
    emitter,
    PAGELOADING,
    SNACKBAR,
} from '../util/EventEmitter';
import { axios } from '../util/server'
import DatePickers from 'react-datepicker'
import Moment from 'moment'

import ReactEchartsCore from 'echarts-for-react/lib/core';

import echarts from 'echarts/lib/echarts';

import { repeat, repeatViews, dViews } from '../../config/order.json';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
export default class Repeated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openGroup: false,
            params: {
                btime: '',
                etime: '',
            },
            viewData: [],
            repeated: '',
            order: [],
            detailDialog: false

        }
    }

    componentWillMount() {


    }



    componentDidMount() {


    }


    getData() {
        let { params } = this.state
        if (!params.btime) {
            emitter.emit(SNACKBAR, '请选择开始时间')

            return
        }
        if (!params.etime) {
            emitter.emit(SNACKBAR, '请选择结束时间')

            return
        }
        emitter.emit(PAGELOADING, true)

        axios.get(`/api/repeat`, { params }
        ).then((response) => {

            let resData = response.data
            emitter.emit(PAGELOADING, false)

            if (resData.code == 200) {

                let data = resData.data;
                this.setState({
                    viewData: data
                })
            } else {
                emitter.emit(SNACKBAR, resData.msg)

            }
        })
            .catch((error) => {
                console.log(error);
            });
    }
    getDetail() {
        let { params, repeated } = this.state
        if (!params.btime) {
            emitter.emit(SNACKBAR, '请选择开始时间')

            return
        }
        if (!params.etime) {
            emitter.emit(SNACKBAR, '请选择结束时间')

            return
        }
        if (!repeated) {
            emitter.emit(SNACKBAR, '没有选择查询项')

            return
        }
        emitter.emit(PAGELOADING, true)
        params.repeated = repeated
        axios.get(`/api/repeateddetail`, { params }
        ).then((response) => {

            let resData = response.data
            emitter.emit(PAGELOADING, false)

            if (resData.code == 200) {

                let data = resData.data;
                this.setState({
                    order: data
                })
            } else {
                emitter.emit(SNACKBAR, resData.msg)

            }
        })
            .catch((error) => {
                console.log(error);
            });
    }
    getOption() {
        let { viewData, params } = this.state

        let option = {
            title: {
                text: '进港分拣自动化重复操作统计',
                subtext: params.btime + '-' + params.etime,
            },
            color: ['#61a0a8'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'

                },
                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                }
            },
            legend: {
                data: ['操作量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: viewData.map(m => m['num']),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '操作量',
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'top'
                    },
                    barWidth: '60%',
                    data: viewData.map(m => m['cc'])
                }
            ]
        };
        return option
    }


    deepClone(obj) {
        //返回传递给他的任意对象的类
        function isClass(o) {
            if (o === null) return "Null";
            if (o === undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8, -1);
        }

        let result, oClass = isClass(obj);
        //确定result的类型
        if (oClass === "Object") {
            result = {};
        } else if (oClass === "Array") {
            result = [];
        } else {
            return obj;
        }
        for (let key in obj) {
            let copy = obj[key];
            if (isClass(copy) == "Object") {
                result[key] = this.deepClone(copy);//递归调用
            } else if (isClass(copy) == "Array") {
                result[key] = this.deepClone(copy);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }


    echarsClick(e) {
        console.log(e.name)
        if (e.name) {
            this.setState({
                repeated: e.name,
                detailDialog: true
            }, () => {
                this.getDetail()
            })
        }
    }



    render() {
        const {
            params, detailDialog, repeated, order
        } = this.state;
        return (
            <div className='views'>
                <div className="filter-control">
                    <div className="filter-item">
                        开始时间：
                            <DatePickers
                            todayButton={"今天"}
                            timeFormat="HH:mm"
                            selected={params.btime ? new Date(params.btime) : null}
                            showTimeSelect
                            onChange={(date) => {
                                if (params.etime && !Moment(date).isBefore(params.etime)) {
                                    emitter.emit(SNACKBAR, '结束时间不能早于开始时间');
                                    params.btime = ''

                                } else {
                                    params.btime = Moment(date).format('yyyy-MM-DD HH:mm');
                                }
                                this.setState({
                                    params
                                })
                            }}
                            customInput={<button className="mdc-button">
                                <div className="mdc-button__ripple"></div>
                                <span className='pick-button'>
                                    {params.btime || '请选择'}
                                </span></button>}
                            dateFormat='yyyy-MM-dd HH:mm'

                        />
                    </div>
                    <div className="filter-item">
                        结束时间：
                            <DatePickers
                            todayButton={"今天"}
                            timeFormat="HH:mm"
                            selected={params.etime ? new Date(params.etime) : null}
                            showTimeSelect
                            onChange={(date) => {

                                if (params.btime && !Moment(params.btime).isBefore(date)) {
                                    emitter.emit(SNACKBAR, '开始时间不能晚于结束时间');
                                    params.etime = ''

                                } else {
                                    params.etime = Moment(date).format('yyyy-MM-DD HH:mm');

                                }

                                this.setState({
                                    params
                                })
                            }}
                            customInput={<button className="mdc-button">

                                <div className="mdc-button__ripple"></div>

                                <span className='pick-button'>

                                    {params.etime || '请选择'}



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
                <div className="echart-box">

                    <ReactEchartsCore
                        onEvents={{
                            'click': (e) => {
                                this.echarsClick(e)
                            }
                        }}
                        echarts={echarts}
                        option={this.getOption()}
                        style={{ height: '100%', width: '100%' }}
                        notMerge={true}
                        lazyUpdate={true}
                        theme={"theme_name"}
                    />
                </div>
                <div className={`mdc-dialog ${detailDialog ? 'mdc-dialog--open' : ''}`}>
                    <div className="mdc-dialog__container ">
                        <div className="mdc-dialog__surface  list-boxs"
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="my-dialog-title"
                            aria-describedby="my-dialog-content">
                            <div className="mdc-dialog__content" id="my-dialog-content">
                                <h3>重复操作-{repeated} 次-详细信息</h3>



                                <div className="mdc-data-table">
                                    <div className="mdc-data-table__table-container">
                                        <table className="mdc-data-table__table" aria-label="Dessert calories">
                                            <thead>
                                                <tr className="mdc-data-table__header-row">
                                                    {
                                                        repeat.map((m, i) => {
                                                            return (
                                                                <th className="mdc-data-table__header-cell" role="columnheader" key={'trhead' + i} scope="col">{repeatViews[m]}</th>

                                                            )
                                                        })
                                                    }
                                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col">设备编号</th>
                                                </tr>
                                            </thead>
                                            <tbody className="mdc-data-table__content">
                                                {
                                                    order.map((m, i) => {


                                                        let ips = m['MODIFY_TERMINAL'];

                                                        return (<tr className="mdc-data-table__row" key={'table__row' + i}>

                                                            {
                                                                repeat.map((mm, ii) => {
                                                                    let views = m[mm];
                                                                    if (mm === 'TIMEDCT') {
                                                                        views = Moment(views).format('yyyy-MM-DD HH:mm')
                                                                    }
                                                                    return (
                                                                        <th className="mdc-data-table__header-cell" role="columnheader" key={'trsss' + ii + 'tr' + i} scope="col">{views}</th>

                                                                    )
                                                                })




                                                            }

                                                            {/* <th className="mdc-data-table__header-cell" role="columnheader" scope="col">{dViews[ips]}</th> */}


                                                        </tr>)
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <div className="mdc-dialog__actions">

                                <button type="button" className="mdc-button mdc-dialog__button"
                                    onClick={e => {
                                        this.setState({
                                            detailDialog: false,
                                        })
                                    }}>
                                    <div className="mdc-button__ripple"></div>
                                    <span className="mdc-button__label">知道了</span>
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="mdc-dialog__scrim"></div>
                </div>


            </div>
        )
    }
}