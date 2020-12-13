import React from 'react';
import ReactDOM from 'react-dom';

import Outmap from '../component/Outmap'
import Countups from '../component/Countups'
import MiniMap from '../component/MiniMap'
export default class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],

        }
    }








    // getOption() {
    //     echarts.registerMap('北京', beijing);
    //     let option = {
    //         tooltip: {
    //             trigger: 'item',
    //             showDelay: 0,
    //             transitionDuration: 0.2,
    //             formatter: function (params) {
    //                 return params.seriesName + '<br/>' + params.name + ': ' + params.value;
    //             }
    //         },

    //         visualMap: {
    //             min: 0,
    //             max: 200000,
    //             splitNumber: 8,
    //             inRange: {
    //                 color: ['#9DDCEB', '#6495ED', 'rgba(26,65,91)'],
    //                 symbolSize: [30, 100]
    //             },
    //             controller: {
    //                 inRange: {
    //                     symbolSize: [30, 100]
    //                 }
    //             }
    //         },
    //         series: {
    //             type: 'map',
    //             map: '北京',
    //             layoutCenter: ['50%', '50%'],
    //             layoutSize: '100%',
    //             name: '进港总量',
    //             data: [
    //                 { name: '东城区', value: 48220 },
    //                 { name: '西城区', value: 73144 },
    //                 { name: '朝阳区', value: 6553 },
    //                 { name: '丰台区', value: 29491 },
    //                 { name: '石景山区', value: 38041 },
    //                 { name: '海淀区', value: 51875 },
    //                 { name: '顺义区', value: 35903 },
    //                 { name: '通州区', value: 9170 },
    //                 { name: '大兴区', value: 6323 },
    //                 { name: '房山区', value: 193175 },
    //                 { name: '门头沟区', value: 99199 },
    //                 { name: '昌平区', value: 13923 },
    //                 { name: '平谷区', value: 1595 },
    //                 { name: '密云区', value: 12875 },
    //                 { name: '怀柔区', value: 65373 },
    //                 { name: '延庆区', value: 30741 }
    //             ],
    //             label: {
    //                 normal: {
    //                     show: true,
    //                     textStyle: {
    //                         color: '#fff'
    //                     },
    //                     formatter: function (val) {
    //                         var area_content = '{a|' + val.name + '}' + '-' + '{b|' + val.data.value + '}';
    //                         return area_content.split("-").join("\n");
    //                     },//让series 中的文字进行换行
    //                     rich: {
    //                         a: {
    //                             color: '#fff'
    //                         },
    //                         b: {
    //                             color: '#fff',
    //                         }
    //                     },

    //                 },
    //                 emphasis: {
    //                     show: true,
    //                     textStyle: {
    //                         color: '#fff'
    //                     }
    //                 }
    //             },
    //             itemStyle: {
    //                 normal: {
    //                     areaColor: 'rgba(26,65,91,0.4)',
    //                     borderColor: '#fff',
    //                     borderWidth: 2,
    //                     shadowColor: '#fff',
    //                     shadowBlur: 20
    //                 },
    //                 emphasis: {
    //                     areaColor: 'rgba(24,65,91,0.7)'
    //                 }
    //             }
    //         }
    //     }
    //     return option
    // }


    echarsClick(e) {
        console.log(e.name)
        if (e.name) {

        }
    }
    componentDidMount() {
        this.timer = setTimeout(
            () => {
                this.setState({ content: '我是定时器打印的内容...One' })
            },
            1000
        );
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }


    render() {
        return (
            <div className='views data-screen'>
                <div className="echart-box screen-main">
                    <div className='screen-field map-main fpointborder'>
                        <Outmap />
                    </div>
                    <div className='screen-field map-total'>
                        <div className='total-run fpointborder'>
                            <div className="justitle">中心日吞吐总量</div>
                            <Countups />
                        </div>
                        <div className='total-moment fpointborder'>

                            <MiniMap />
                        </div>
                    </div>



                    {/* <ReactEchartsCore
                        echarts={echarts}
                        option={this.getOption()}
                        style={{ height: '100%', width: '100%' }}
                        notMerge={true}
                        lazyUpdate={true}
                        theme={"theme_name"}
                    /> */}

                </div>
            </div>


        )
    }
}



