import React from 'react';
import ReactDOM from 'react-dom';

import Main from './main/Main';
import {
    emitter,
    SNACKBAR
} from './util/EventEmitter';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackBarOpen: false,
            snackbarText: '',
        }
    }

    componentWillMount() {
        emitter.on(SNACKBAR, (text) => {
            console.log(text)
            this.snackbarOpen(text);
        });
    }

    snackbarClose() {
        this.setState({ snackBarOpen: false, snackbarText: '' });
    }

    snackbarOpen(text) {
        this.setState({ snackBarOpen: true, snackbarText: text });
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.snackbarClose();
        }, 2000)
    }

    render() {
        const { snackBarOpen, snackbarText } = this.state;
        return (
            <div className="paper-drawer-panel">
                <Main />
                <div class= {`mdc-snackbar ${snackBarOpen?'mdc-snackbar--open':''}`}>
                    <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
                        <div class="mdc-snackbar__label" aria-atomic="false">
                        {snackbarText}
    </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('page'));