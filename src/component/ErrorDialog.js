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
            <div className={`mdc-dialog ${errorDialog ? 'mdc-dialog--open' : ''}`}>
                <div className="mdc-dialog__container">
                    <div className="mdc-dialog__surface"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="my-dialog-title"
                        aria-describedby="my-dialog-content">
                        <div className="mdc-dialog__content" id="my-dialog-content">
                            {errorText}
                        </div>
                        <div className="mdc-dialog__actions">

                            <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="discard"
                                onClick={e => {
                                    this.setState({
                                        errorDialog: false,


                                    })
                                }}>
                                <div className="mdc-button__ripple"></div>
                                <span className="mdc-button__label">知道了</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mdc-dialog__scrim"></div>
            </div>


        )
    }
}