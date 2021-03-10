import React from 'react';
import ReactDOM from 'react-dom';
const Moment = require('moment')

import ReactEchartsCore from 'echarts-for-react/lib/core';

import {
    emitter,
    PAGELOADING,
    SNACKBAR,
} from '../util/EventEmitter';
import { axios } from '../util/server'
import echarts from 'echarts/lib/echarts';
// import Countups from '../component/Countups'
// import MiniMap from '../component/MiniMap'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/timeline';
// import Outmap from '../component/Justdown'
let colors = ["#1DE9B6", "#FFC809", "#FFDB5C", "#FFDB5C", "#04B9FF", "#04B9FF", "#F46E36", "#04B9FF", "#5DBD32", "#FFC809", "#FB95D5", "#BDA29A",
    "#6E7074", "#546570", "#C4CCD3",
    "#37A2DA", "#67E0E3", "#32C5E9", "#9FE6B8", "#FFDB5C", "#FF9F7F", "#FB7293", "#E062AE", "#E690D1", "#E7BCF3", "#9D96F5", "#8378EA", "#8378EA",
    "#DD6B66", "#759AA0", "#E69D87", "#8DC1A9", "#EA7E53", "#EEDD78", "#73A373", "#73B9BC", "#7289AB", "#91CA8C", "#F49F42",
];
export default class Maps2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jgviewData: [],
            jglinVdata: [],
            chgviewData: [],
            chglinVdata: [],
            clockTimer: '',
            FS: false,
            type: 'jg',
            clas: ''
        }
    }
    ClockTimer() {
        this.timer && clearInterval(this.timer)
        this.timer = setTimeout(() => {
            let t = new Date()
            if (Moment(t).minute() === 0 && Moment(t).second() === 0) {
                this.getListENV()
            }

            if (Moment(t).second() === 0||Moment(t).second() === 30) {
                this.getList()
            }
            t = null;
            this.ClockTimer()

        }, 1000);
    }

    // ClockTimer10() {
    //     this.timer10 && clearInterval(this.timer10)
    //     this.timer10 = setTimeout(() => {
    //         this.getList()
    //         this.ClockTimer10()

    //     }, 30000);
    // }
    componentDidMount() {
        this.ClockTimer()
        // this.ClockTimer10()
        this.getList()
        this.getListENV()
        window.addEventListener('resize', (e) => {
            let { FS } = this.state;
            let isFull = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false
            // console.log(isFull, FS, e)
            this.setState({
                FS: !!(isFull)
            })
        })
    }
    componentWillUnmount() {
        // this.timer10 && clearInterval(this.timer10)
        this.timer && clearInterval(this.timer)


        window.removeEventListener('resize', (e) => { })

    }
    getList() {
        axios.get(`/api/viewjchg`)
            .then((response) => {
                let resData = response.data
                if (resData.code == 200) {
                    let data = resData.data;
                    this.setState({
                        jgviewData: data.jgList,
                        chgviewData: data.chgList,
                        clas: data.clas,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });



    }
    getListENV() {
        axios.get(`/api/viewjchgev`)
            .then((response) => {
                let resData = response.data
                if (resData.code == 200) {
                    let data = resData.data;
                    // console.log(data)
                    this.setState({
                        jglinVdata: data.jgList,
                        chglinVdata: data.chgList,
                        clas: data.clas,

                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });



    }

    getOption() {
        let { jgviewData, chgviewData, type, jglinVdata, chglinVdata, clas } = this.state
        // if (params.group.length < 1) {
        //     return {}
        // }

        let optionXyMap01 = {
            timeline: {
                data: ["操作量", "时效"],
                axisType: 'category',
                // left: '10%',
                right: '10%',
                top: '3%',
                width: '20%',
                autoPlay: true,
                // currentIndex: 2,
                playInterval: 100000,
            },
            baseOption: {
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicInOut',
                animationDurationUpdate: 1000,
                animationEasingUpdate: 'cubicInOut',
                grid: {
                    right: '1%',
                    top: '15%',
                    bottom: '10%',
                    width: '20%'
                },
                tooltip: {
                    trigger: 'item', // hover触发器
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                        shadowStyle: {
                            color: 'rgba(150,150,150,0.1)' //hover颜色
                        },

                    }
                },

            },
            options: [{
                title: {
                    text: `${type == 'jg' ? '进港' : '出港'} ${clas == 'a' ? 'A组-8:00-' : 'B组-20:00-'}  操作统计`,
                },
                color: ['#61a0a8'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    // formatter: function (params) {
                    //     var tar = params[0];
                    //     return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                    // }
                },
                legend: {
                    data: ['操作量',
                        // '时效'
                    ]
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
                        data: (type == 'jg' ? jgviewData : chgviewData).map(m => m['name']),
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '操作量',
                        axisLabel: {
                            formatter: function (value) {
                                return value / 1000 + 'k'
                            }
                        }
                    },

                    // {
                    //     type: 'value',
                    //     name: '时效',
                    //     axisLabel: {
                    //         formatter: '{value}'
                    //     }
                    // }
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
                        data: (type == 'jg' ? jgviewData : chgviewData).map(m => m['total'])
                    },
                    // {
                    //     name: '时效',
                    //     type: 'line',
                    //     label: {
                    //         show: true,
                    //         position: 'top'
                    //     },
                    //     yAxisIndex: 1,
                    //     data: viewData.map(m => m['bf1']),
                    //     itemStyle: { color: '#FFC809' },
                    // }
                ]
            }, {
                title: {
                    text: `${type == 'jg' ? '进港' : '出港'} ${clas == 'a' ? 'A组-8:00-' : 'B组-20:00-'}  时效`,
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
                    data: (type == 'jg' ? jglinVdata : chglinVdata).map(m => m.name),
                    bottom: '0%',
                    textStyle: {
                        // color: '#fff'

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
                    start: 0,
                    end: 100
                }, {
                    start: 0,
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
                        data: (((type == 'jg' ? jglinVdata : chglinVdata)[0] || {}).bf1 || []).map(m => m.t),

                    },
                ],
                yAxis: [

                    {
                        type: 'value',
                        scale: true,
                        name: '时效',
                        // max: 10000,
                        min: 0,
                        // nameLocation :'start',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        axisLabel: {
                            formatter: function (value, index) {

                                return value
                            }

                        }
                        //  boundaryGap: ['20%', '20%']
                    }
                ],
                axisLabel: {
                    // color: "#fff"
                },
                grid: {
                    left: "2%",
                    // right: "2%",
                    containLabel: true
                    // left:"2%"
                },
                series: (type == 'jg' ? jglinVdata : chglinVdata).map((m, i) => {

                    return {
                        name: m.name,
                        type: 'line',

                        itemStyle: { color: colors[i] },
                        data: m.bf1.map(m => m.c),
                        label: {
                            show: true,
                            position: 'top right'
                        },
                    }
                })
            }
            ]

        };





        return optionXyMap01
    }

    fullScreen(e, el = document.getElementById('screen-main')) {
        let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;

        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            this.setState({
                FS: true
            })
            return;
        }
        if (typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if (wscript) {
                wscript.SendKeys("{F11}");
                this.setState({
                    FS: true
                })
            }
        }
    }
    exitFullScreen(e, el = document) {
        let cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
            wscript;

        if (typeof cfs != "undefined" && cfs) {
            cfs.call(el);

            this.setState({
                FS: false
            })
            return;
        }
        if (typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
                this.setState({
                    FS: false
                })
            }
        }

    }

    changeType() {
        let { type } = this.state;

        this.setState({
            type: type === 'jg' ? 'chg' : 'jg'
        })
    }
    render() {
        let { FS } = this.state
        return (
            <div className='views data-screen'>
                <div className="echart-box screen-main screen-mainnot " id='screen-main'>
                    <div className='screen-field map-main-j1'>
                        <div className="control-box">

                            {
                                FS ?
                                    <div className="control-item out-full" onClick={this.exitFullScreen.bind(this)}>退出全屏</div>
                                    : <div className="control-item full-btn" onClick={this.fullScreen.bind(this)}>启动全屏</div>
                            }


                            <div className="control-item full-btn" onClick={this.changeType.bind(this)}>换进出港</div>
                        </div>
                        <ReactEchartsCore
                            echarts={echarts}
                            option={this.getOption()}
                            style={{ height: '100%', width: '100%' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                        />
                    </div>
                    {/* <div className='screen-field map-total'>
                        <div className='total-run fpointborder'>
                            <div className="justitle">进港卸车A操作总量</div>
                            <Countups />

                            <div className='time-count'>{clockTimer}</div>
                        </div>
                        <div className='total-moment fpointborder'>

                            <MiniMap />
                        </div>




                    </div>  */}


                </div>
            </div>


        )
    }
}



