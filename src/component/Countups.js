import React from 'react';
import CountUp from 'react-countup';
import { axios } from '../util/server'

export default class Countups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: 1000
        }
    }

    componentDidMount() {
        this.pollingData()
    }
    shouldComponentUpdate(nesPro, nestState) {
        let { start, end } = this.state
        return nestState.start != start || nestState.end != end
    }
    componentWillUnmount() {
        this.clearTimers()
    }

    pollingData() {
        this.clearTimers()
        this.getData()
        this.timer = setInterval(() => {
            this.getData('add')
        }, 600000)
    }

    clearTimers() {
        this.timer && clearInterval(this.timer)
    }
    
    getData(type = 'all') {
        axios.get(`/api/totalcount`, { params: { type } })
            .then((response) => {
                let resData = response.data
                if (resData.code == 200) {
                    let data = resData.data;
                    let end = data;
                    let start = data - parseInt(data / 10);
                    if (type == 'add') {
                        start = this.state.end;
                        end = this.state.end + data
                    }
                    this.setState({
                        start,
                        end
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { end, start } = this.state

        return (
            <CountUp
                ref={el => this.countup = el}
                start={start}
                end={end}
                duration={600}
                delay={0}
                redraw={true}

            >
                {({ countUpRef }) => (

                    <div
                        className={'total-change'}
                    >
                        <span ref={countUpRef} />
                    </div>
                )}
            </CountUp>

        )
    }
}