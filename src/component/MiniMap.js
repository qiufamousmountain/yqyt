import React from 'react';
import { axios } from '../util/server'
import Moment from 'moment'
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';






export default class Outmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            u: (function () {
                var res = [];
                var len = 0;
                while (len < 10) {
                    res.push(parseInt(Math.random() * 10000));
                    len++;
                }
                return res;
            })(),
            d: (function () {
                var res = [];
                var len = 0;
                while (len < 10) {
                    res.push(parseInt(Math.random() * 10000));
                    len++;
                }
                return res;
            })(),
            t: (function () {
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                    now = new Date(now - 2000);
                }
                return res;
            })()
        }
    }

    componentDidMount() {
        this.getNewData()
    }
    // shouldComponentUpdate() {
    //     // return false
    // }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }
    getNewData() {
        this.timer && clearInterval(this.timer)
        let { u, d, t } = this.state
        this.timer = setTimeout(() => {
            let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');

            u.shift();
            u.push(parseInt(Math.random() * 10000));

            d.shift();
            d.push(parseInt(Math.random() * 10000));

            t.shift();
            t.push(axisData);
            this.setState({
                t, u, d
            }, () => {
                this.getNewData()
            });
        }, 2100);
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer)

    }
    getOption() {
        let { u, d, t } = this.state
        let option = {
            title: {
                text: '上下车操作对比',
                textStyle: {
                    color: '#fff'

                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            legend: {
                data: ['上车', '下车'],
                bottom: '0%',
                textStyle: {
                    color: '#fff'

                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: {
                show: false,
                start: 0,
                end: 100
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: t,

                },
            ],
            yAxis: [

                {
                    type: 'value',
                    scale: true,
                    name: '总量',
                    // max: 10000,
                    min: 0,
                    // nameLocation :'start',
                    nameTextStyle: {
                        color: '#fff'
                    },
                    axisLabel: {
                        formatter: function (value, index) {

                            if (value >= 1000) {
                                value = value / 1000 + 'k'
                            }

                            return value
                        }

                    }
                    //  boundaryGap: ['20%', '20%']
                }
            ],
            axisLabel: {
                color: "#fff"
            },
            grid: {
                left: "2%",
                // right: "2%",
                containLabel: true
                // left:"2%"
            },
            series: [
                {
                    name: '上车',
                    type: 'line',

                    itemStyle: { color: '#1DE9B6' },
                    data: d
                },
                {
                    name: '下车',
                    type: 'line',
                    itemStyle: { color: '#FFC809' },

                    data: u
                }
            ]
        }

        return option
    }

    render() {
        let { option } = this.state
        return (
            <ReactEchartsCore
                echarts={echarts}
                option={this.getOption()}
                style={{ height: '100%', width: '100%', zIndex: '100' }}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
            />
        )
    }
}