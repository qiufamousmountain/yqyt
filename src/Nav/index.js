import React from 'react';
export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: '/',
            nav: [{
                name: '数据统计',
                path: '/',
                icon: 'inbox'
            }, {
                name: '详单查询',
                path: '/orders',
                icon: 'drafts'

            }, {
                name: '未完待续..',
                path: '/1',
                icon: 'drafts'

            }]

        }
    }

    componentWillMount() {
        this.setState({
            pages: location.pathname,
        })
    }
    handleRouter(path) {
        this.props.history.push(path);
        this.setState({
            pages: path,
        })
    }


    componentDidMount() {

    }



    render() {
        const {
            pages, nav
        } = this.state;
        return (
            <aside class="mdc-drawer">
                <div class="mdc-drawer__content">
                    <nav class="mdc-list">
                        {nav.map((m, i) => {
                            return <div key={'nav' + i}
                                class={`mdc-list-item ${(pages === m.path) ? 'mdc-list-item--activated' : ''}`}
                                onClick={this.handleRouter.bind(this, m.path)} >
                                <span class="mdc-list-item__ripple"></span>
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">{m.icon}</i>
                                <span class="mdc-list-item__text">{m.name}</span>
                            </div>
                        })}
                    </nav>
                </div>
            </aside>
        )
    }
}