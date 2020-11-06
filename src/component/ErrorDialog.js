import React from 'react';

export default class Snack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorDialog: false,
            errorText: '',
        }
    }


    componentDidMount() {
        window.onerror = (e) => {
            this.setState({
                errorDialog: true,
                errorText: e,
            })
        };

    }

    render() {
        const { errorDialog, errorText } = this.state;
        return (
            <div class={`mdc-dialog ${errorDialog ? 'mdc-dialog--open' : ''}`}>
                <div class="mdc-dialog__container">
                    <div class="mdc-dialog__surface"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="my-dialog-title"
                        aria-describedby="my-dialog-content">
                        <div class="mdc-dialog__content" id="my-dialog-content">
                            {errorText}
                        </div>
                        <div class="mdc-dialog__actions">

                            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="discard"
                                onClick={e => {
                                    this.setState({
                                        errorDialog: false,


                                    })
                                }}>
                                <div class="mdc-button__ripple"></div>
                                <span class="mdc-button__label">知道了</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mdc-dialog__scrim"></div>
            </div>


        )
    }
}