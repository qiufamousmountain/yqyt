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
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data: ['蒸发量', '降水量', '平均温度']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '操作总量',
                    min: 0,
                    max: 250,
                    // interval: 50,
                    axisLabel: {
                        formatter:function(value){
                            return value/100+'k'
                        } 
                    }
                },
                {
                    type: 'value',
                    name: '单位时间操作量',
                    min: 0,
                    max: 25,
                    // interval: 5,
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    name: '降水量',
                    type: 'bar',
                    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name: '平均温度',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };
        
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