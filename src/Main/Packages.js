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
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openGroup: false,
            params: {
                btime: '',
                etime: ''
            },
            viewData: [],
            vtitle: '包使用情况'

        }
    }

    componentWillMount() {

    }



    componentDidMount() {

        this.getData()
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

        axios.post(`/api/count/package`, params
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
    getOption() {
        let { viewData, params } = this.state
        let option = {
            title: {
                text: params.group,
                subtext: params.btime + '-' + params.etime,
                // sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
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
                    data: viewData.map(m => m['group']),
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
                    data: viewData.map(m => m['count'])
                }
            ]
        };
        return option
    }


    echarsClick(e) {
        console.log(e.name)
        if (e.name) {

        }
    }



    render() {
        const { params } = this.state;
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
                                    params.btime = Moment(date).format('yyyy/MM/DD HH:mm');


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
                            dateFormat='yyyy/MM/dd HH:mm'

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
                                    params.etime = Moment(date).format('yyyy/MM/DD HH:mm');

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
                            dateFormat='yyyy/MM/dd HH:mm'
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
                        echarts={echarts}
                        option={this.getDetailOption()}
                        style={{ height: '100%', width: '100%' }}
                        notMerge={true}
                        lazyUpdate={true}
                        theme={"theme_name"}
                    />

                </div>
            </div>


        )
    }
}