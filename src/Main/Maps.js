import React from 'react';
import ReactDOM from 'react-dom';
const Moment = require('moment')

import Outmap from '../component/Outmap'
import Countups from '../component/Countups'
import MiniMap from '../component/MiniMap'
export default class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            clockTimer: ''
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
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }

    getIAOOPNew() {

    }
    render() {
        let { clockTimer } = this.state
        return (
            <div className='views data-screen'>
                <div className="echart-box screen-main">
                    <div className='screen-field map-main fpointborder'>
                        <Outmap />
                    </div>
                    <div className='screen-field map-total'>
                        <div className='total-run fpointborder'>
                            <div className="justitle">中心日操作总量</div>
                            <Countups />

                            <div className='time-count'>{clockTimer}</div>
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



