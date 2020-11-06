import React from 'react';
import {
    emitter,
    SNACKBAR
} from '../util/EventEmitter';

export default class Snack extends React.Component {
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
    componentWillUnmount() {
        emitter.removeListener(SNACKBAR);
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

            <div class={`mdc-snackbar ${snackBarOpen ? 'mdc-snackbar--open' : ''}`}>
                <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
                    <div class="mdc-snackbar__label" aria-atomic="false">
                        {snackbarText}
                    </div>
                </div>
            </div>

        )
    }
}