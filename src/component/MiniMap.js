import React from 'react';
import { axios } from '../util/server'
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/dataZoom';





export default class Outmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            dataJson: []
        }
    }

    componentDidMount() {
        this.pollingData()
    }
    shouldComponentUpdate(nesPro, nestState) {
        let { dataJson } = this.state
        return nestState.dataJson != dataJson
    }


    componentWillUnmount() {
        this.clearTimers()

    }
    getOption() {
        let { dataJson } = this.state
        console.log(dataJson)
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
                    dataZoom: {
                        yAxisIndex: 'none'
                    }, restore: {},
                    saveAsImage: {}
                }
            },

            dataZoom: [{
                type: 'inside',
                start: 90,
                end: 100
            }, {
                start: 90,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: dataJson.map(m => m.t),

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
                    data: dataJson.map(m => m.u)
                },
                {
                    name: '下车',
                    type: 'line',
                    itemStyle: { color: '#FFC809' },

                    data: dataJson.map(m => m.d)
                }
            ]
        }

        return option
    }



    pollingData() {
        this.clearTimers()
        this.getData()
        this.timer = setInterval(() => {
            this.getData('add')
        }, 600000)
    }

    clearTimers() {
        this.timer && clearInterval(this.timer)
    }
    getData() {
        axios.get(`/api/every10Min`)
            .then((response) => {
                let resData = response.data
                if (resData.code == 200) {
                    let data = resData.data;

                    this.setState({
                        dataJson: data,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
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