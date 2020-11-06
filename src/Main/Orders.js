import React from 'react';
import ReactDOM from 'react-dom';

import {
    emitter,
    PAGELOADING,
    SNACKBAR,
} from '../util/EventEmitter';
import { axios } from '../util/server'
import Moment from 'moment'

import { order, orderViews } from '../../config/config.json'


export default class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ids: '',
            viewData: [],

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
                        <label class="mdc-text-field mdc-text-field--outlined">
                            <span class="mdc-notched-outline">
                                <span class="mdc-notched-outline__leading"></span>
                                <span class="mdc-notched-outline__notch">
                                    <span class="mdc-floating-label" id="my-label-id"></span>
                                </span>
                                <span class="mdc-notched-outline__trailing"></span>
                            </span>
                            <input type="text" class="mdc-text-field__input" aria-labelledby="my-label-id" value={ids}
                                onChange={(e) => {
                                    this.setState({
                                        ids: e.target.value
                                    })
                                }}></input>
                        </label>

                    </div>
                    <button class="mdc-button mdc-button--raised"
                        onClick={this.getData.bind(this)}
                    >
                        <span class="mdc-button__label">查看</span>
                    </button>
                </div>
                <div className="echart-box">
                    {viewData.length > 0
                        ?
                        <div class="mdc-data-table">
                            <div class="mdc-data-table__table-container">
                                <table class="mdc-data-table__table" aria-label="Dessert calories">
                                    <thead>
                                        <tr class="mdc-data-table__header-row">



                                            {
                                                order.map((m, i) => {
                                                    return (
                                                        <th class="mdc-data-table__header-cell" role="columnheader" key={'trhead' + i} scope="col">{orderViews[m]}</th>

                                                    )
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody class="mdc-data-table__content">
                                       {
                                            viewData.map((m, i) => {
                                                return (<tr class="mdc-data-table__row">

                                                    {
                                                        order.map((mm, ii) => {



                                                            let views=m[mm];
                                                            if(mm==='CREATE_TIME'){
                                                                views=Moment(views).format('yyyy/MM/DD HH:mm')
                                                            }
                                                            return (
                                                                <th class="mdc-data-table__header-cell" role="columnheader" key={'trsss' + ii + 'tr' + i} scope="col">{views}</th>

                                                            )
                                                        })
                                                    }
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