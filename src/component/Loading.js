import React from 'react';
import {
    emitter,
    PAGELOADING
} from '../util/EventEmitter';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLoading: false,
        }
    }

    componentWillMount() {
        emitter.on(PAGELOADING, (status) => {
            console.log(status)
            this.loadState(status);
        });
    }
    componentWillUnmount() {
        emitter.removeListener(PAGELOADING);
    }
    loadState(a) {
        this.setState({
            pageLoading: a
        })
    }

    render() {
        const {
            pageLoading
        } = this.state;
        return (
            <div className={`loading-mask ${pageLoading ? 'loading-mask-show' : ''}`}>
                <div className="load">
                    <div className="mdc-circular-progress mdc-circular-progress--indeterminate" style={{ width: "48px", height: "48px" }} role="progressbar" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1">
                        <div className="mdc-circular-progress__determinate-container">
                            <svg className="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <circle className="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" strokeWidth="4" />
                                <circle className="mdc-circular-progress__determinate-circle" cx="24" cy="24" r="18" strokeDasharray="113.097" strokeDashoffset="113.097" strokeWidth="4" />
                            </svg>
                        </div>
                        <div className="mdc-circular-progress__indeterminate-container">
                            <div className="mdc-circular-progress__spinner-layer">
                                <div className="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
                                    <svg className="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="18" strokeDasharray="113.097" strokeDashoffset="56.549" strokeWidth="4" />
                                    </svg>
                                </div><div className="mdc-circular-progress__gap-patch">
                                    <svg className="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="18" strokeDasharray="113.097" strokeDashoffset="56.549" strokeWidth="3.2" />
                                    </svg>
                                </div><div className="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
                                    <svg className="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="18" strokeDasharray="113.097" strokeDashoffset="56.549" strokeWidth="4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    请耐心等待...
                    </div>
            </div>



        )
    }
}