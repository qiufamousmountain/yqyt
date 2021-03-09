import React from 'react';
import ReactDOM from 'react-dom';
const Moment = require('moment')

import Outmap from '../component/Justdown'
export default class Maps2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            clockTimer: '',
            FS: false

        }
    }

    ClockTimer() {
        this.timer && clearInterval(this.timer)

        this.timer = setTimeout(() => {
            this.setState({
                clockTimer: Moment(new Date()).format('yyyy-MM-DD HH:mm:ss')
            })
            this.ClockTimer()

        }, 1000);
    }
    componentDidMount() {
        this.ClockTimer()
        window.addEventListener('resize', (e) => {
            let { FS } = this.state;
            let isFull = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false
            console.log(isFull, FS, e)
            this.setState({
                FS: !!(isFull)
            })
        })
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
        window.removeEventListener('resize', (e) => { })

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
    render() {
        let { clockTimer, FS } = this.state
        return (
            <div className='views data-screen'>
                <div className="echart-box screen-main" id='screen-main'>

                    <div className='screen-field map-main-j1 fpointborder'>
                        <div className="control-box">

                            {
                                FS ?
                                    <div className="control-item out-full" onClick={this.exitFullScreen.bind(this)}>退出全屏</div>
                                    : <div className="control-item full-btn" onClick={this.fullScreen.bind(this)}>启动全屏</div>


                            }

                        </div>
                        <Outmap />
                    </div>
                    {/* <div className='screen-field map-total'>
                        <div className='total-run fpointborder'>
                            <div className="justitle">中心日操作总量</div>
                            <Countups />

                            <div className='time-count'>{clockTimer}</div>
                        </div>
                        <div className='total-moment fpointborder'>

                            <MiniMap />
                        </div>




                    </div> */}


                </div>
            </div>


        )
    }
}



