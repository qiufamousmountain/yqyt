import React from 'react';
import ReactDOM from 'react-dom';

import {
    emitter,
    PAGELOADING,
    SNACKBAR,
} from '../util/EventEmitter';
import { axios } from '../util/server'
import Moment from 'moment'
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import beijing from '../../config/beijing.json'
import CountUp from 'react-countup';
export default class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            start: 0,
            end: 160527
        }
    }

    componentWillMount() {

    }



    componentDidMount() {



        this.addCount()
    }

    addCount() {

        let that = this
        setTimeout(() => {

            that.setState({
                start: that.state.end,
                end: parseInt(that.state.end) + parseInt(Math.floor(Math.random()*10000))
            }, () => {
                console.log(that.state.end, that.state.start)
                that.addCount()
                // this.countup.restart()
            })

        }, 5000)

    }
    // getData() {

    //     axios.get(`/api/count/package`).then((response) => {

    //         let resData = response.data
    //         emitter.emit(PAGELOADING, false)

    //         if (resData.code == 200) {

    //             let data = resData.data;
    //             this.setState({
    //                 viewData: data
    //             })
    //         } else {
    //             emitter.emit(SNACKBAR, resData.msg)

    //         }
    //     })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }
    getOption() {
        echarts.registerMap('北京', beijing);
        let option = {

            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                formatter: function (params) {
                    return params.seriesName + '<br/>' + params.name + ': ' + params.value;
                }
            },
            series: {
                type: 'map',
                map: '北京',
                layoutCenter: ['50%', '50%'],
                layoutSize: '100%',
                name: '进港总量',
                data: [
                    { name: '东城区', value: 4822023 },
                    { name: '西城区', value: 731449 },
                    { name: '朝阳区', value: 6553255 },
                    { name: '丰台区', value: 2949131 },
                    { name: '石景山区', value: 38041430 },
                    { name: '海淀区', value: 5187582 },
                    { name: '顺义区', value: 3590347 },
                    { name: '通州区', value: 917092 },
                    { name: '大兴区', value: 632323 },
                    { name: '房山区', value: 19317568 },
                    { name: '门头沟区', value: 9919945 },
                    { name: '昌平区', value: 1392313 },
                    { name: '平谷区', value: 1595728 },
                    { name: '密云区', value: 12875255 },
                    { name: '怀柔区', value: 6537334 },
                    { name: '延庆区', value: 3074186 }
                ],
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(26,65,91,0.4)',
                        borderColor: '#9DDCEB',
                        borderWidth: 2,
                        shadowColor: '#9DDCEB',
                        shadowBlur: 20
                    },
                    emphasis: {
                        areaColor: 'rgba(24,65,91,0.3)'
                    }
                }
            }
        }
        return option
    }


    echarsClick(e) {
        console.log(e.name)
        if (e.name) {

        }
    }



    render() {
        console.log(this.state.end)
        const {end,start}=this.state
        return (
            <div className='views data-screen'>
                <div className="echart-box screen-main">
                    <CountUp
                        ref={el => this.countup = el}
                        start={start}
                        end={end}
                        duration={5}
                        delay={0}
                        redraw={true}

                    >
                        {({ countUpRef }) => (

                            <div
                                className={'total-change'}
                            >
                                <span ref={countUpRef} />
                            </div>
                        )}
                    </CountUp>
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