import React from 'react';
// import ReactDOM from 'react-dom';

import {
    emitter,
    PAGELOADING,
    SNACKBAR,
} from '../util/EventEmitter';
import { axios } from '../util/server'
import Moment from 'moment'

import { order, orderViews, dViews } from '../../config/order.json'


export default class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ids: '',
            viewData: []

        }
    }

    componentWillMount() {


    }



    componentDidMount() {


    }

    getData() {


        let { ids } = this.state
        if (!ids) {
            emitter.emit(SNACKBAR, '请填写单号')

            return
        }
        emitter.emit(PAGELOADING, true)

        axios.get(`/api/orders/${ids}`).then((response) => {

            let resData = response.data
            emitter.emit(PAGELOADING, false)

            if (resData.code == 200) {

                let data = resData.data;
                this.setState({
                    viewData: data,

                })
            } else {
                emitter.emit(SNACKBAR, resData.msg)

            }
        })
            .catch((error) => {
                console.log(error);
            });
    }





    render() {
        const {
            viewData, ids
        } = this.state;
        console.log(viewData)
        return (
            <div className='views'>
                <div className="filter-control">

                    <div className="filter-item">
                        请填写单号：
                        <label className="mdc-text-field mdc-text-field--outlined">
                            <span className="mdc-notched-outline">
                                <span className="mdc-notched-outline__leading"></span>
                                <span className="mdc-notched-outline__notch">
                                    <span className="mdc-floating-label" id="my-label-id"></span>
                                </span>
                                <span className="mdc-notched-outline__trailing"></span>
                            </span>
                            <input type="text" className="mdc-text-field__input" aria-labelledby="my-label-id" value={ids}
                                onChange={(e) => {
                                    var re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
                                    let ids = (e.target.value || '').replace(re, '');
                                    
                                    this.setState({ ids })
                                }}></input>
                        </label>

                    </div>
                    <button className="mdc-button mdc-button--raised"
                        onClick={this.getData.bind(this)}
                    >
                        <span className="mdc-button__label">查看</span>
                    </button>
                </div>
                <div className="echart-box">
                    {viewData.length > 0
                        ?
                        <div className="mdc-data-table">
                            <div className="mdc-data-table__table-container">
                                <table className="mdc-data-table__table" aria-label="Dessert calories">
                                    <thead>
                                        <tr className="mdc-data-table__header-row">



                                            {
                                                order.map((m, i) => {
                                                    return (
                                                        <th className="mdc-data-table__header-cell" role="columnheader" key={'trhead' + i} scope="col">{orderViews[m]}</th>

                                                    )
                                                })
                                            }
                                            <th className="mdc-data-table__header-cell" role="columnheader" scope="col">设备编号</th>
                                        </tr>
                                    </thead>
                                    <tbody className="mdc-data-table__content">
                                        {
                                            viewData.map((m, i) => {


                                                let ips = m['MODIFY_TERMINAL'];


                                                return (<tr className="mdc-data-table__row" key={'table__row' + i}>

                                                    {
                                                        order.map((mm, ii) => {



                                                            let views = m[mm];
                                                            if (mm === 'CREATE_TIME') {
                                                                views = Moment(views).format('yyyy/MM/DD HH:mm')
                                                            }
                                                            return (
                                                                <th className="mdc-data-table__header-cell" role="columnheader" key={'trsss' + ii + 'tr' + i} scope="col">{views}</th>

                                                            )
                                                        })




                                                    }

                                                    <th className="mdc-data-table__header-cell" role="columnheader" scope="col">{dViews[ips]}</th>


                                                </tr>)
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        : <div>请查询..</div>
                    }
                </div>



            </div>


        )
    }
}