import React from 'react';
import { axios } from '../util/server'
import Moment from 'moment'
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/timeline';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/effectScatter';
import 'echarts/lib/chart/lines';

// var uploadedDataURL = "/asset/get/s/data-1528971808162-BkOXf61WX.json";

import geoJson from '../../config/data-china.json';

//如果想要修改，请点击上方克隆，然后在自己的版本上修改，不要在lz的版本上改！！

// echarts.extendsMap = function(id, opt) {
//     // 实例


//     var cityMap = {
//         "郑州市": zhengzhou,
//         "开封市": kaifeng,
//         "洛阳市": luoyang,
//         "平顶山市": pingdingshan,
//         "安阳市": anyang,
//         "鹤壁市": hebi,
//         "新乡市": xinxiang,
//         "焦作市": jiaozuo,
//         "濮阳市": puyang,
//         "漯河市": luohe,
//         "三门峡市": sanmenxia,
//         "南阳市": nanyang,
//         "商丘市": shangqiu,
//         "信阳市": xinyang,
//         "周口市": zhoukou,
//         "许昌市": xuchang,
//         "驻马店市": zhumadian
//     };

// }
var geoGpsMap = {
    '1': [116.4551, 40.2539],
    '2': [116.4551, 40.2539],
};
var geoCoordMap = {
    "江苏": [118.8062, 31.9208],
    '黑龙江': [127.9688, 45.368],
    '内蒙古': [110.3467, 41.4899],
    "吉林": [125.8154, 44.2584],
    '北京市': [116.4551, 40.2539],
    "辽宁": [123.1238, 42.1216],
    "河北": [114.4995, 38.1006],
    "天津": [117.4219, 39.4189],
    "山西": [112.3352, 37.9413],
    "陕西": [109.1162, 34.2004],
    "甘肃": [103.5901, 36.3043],
    "宁夏": [106.3586, 38.1775],
    "青海": [101.4038, 36.8207],
    "新疆": [87.9236, 43.5883],
    "四川": [103.9526, 30.7617],
    "重庆": [108.384366, 30.439702],
    "山东": [117.1582, 36.8701],
    "河南": [113.4668, 34.6234],
    "安徽": [117.29, 32.0581],
    "湖北": [114.3896, 30.6628],
    "浙江": [119.5313, 29.8773],
    "福建": [119.4543, 25.9222],
    "江西": [116.0046, 28.6633],
    "湖南": [113.0823, 28.2568],
    "贵州": [106.6992, 26.7682],
    "云南": [102.9199, 25.4663],
    "广东": [113.12244, 23.009505],
    "广西": [108.479, 23.1152],
    "海南": [110.3893, 19.8516],
    '上海': [121.4648, 31.2891],
};

var d1 = {
    '江苏': 10041,
    '黑龙江': 4093,
    '内蒙古': 1157,
    '吉林': 4903,
    '北京市': 2667,
    '辽宁': 8331,
    '河北': 2372,
    '天津': 6811,
    '山西': 5352,
    '陕西': 38,
    '甘肃': 77,
    '宁夏': 65,
    '青海': 10,
    '新疆': 193,
    '四川': 309,
    '重庆': 77,
    '山东': 2166,
    '河南': 1571,
    '安徽': 15671,
    '湖北': 3714,
    '浙江': 3141,
    '福建': 955,
    '江西': 4978,
    '湖南': 778,
    '贵州': 33,
    '云南': 149,
    '广东': 1124,
    '广西': 125,
    '海南': 7,
    '上海': 2155,

};

var d2 = {
    '江苏': 11788,
    '黑龙江': 1944,
    '内蒙古': 2954,
    '吉林': 3482,
    '北京市': 1808,
    '辽宁': 5488,
    '河北': 2703,
    '天津': 2270,
    '山西': 13623,
    '陕西': 4221,
    '甘肃': 754,
    '宁夏': 1783,
    '青海': 91,
    '新疆': 1907,
    '四川': 4905,
    '重庆': 1420,
    '山东': 3978,
    '河南': 1615,
    '安徽': 7914,
    '湖北': 6802,
    '浙江': 5812,
    '福建': 3345,
    '江西': 4996,
    '湖南': 5627,
    '贵州': 1504,
    '云南': 2725,
    '广东': 6339,
    '广西': 1009,
    '海南': 0,
    '上海': 1988,
};


var colors = [
    ["#1DE9B6", "#FFC809", "#FFDB5C", "#FFDB5C", "#04B9FF", "#04B9FF"],
    ["#1DE9B6", "#F46E36", "#04B9FF", "#5DBD32", "#FFC809", "#FB95D5", "#BDA29A", "#6E7074", "#546570", "#C4CCD3"],
    ["#37A2DA", "#67E0E3", "#32C5E9", "#9FE6B8", "#FFDB5C", "#FF9F7F", "#FB7293", "#E062AE", "#E690D1", "#E7BCF3", "#9D96F5", "#8378EA", "#8378EA"],
    ["#DD6B66", "#759AA0", "#E69D87", "#8DC1A9", "#EA7E53", "#EEDD78", "#73A373", "#73B9BC", "#7289AB", "#91CA8C", "#F49F42"],
];
var colorIndex = 0;

// var geoCoordMap = {
//     '郑州': [113.64964385, 34.7566100641],
//     '开封': [114.351642118, 34.8018541758],
//     '洛阳': [112.447524769, 34.6573678177],
//     '平顶山': [113.300848978, 33.7453014565],
//     '安阳': [114.351806508, 36.1102667222],
//     '鹤壁': [114.297769838, 35.7554258742],
//     '新乡': [113.912690161, 35.3072575577],
//     '焦作': [113.211835885, 35.234607555],
//     '濮阳': [115.026627441, 35.7532978882],
//     '漯河': [114.0460614, 33.5762786885],
//     '三门峡': [111.181262093, 34.7833199411],
//     '南阳': [112.542841901, 33.0114195691],
//     "商丘": [115.641885688, 34.4385886402],
//     '信阳': [114.085490993, 32.1285823075],
//     '周口': [114.654101942, 33.6237408181],
//     '许昌': [113.83531246, 34.0267395887],
//     '驻马店': [114.049153547, 32.9831581541]
// };







export default class Outmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionXyMap01: {}
        }
    }

    
    getOption() {
        var year = ["出港", "进港"];
        var mapData = [
            [],
            [],
        ];

        /*柱子Y名称*/
        var categoryData = [];
        var barData = [];

        for (var key in geoCoordMap) {
            mapData[0].push({
                "year": '出港',
                "name": key,
                "value": d1[key] / 100,
                "value1": d1[key] / 100,
            });
            mapData[1].push({
                "year": '进港',
                "name": key,
                "value": d1[key] / 100,
                "value1": d2[key] / 100,
            });
        }

        for (var i = 0; i < mapData.length; i++) {
            mapData[i].sort(function sortNumber(a, b) { return a.value1 - b.value1 });
            barData.push([]);
            categoryData.push([]);
            for (var j = 0; j < mapData[i].length; j++) {
                barData[i].push(mapData[i][j].value1);
                categoryData[i].push(mapData[i][j].name);
            }
        }

        echarts.registerMap('china', geoJson);
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };

        var convertToLineData = function (data, gps, reverse) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var toCoord = geoCoordMap[dataItem.name];
                // debugger;
                var fromCoord = gps; //郑州
                //  var toCoord = geoGps[Math.random()*3]; 
                if (fromCoord && toCoord) {

                    if (!reverse) {
                        res.push([{
                            coord: fromCoord,
                            value: dataItem.value
                        }, {
                            coord: toCoord,
                        }]);
                    } else {
                        res.push([{
                            coord: toCoord,
                        }, {
                            coord: fromCoord,
                            value: dataItem.value
                        }]);
                    }

                }
            }
            return res;
        };

        let optionXyMap01 = {
            timeline: {
                data: year,
                axisType: 'category',
                left: '10%',
                right: '10%',
                bottom: '3%',
                width: '20%',
                autoPlay: true,
                // currentIndex: 2,
                playInterval: 30000,
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
                    trigger: 'axis', // hover触发器
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                        shadowStyle: {
                            color: 'rgba(150,150,150,0.1)' //hover颜色
                        }
                    }
                },
                geo: {
                    show: true,
                    map: 'china',
                    // roam: true,
                    zoom: 1,
                    center: [113.83531246, 34.0267395887],
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(147, 235, 248, 1)',
                            borderWidth: 1,
                            areaColor: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: 'rgba(128, 217, 248, 1)',
                            // shadowColor: 'rgba(255, 255, 255, 1)',
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 0
                        }
                    }
                },
            },
            options: []

        };

        for (var n = 0; n < year.length; n++) {

            optionXyMap01.options.push({
                backgroundColor: '#013954',
                title:


                    [{
                        text: '华北转运中心日吞吐量统计',
                        subtext: '华北转运中心IT',
                        left: '25%',
                        top: '5%',
                        textStyle: {
                            color: '#fff',
                            fontSize: 25
                        }
                    },
                    {
                        id: 'statistic',
                        text: year[n] + "数据统计情况",
                        left: '75%',
                        top: '8%',
                        textStyle: {
                            color: '#fff',
                            fontSize: 25
                        }
                    }
                    ],
                xAxis: {
                    type: 'value',
                    scale: true,
                    position: 'top',
                    min: 0,
                    boundaryGap: false,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        margin: 2,
                        textStyle: {
                            color: '#aaa'
                        }
                    },
                },
                yAxis: {
                    type: 'category',
                    //  name: 'TOP 20',
                    nameGap: 16,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            color: '#ddd'
                        }
                    },
                    data: categoryData[n]
                },

                series: [
                    //未知作用
                    {
                        //文字和标志
                        name: 'light',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(mapData[n]),
                        symbolSize: function (val) {
                            return val[2] / 10;
                        },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][n]
                            }
                        }
                    },
                    //地图？
                    {
                        type: 'map',
                        map: 'china',
                        geoIndex: 0,
                        aspectScale: 0.75, //长宽比
                        showLegendSymbol: false, // 存在legend时显示
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        roam: true,
                        // itemStyle: {
                        //     normal: {
                        //         areaColor: '#031525',
                        //         borderColor: '#FFFFFF',
                        //     },
                        //     emphasis: {
                        //         areaColor: '#2B91B7'
                        //     }
                        // },
                        animation: false,
                        data: mapData
                    },
                    //地图点的动画效果
                    {
                        //  name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(mapData[n].sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 20)),
                        symbolSize: function (val) {
                            return val[2] / 10;
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][n],
                                shadowBlur: 10,
                                shadowColor: colors[colorIndex][n]
                            }
                        },
                        zlevel: 1
                    },
                    //地图线的动画效果
                    {
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 4, //箭头指向速度，值越小速度越快
                            trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                            symbol: 'arrow', //箭头图标
                            symbolSize: 3, //图标大小
                        },
                        lineStyle: {
                            normal: {
                                color: colors[colorIndex][n],
                                width: 0.1, //尾迹线条宽度
                                opacity: 0.5, //尾迹线条透明度
                                curveness: .3 //尾迹线条曲直度
                            }
                        },
                        data: convertToLineData(mapData[n], geoGpsMap[n + 1], year[n] == '进港' ? true : false)

                        // convertToLineData

                    },
                    //柱状图
                    {
                        zlevel: 1.5,
                        type: 'bar',
                        symbol: 'none',
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][n]
                            }
                        },
                        data: barData[n]
                    }
                ]
            })
        }
        return optionXyMap01
    }


    shouldComponentUpdate() {
        return false
    }
    render() {
        // let { optionXyMap01 } = this.state
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