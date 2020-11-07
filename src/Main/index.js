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
const styles = {
    SelectFieldStyle: {
        fontSize: '12px',
        overflow: 'hidden',
    },
    hintStyle: {
        fontSize: '12px',
    },
};
import { groups, groupsView } from '../../config/config.json'

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openGroup: false,
            params: {
                group: [],
                btime: '',
                etime: ''
            },
            viewData: [],
            showDetail: false,
            groupsList: [],
            groupDetail: '',
            viewDetail: [],
            detailDialog: false

        }
    }

    componentWillMount() {


        let groupsList = []
        for (let i in groups) {
            if (groups.hasOwnProperty(i)) {
                groupsList.push({
                    check: false,
                    name: i,
                })
            }
        }
        this.setState({
            groupsList
        })
    }



    componentDidMount() {


    }

    getDetail() {


        let { params, groupDetail } = this.state
        if (!groupDetail) {
            emitter.emit(SNACKBAR, '请选择班组')

            return
        }
        if (!params.btime) {
            emitter.emit(SNACKBAR, '请选择开始时间')

            return
        }
        if (!params.etime) {
            emitter.emit(SNACKBAR, '请选择结束时间')

            return
        }
        emitter.emit(PAGELOADING, true)

        axios.get(`/api/count/egroup`, {
            params: {
                group: groupDetail,
                btime: params.btime,
                etime: params.etime,
            }
        }
        ).then((response) => {

            let resData = response.data
            emitter.emit(PAGELOADING, false)

            if (resData.code == 200) {

                let data = resData.data;
                this.setState({
                    viewDetail: data
                })
            } else {
                emitter.emit(SNACKBAR, resData.msg)

            }
        })
            .catch((error) => {
                console.log(error);
            });
    }
    getData() {
        let { params } = this.state
        if (!params.group.length) {
            emitter.emit(SNACKBAR, '请选择班组')

            return
        }
        if (!params.btime) {
            emitter.emit(SNACKBAR, '请选择开始时间')

            return
        }
        if (!params.etime) {
            emitter.emit(SNACKBAR, '请选择结束时间')

            return
        }
        emitter.emit(PAGELOADING, true)

        axios.post(`/api/count/groups`, params
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
        if (params.group.length < 1) {
            return {}
        }
        let option = {
            title: {
                text: params.group,
                subtext: params.btime + '-' + params.etime,
                // sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
            },
            color: ['#61a0a8'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'

                },
                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                }
            },
            legend: {
                data: ['操作量']
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
                    data: viewData.map(m => m['group']),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
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
                    data: viewData.map(m => m['count'])
                }
            ]
        };
        return option
    }
    getDetailOption() {
        let { viewDetail, params, groupDetail } = this.state
        if (!groupDetail) {
            return {}
        }
        let option = {
            title: {
                text: groupDetail,
                subtext: params.btime + '-' + params.etime,
                // sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
            },
            color: ['#61a0a8'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'

                },
                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                }
            },
            legend: {
                data: ['操作量']
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
                    data: viewDetail.map(m => m['ip']),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
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
                    data: viewDetail.map(m => m['count'])
                }
            ]
        };
        return option
    }

    deepClone(obj) {
        //返回传递给他的任意对象的类
        function isClass(o) {
            if (o === null) return "Null";
            if (o === undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8, -1);
        }

        let result, oClass = isClass(obj);
        //确定result的类型
        if (oClass === "Object") {
            result = {};
        } else if (oClass === "Array") {
            result = [];
        } else {
            return obj;
        }
        for (let key in obj) {
            let copy = obj[key];
            if (isClass(copy) == "Object") {
                result[key] = this.deepClone(copy);//递归调用
            } else if (isClass(copy) == "Array") {
                result[key] = this.deepClone(copy);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }


    groupMenuToggle(event) {
        event.stopPropagation();
        let _this = this;

        function e(event) {
            event.stopPropagation();
            let target = ReactDOM.findDOMNode(_this.refs.openGroupBox);
            // console.log(target,event.target);
            if (!$(target).is(event.target) && $(target).has(event.target).length === 0) {

                // if (!(target.id === event.target.id) && target.querySelector(event.target).length === 0) {
                _this.setState({
                    openGroup: false
                });
                document.removeEventListener('click', e);
            }
        }

        if (this.state.openGroup === false) {
            this.setState({
                openGroup: true
            });
            document.addEventListener('click', e);
        } else if (this.state.openGroup) {
            this.setState({
                openGroup: false
            });
            document.removeEventListener('click', e);
        }
    }

    changeGroup(name) {
        let { params, groupsList } = this.state
        groupsList = groupsList.map(m => {
            if (m.name == name) {
                m.check = !m.check
            }
            return m
        })

        console.log(groupsList)
        params.group = groupsList.filter(m => m.check).map(m => m.name)

        this.setState({
            params,
            groupsList
        })
        groupsList
    }


    echarsClick(e) {
        console.log(e.name)
        if (e.name) {
            this.setState({
                groupDetail: e.name,
                detailDialog: true
            })
        }
    }



    render() {
        const {
            openGroup, params, groupsList, groupDetail, showDetail, detailDialog
        } = this.state;
        return (
            <div className='views'>
                {
                    !showDetail ? <div className="filter-control">

                        <div className="filter-item">
                            选择操作组：
    <button className="mdc-button"
                                onClick={(e) => {
                                    this.groupMenuToggle(e)
                                }}
                            >
                                <div className="mdc-button__ripple"></div>
                                <span className="mdc-button__label">{params.group.join('、') || '选择组'}</span>
                            </button>



                            <div className={`openGroupBox mdc-menu mdc-menu-surface ${openGroup ? 'mdc-menu-surface--open' : ''}`}

                                ref="openGroupBox"
                                id="openGroupBox"
                            >
                                <ul className="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabIndex="-1">
                                    {
                                        groupsList.map((m, i) => {
                                            return <li className="mdc-list-item" role="menuitem"
                                                key={'group' + i}
                                                onClick={this.changeGroup.bind(this, m.name)}

                                            >
                                                <div className="mdc-form-field">
                                                    <div className="mdc-checkbox">
                                                        <input type="checkbox"
                                                            className="mdc-checkbox__native-control"
                                                            onChange={() => {

                                                            }}
                                                            checked={m.check} />
                                                        <div className="mdc-checkbox__background">
                                                            <svg className="mdc-checkbox__checkmark"
                                                                viewBox="0 0 24 24">
                                                                <path className="mdc-checkbox__checkmark-path"
                                                                    fill="none"
                                                                    d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                                            </svg>
                                                            <div className="mdc-checkbox__mixedmark"></div>
                                                        </div>
                                                        <div className="mdc-checkbox__ripple"></div>
                                                    </div>
                                                    <label >{m.name}</label>
                                                </div>
                                            </li>
                                        })
                                    }


                                </ul>
                            </div>
                        </div>
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
                                        params.btime=''

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
                                        params.etime=''

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
                    </div> : <div className="filter-control">
                            <button className="mdc-button"
                                onClick={() => {
                                    this.setState({
                                        showDetail: false,
                                        groupDetail: '',
                                        viewDetail: [],
                                    })
                                }}
                            >
                                <div className="mdc-button__ripple"></div>
                                <span className="mdc-button__label"


                                >返回上一级</span>
                            </button>
                            <div className="filter-item">{groupDetail}- （{params.btime}-{params.etime}）</div>

                        </div>
                }




                <div className="echart-box">
                    {showDetail ?
                        <ReactEchartsCore
                            echarts={echarts}
                            option={this.getDetailOption()}
                            style={{ height: '100%', width: '100%' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                        /> : <ReactEchartsCore
                            onEvents={{
                                'click': (e) => {
                                    this.echarsClick(e)
                                }
                            }}

                            echarts={echarts}
                            option={this.getOption()}
                            style={{ height: '100%', width: '100%' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                        />

                    }

                </div>
                <div className={`mdc-dialog ${detailDialog ? 'mdc-dialog--open' : ''}`}>
                    <div className="mdc-dialog__container">
                        <div className="mdc-dialog__surface"
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="my-dialog-title"
                            aria-describedby="my-dialog-content">
                            <div className="mdc-dialog__content" id="my-dialog-content">
                                需要查看-{groupDetail}-详细信息？
                            </div>
                            <div className="mdc-dialog__actions">

                                <button type="button" className="mdc-button mdc-dialog__button"
                                    onClick={() => {
                                        this.setState({
                                            showDetail: true,
                                            detailDialog: false

                                        }, () => {
                                            this.getDetail()

                                        })
                                    }}>
                                    <div className="mdc-button__ripple"></div>
                                    <span className="mdc-button__label">确定</span>
                                </button>
                                <button type="button" className="mdc-button mdc-dialog__button"
                                    onClick={e => {
                                        this.setState({
                                            detailDialog: false,
                                            groupDetail: ''
                                        })
                                    }}>
                                    <div className="mdc-button__ripple"></div>
                                    <span className="mdc-button__label">取消</span>
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="mdc-dialog__scrim"></div>
                </div>


            </div>


        )
    }
}