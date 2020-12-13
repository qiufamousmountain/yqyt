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

import datachina from '../../config/data-china.json';
import datajjj from '../../config/data-jjj.json';

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
    'china': [116.4551, 40.2539],
    'jjj': [116.49904, 39.32178],
};
var geoCoordMapChG = {
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
var geoCoordMapJG = {
    '石家庄': [114.53952, 38.03647],
    '唐山': [118.46023, 39.27313],
    '邯郸': [114.49339, 36.61853],
    '邢台': [114.507132, 37.06787],
    '张家口': [115.282349, 40.974758],
    '保定': [115.45875, 38.87757],
    '秦皇岛': [119.48458, 39.83507],
    '承德': [117.80024, 40.95913],
    '沧州': [116.86638, 38.31404],
    '衡水': [115.57938, 37.55085],
    '廊坊': [116.68572, 39.50311],

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

    '和平区': [117.195908, 39.118328],
    '河东区': [117.22657, 39.122124],
    '河西区': [117.22336, 39.10954],
    '南开区': [117.15011, 39.13815],
    '河北区': [117.19674, 39.14784],
    '红桥区': [117.15161, 39.16734],
    '东丽区': [117.31428, 39.08652],
    '西青区': [117.00739, 39.14111],
    '津南区': [117.3571, 38.9375],
    '北辰区': [117.13544, 39.22393],
    '武清区': [117.0443, 39.38408],
    '宝坻区': [117.30983, 39.71755],
    '滨海新区': [117.71071, 39.0032],
    '宁河区': [117.82478, 39.33091],
    '静海区': [116.97428, 38.94737],
    '蓟州区': [117.40829, 40.04577],
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
    '石家庄': 1788,
    '唐山': 1944,
    '邯郸': 2954,
    '邢台': 3482,
    '张家口': 1808,
    '保定': 5488,
    '秦皇岛': 2703,
    '承德': 2270,
    '沧州': 13623,
    '衡水': 4221,
    '廊坊': 754,

    '东城区': 17830,
    '西城区': 910,
    '朝阳区': 19070,
    '丰台区': 11111,
    '石景山区': 14200,
    '海淀区': 19780,
    '顺义区': 1615,
    '通州区': 7914,
    '大兴区': 6802,
    '房山区': 5812,
    '门头沟区': 3345,
    '昌平区': 4996,
    '平谷区': 5627,
    '密云区': 1504,
    '怀柔区': 2725,
    '延庆区': 633,

    '和平区': 4235,
    '河东区': 124,
    '河西区': 2254,
    '南开区': 1124,
    '河北区': 0,
    '红桥区': 577,
    '东丽区': 1009,
    '西青区': 895,
    '津南区': 1988,
    '北辰区': 5555,
    '武清区': 0,
    '宝坻区': 4545,
    '滨海新区': 1237,
    '宁河区': 1964,
    '静海区': 2455,
    '蓟州区': 845,
};



var colors = [
    ["#1DE9B6", "#FFC809", "#FFDB5C", "#FFDB5C", "#04B9FF", "#04B9FF"],
    ["#1DE9B6", "#F46E36", "#04B9FF", "#5DBD32", "#FFC809", "#FB95D5", "#BDA29A", "#6E7074", "#546570", "#C4CCD3"],
    ["#37A2DA", "#67E0E3", "#32C5E9", "#9FE6B8", "#FFDB5C", "#FF9F7F", "#FB7293", "#E062AE", "#E690D1", "#E7BCF3", "#9D96F5", "#8378EA", "#8378EA"],
    ["#DD6B66", "#759AA0", "#E69D87", "#8DC1A9", "#EA7E53", "#EEDD78", "#73A373", "#73B9BC", "#7289AB", "#91CA8C", "#F49F42"],
];
var colorIndex = 0;

// var geoCoordMapChG = {
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
        var mapDataChG = {
            data: [],
            barData: [],
            categoryData: [],
        }
        var mapDataJG = {
            data: [],
            barData: [],
            categoryData: [],
        }

        for (var key in geoCoordMapChG) {
            mapDataChG['data'].push({
                "year": '出港',
                "name": key,
                "value": d1[key] ,
            });


        }
        for (var key in geoCoordMapJG) {
            mapDataJG['data'].push({
                "year": '进港',
                "name": key,
                "value": d2[key] ,
            });
        }

        mapDataChG['data'].sort(function sortNumber(a, b) { return a.value - b.value });
        for (var j = 0; j < mapDataChG['data'].length; j++) {
            mapDataChG['barData'].push(mapDataChG['data'][j].value);
            mapDataChG['categoryData'].push(mapDataChG['data'][j].name);
        }

        mapDataJG['data'].sort(function sortNumber(a, b) { return a.value - b.value });
        for (var j = 0; j < mapDataJG['data'].length; j++) {
            mapDataJG['barData'].push(mapDataJG['data'][j].value);
            mapDataJG['categoryData'].push(mapDataJG['data'][j].name);
        }


        echarts.registerMap('jjj', datajjj);
        echarts.registerMap('china', datachina);

        var convertData = function (from, data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = from[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            console.log(res)
            return res;
        };

        var convertToLineData = function (from, data, gps) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var toCoord = from[dataItem.name];
                // debugger;
                var fromCoord = gps; //郑州
                //  var toCoord = geoGps[Math.random()*3]; 
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
                silent:false,

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
                    silent:false,

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
                            return val[2]/1000;
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
                        silent:false,

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
                            return val[2]/1000;;
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
                                areaColor: '#2B91B7'
                            }
                        },
                        silent:false,

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
                    silent:false,

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
                            return val[2]/1000;;
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
                        silent:false,
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
                            return val[2]/1000;;
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
                                areaColor: '#2B91B7'
                            }
                        },
                        // silent:false,

                        animation: false,
                        data: mapDataJG['data']
                    },
                ]
            },
            ]

        };

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