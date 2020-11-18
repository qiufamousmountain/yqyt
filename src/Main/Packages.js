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

        axios.get(`/api/count/package`, {params}
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
                text: '华北转运中心环保袋使用情况',
                subtext: `${params.btime}-${params.etime}`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: viewData.map(m => m.group)

            },
            series: [
                {
                    name: '使用量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: viewData.map(m => {
                        return {
                            name: m.group,
                            value: m.count
                        }
                    }),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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
                        option={this.getOption()}
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