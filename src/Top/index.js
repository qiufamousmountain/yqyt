import React from 'react';
import ReactDOM from 'react-dom';
import {
    emitter,
    PAGELOADING,
} from '../util/EventEmitter';

import { axios } from '../util/server'

export default class Top extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userMenu: false
        }
    }

    componentWillMount() {

    }



    componentDidMount() {


    }


    userMenuToggle(event) {
        event.stopPropagation();
        let _this = this;

        function e(event) {
            event.stopPropagation();
            let target = ReactDOM.findDOMNode(_this.refs.userMenuBox);
            // console.log(target,event.target);
            if (!$(target).is(event.target) && $(target).has(event.target).length === 0) {
                // console.log(target.querySelector(event.target))
                // if (!(target.id===event.target.id) && target.querySelector(event.target).length === 0) {
                _this.setState({
                    userMenu: false
                });
                document.removeEventListener('click', e);
            }
        }

        if (this.state.userMenu === false) {
            this.setState({
                userMenu: true
            });
            document.addEventListener('click', e);
        } else if (this.state.userMenu) {
            this.setState({
                userMenu: 'none'
            });
            document.removeEventListener('click', e);
        }
    }
    logout() {
        emitter.emit(PAGELOADING, true);
        axios.post(`/api/userout`)
            .then((response) => {
                let data = response.data;
                if (data.code == 200) {
                    window.location.href = data.data
                } else {
                    // emitter.emit(`退出登录失败, ${data.msg}`);
                }
                emitter.emit(PAGELOADING, false);
            }).catch((error) => {
            })
    }
    render() {
        const { userMenu } = this.state;
        return (


            <header className="mdc-top-app-bar">
                <div className="mdc-top-app-bar__row">
                    <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                        <button className="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button" aria-label="Close">menu</button>
                        <span className="mdc-top-app-bar__title">业务查询内部平台</span>
                    </section>
                    <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                        <button className="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Share">share</button>
                        {/* <button className="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Delete">delete</button> */}
                        <button className="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Open menu"
                            onClick={(e) => {
                                this.userMenuToggle(e)
                            }}
                        >more_vert</button>
                        {
                            userMenu ?
                                <div className="menu-detail user-menu" ref="userMenuBox">

                                    <div className="userbox">
                                        <div className="name">你好,{USER}</div>
                                        <div className="logout" onClick={this.logout.bind(this)}>
                                            <i className="iconfont"></i>
                                            <span>退出</span>
                                        </div>
                                    </div>

                                </div> : null
                        }


                    </section>
                </div>
            </header>

        )
    }
}