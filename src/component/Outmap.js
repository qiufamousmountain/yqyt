import React from 'react';
import { axios } from '../util/server'
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

import datachina from '../../config/data-china.json';
import datajjj from '../../config/data-jjj.json';

//如果想要修改，请点击上方克隆，然后在自己的版本上修改，不要在lz的版本上改！！

let geoGpsMap = {
    'china': [116.4551, 40.2539],
    'jjj': [116.49904, 39.32178],
};
let geoCoordMapChG = {
    "江苏": [118.8062, 31.9208],
    '黑龙江': [127.9688, 45.368],
    '内蒙古': [110.3467, 41.4899],
    "吉林": [125.8154, 44.2584],
    // '北京市': [116.4551, 40.2539],
    "辽宁": [123.1238, 42.1216],
    // "河北": [114.4995, 38.1006],
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
let geoCoordMapJG = {
    // '石家庄市': [114.53952, 38.03647],
    '唐山市': [118.46023, 39.27313],
    // '邯郸市': [114.49339, 36.61853],
    // '邢台市': [114.507132, 37.06787],
    '张家口市': [115.282349, 40.974758],
    '保定市': [115.45875, 38.87757],
    // '秦皇岛市': [119.48458, 39.83507],
    '承德市': [117.80024, 40.95913],
    // '沧州市': [116.86638, 38.31404],
    // '衡水市': [115.57938, 37.55085],
    '廊坊市': [116.68572, 39.50311],

    '东城区': [116.41637, 39.92855],
    '西城区': [116.36611, 39.91231],
    '朝阳区': [116.486412, 39.92149],
    '丰台区': [116.28616, 39.85856],
    '石景山区': [116.22299, 39.90569],
    '海淀区': [116.29845, 39.95933],
    '顺义区': [116.65477, 40.13012],
    '通州区': [116.6586, 39.902485],
    '大兴区': [116.34159, 39.72684],
    '房山区': [116.14294, 39.74788],
    '门头沟区': [116.10146, 39.94048],
    '昌平区': [116.23128, 40.22077],
    '平谷区': [117.12141, 40.14062],
    '密云区': [116.84317, 40.37625],
    '怀柔区': [116.63177, 40.316],
    '延庆区': [115.97503, 40.45678],

    // '和平区': [117.195908, 39.118328],
    // '河东区': [117.22657, 39.122124],
    // '河西区': [117.22336, 39.10954],
    // '南开区': [117.15011, 39.13815],
    // '河北区': [117.19674, 39.14784],
    // '红桥区': [117.15161, 39.16734],
    // '东丽区': [117.31428, 39.08652],
    // '西青区': [117.00739, 39.14111],
    // '津南区': [117.3571, 38.9375],
    // '北辰区': [117.13544, 39.22393],
    // '武清区': [117.0443, 39.38408],
    // '宝坻区': [117.30983, 39.71755],
    // '滨海新区': [117.71071, 39.0032],
    // '宁河区': [117.82478, 39.33091],
    // '静海区': [116.97428, 38.94737],
    // '蓟州区': [117.40829, 40.04577],
};





let colors = [
    ["#1DE9B6", "#FFC809", "#FFDB5C", "#FFDB5C", "#04B9FF", "#04B9FF"],
    ["#1DE9B6", "#F46E36", "#04B9FF", "#5DBD32", "#FFC809", "#FB95D5", "#BDA29A", "#6E7074", "#546570", "#C4CCD3"],
    ["#37A2DA", "#67E0E3", "#32C5E9", "#9FE6B8", "#FFDB5C", "#FF9F7F", "#FB7293", "#E062AE", "#E690D1", "#E7BCF3", "#9D96F5", "#8378EA", "#8378EA"],
    ["#DD6B66", "#759AA0", "#E69D87", "#8DC1A9", "#EA7E53", "#EEDD78", "#73A373", "#73B9BC", "#7289AB", "#91CA8C", "#F49F42"],
];
let colorIndex = 0;

export default class Outmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionXyMap01: {},
            d1: {
                '江苏': 0,
                '黑龙江': 0,
                '内蒙古': 0,
                '吉林': 0,
                '辽宁': 0,
                '天津': 0,
                '山西': 0,
                '陕西': 0,
                '甘肃': 0,
                '宁夏': 0,
                '青海': 0,
                '新疆': 0,
                '四川': 0,
                '重庆': 0,
                '山东': 0,
                '河南': 0,
                '安徽': 0,
                '湖北': 0,
                '浙江': 0,
                '福建': 0,
                '江西': 0,
                '湖南': 0,
                '贵州': 0,
                '云南': 0,
                '广东': 0,
                '广西': 0,
                '海南': 0,
                '上海': 0,

            },
            d2: {
                '石家庄市': 0,
                '唐山市': 0,
                // '邯郸市': 0,
                // '邢台市': 0,
                '张家口市': 0,
                '保定市': 0,
                // '秦皇岛市': 0,
                '承德市': 0,
                // '沧州市': 0,
                // '衡水市': 0,
                '廊坊市': 0,

                '东城区': 0,
                '西城区': 0,
                '朝阳区': 0,
                '丰台区': 0,
                '石景山区': 0,
                '海淀区': 0,
                '顺义区': 0,
                '通州区': 0,
                '大兴区': 0,
                '房山区': 0,
                '门头沟区': 0,
                '昌平区': 0,
                '平谷区': 0,
                '密云区': 0,
                '怀柔区': 0,
                '延庆区': 0,

                // '和平区': 4235,
                // '河东区': 124,
                // '河西区': 2254,
                // '南开区': 1124,
                // '河北区': 0,
                // '红桥区': 577,
                // '东丽区': 1009,
                // '西青区': 895,
                // '津南区': 1988,
                // '北辰区': 5555,
                // '武清区': 0,
                // '宝坻区': 4545,
                // '滨海新区': 1237,
                // '宁河区': 1964,
                // '静海区': 2455,
                // '蓟州区': 845,
            }
        }
    }


    getOption() {
        let year = ["出港", "进港"];
        let { d1, d2 } = this.state
        let mapDataChG = {
            data: [],
            barData: [],
            categoryData: [],
        }
        let mapDataJG = {
            data: [],
            barData: [],
            categoryData: [],
        }

        for (let key in geoCoordMapChG) {
            mapDataChG['data'].push({
                "year": '出港',
                "name": key,
                "value": d1[key],
            });


        }
        for (let key in geoCoordMapJG) {
            mapDataJG['data'].push({
                "year": '进港',
                "name": key,
                "value": d2[key],
            });
        }

        mapDataChG['data'].sort(function sortNumber(a, b) { return a.value - b.value });
        for (let j = 0; j < mapDataChG['data'].length; j++) {
            mapDataChG['barData'].push(mapDataChG['data'][j].value);
            mapDataChG['categoryData'].push(mapDataChG['data'][j].name);
        }

        mapDataJG['data'].sort(function sortNumber(a, b) { return a.value - b.value });
        for (let j = 0; j < mapDataJG['data'].length; j++) {
            mapDataJG['barData'].push(mapDataJG['data'][j].value);
            mapDataJG['categoryData'].push(mapDataJG['data'][j].name);
        }


        echarts.registerMap('jjj', datajjj);
        echarts.registerMap('china', datachina);

        let convertData = function (from, data) {
            let res = [];
            for (let i = 0; i < data.length; i++) {
                let geoCoord = from[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };

        let convertToLineData = function (from, data, gps) {
            let res = [];
            for (let i = 0; i < data.length; i++) {
                let dataItem = data[i];
                let toCoord = from[dataItem.name];
                // debugger;
                let fromCoord = gps; //郑州
                //  let toCoord = geoGps[Math.random()*3]; 
                if (fromCoord && toCoord) {
                    res.push([{
                        coord: fromCoord,
                        value: dataItem.value
                    }, {
                        coord: toCoord,
                    }]);
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
                backgroundColor: '#013954',

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
                    // silent: true,
                    itemStyle: {
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
                    selectedMode: false,
                    emphasis: {
                        itemStyle: {
                            areaColor: '#389BB7',
                            // areaColor:'',
                            borderWidth: 0,
                            show: true,
                        }


                    },
                    data: mapDataJG['data']
                },
                title:


                    [{
                        text: '华北转运中心出港量统计',
                        left: '25%',
                        top: '5%',
                        textStyle: {
                            color: '#fff',
                            fontSize: 25
                        }

                    },
                    {
                        id: 'statistic',
                        text: "出港数据统计情况",
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
                        , formatter: function (value, index) {

                            if (value >= 1000) {
                                value = value / 1000 + 'k'
                            }

                            return value
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
                    data: mapDataChG['categoryData']
                },

                series: [
                    //未知作用
                    {
                        //文字和标志
                        // name: 'light',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(geoCoordMapChG, mapDataChG['data']),
                        symbolSize: function (val) {
                            return val[2] / 1000;
                        },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        silent: false,

                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][0]
                            }
                        }
                    },

                    //地图点的动画效果
                    {
                        //  name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(geoCoordMapChG, mapDataChG['data'].sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 20)),
                        symbolSize: function (val) {
                            return val[2] / 1000;;
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
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][0],
                                shadowBlur: 10,
                                shadowColor: colors[colorIndex][0]
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
                                color: colors[colorIndex][0],
                                width: 0.1, //尾迹线条宽度
                                opacity: 0.5, //尾迹线条透明度
                                curveness: .3 //尾迹线条曲直度
                            }
                        },
                        data: convertToLineData(geoCoordMapChG, mapDataChG['data'], geoGpsMap['china'])

                        // convertToLineData

                    },
                    //柱状图
                    {
                        zlevel: 1.5,
                        type: 'bar',
                        symbol: 'none',
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][0]
                            }
                        },
                        data: mapDataChG['barData']
                    },
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
                        // roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#031525',
                                borderColor: '#FFFFFF',
                            },
                            emphasis: {
                                areaColor: '#2B91B7',
                                show: false
                            }
                        },
                        selectedMode: false,
                        animation: false,
                        data: mapDataChG['data']
                    },
                ],
            },
            {
                backgroundColor: '#013954',

                geo: {
                    show: true,
                    map: 'jjj',
                    roam: true,
                    zoom: 1,
                    center: [117.162014, 39.014297],
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
                            borderWidth: 0,
                            show: false,
                        }

                    },
                    selectedMode: false,

                },
                title:


                    [{
                        text: '华北转运中心进港量统计',
                        left: '25%',
                        top: '5%',
                        textStyle: {
                            color: '#fff',
                            fontSize: 25
                        }

                    },
                    {
                        id: 'statistic',
                        text: "进港数据统计情况",
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
                        },
                        formatter: function (value, index) {

                            if (value >= 1000) {
                                value = value / 1000 + 'k'
                            }

                            return value
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
                    data: mapDataJG['categoryData']
                },

                series: [
                    //未知作用
                    {
                        //文字和标志
                        name: 'light',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(geoCoordMapJG, mapDataJG['data']),
                        symbolSize: function (val) {
                            return val[2] / 5000;;
                        },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        silent: false,
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][1]
                            }
                        }
                    },

                    //地图点的动画效果
                    {
                        //  name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(geoCoordMapJG, mapDataJG['data'].sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 20)),
                        symbolSize: function (val) {
                            return val[2] / 5000;;
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        // label: {
                        //     normal: {
                        //         formatter: '{b}',
                        //         position: 'right',
                        //         show: true
                        //     }
                        // },
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][1],
                                shadowBlur: 10,
                                shadowColor: colors[colorIndex][1]
                            }
                        },
                        zlevel: 1
                    },
                    //地图线的动画效果
                    //柱状图
                    {
                        zlevel: 1.5,
                        type: 'bar',
                        symbol: 'none',
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex][1]
                            }
                        },
                        data: mapDataJG['barData']
                    },
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
                                color: colors[colorIndex][1],
                                width: 0.1, //尾迹线条宽度
                                opacity: 0.5, //尾迹线条透明度
                                curveness: .3 //尾迹线条曲直度
                            }
                        },
                        data: convertToLineData(geoCoordMapJG, mapDataJG['data'], geoGpsMap['jjj'])

                        // convertToLineData

                    },
                    {
                        type: 'map',
                        map: 'jjj',
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
                        itemStyle: {
                            normal: {
                                areaColor: '#031525',
                                borderColor: '#FFFFFF',
                            },
                            emphasis: {
                                areaColor: '#2B91B7',
                                show: false
                            }
                        },
                        // silent:false,

                        animation: false,
                        data: mapDataJG['data'],
                        selectedMode: false,


                    },
                ]
            },
            ]

        };

        return optionXyMap01
    }

    clearTimers() {
        this.timer && clearInterval(this.timer)
    }
    componentDidMount() {
        this.pollingData()
    }
    shouldComponentUpdate(nesPro, nestState) {
        let { d1, d2 } = this.state
        return nestState.d1 != d1 || nestState.d2 != d2
    }


    componentWillUnmount() {
        this.clearTimers()

    }
    pollingData() {
        this.clearTimers()
        this.getData()
        this.timer = setInterval(() => {
            this.getData()
        }, 1800000)
    }
    getData() {
        axios.get(`/api/outVol`)
            .then((response) => {
                let resData = response.data
                if (resData.code == 200) {
                    let data = resData.data;

                    this.setState({
                        d1: data.d1,
                        d2: data.d2,
                    }, () => {
                        data = null
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
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