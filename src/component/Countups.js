import React from 'react';
import CountUp from 'react-countup';

export default class Countups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: 160527
        }
    }

    componentDidMount() {
        this.addCount()
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }

    addCount() {

        let { start, end } = this.state
        this.timer && clearInterval(this.timer)

        this.timer = setTimeout(() => {

            this.setState({
                start: end,
                end: parseInt(end) + parseInt(Math.floor(Math.random() * 10000))
            }, () => {
                this.addCount()
            })

        }, 5000)

    }

    render() {
        const { end, start } = this.state

        return (
            <CountUp
                ref={el => this.countup = el}
                start={start}
                end={end}
                duration={5}
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