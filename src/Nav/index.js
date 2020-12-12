import React from 'react';
export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: '/',
            nav: [{
                name: '下车操作统计',
                path: '/',
                icon: 'train'
            }, {
                name: '上车狂扫统计',
                path: '/gitc',
                icon: 'local_taxi'

            }, , {
                name: '上车PDA统计',
                path: '/gipda',
                icon: 'dock'

            }, {
                name: '详单查询',
                path: '/orders',
                icon: 'drafts'

            },
             {
                name: '环保袋使用率',
                path: '/package',
                icon: 'rotate_left'

            }
            ,
             {
                name: '吞吐地图',
                path: '/maps',
                icon: 'desktop_mac'

            }
        ]

        }
    }

    handleRouter(path) {
        this.props.history.push(path);
        this.setState({
            pages: path,
        })
    }


    componentDidMount() {
        this.setState({
            pages: location.pathname,
        })
    }



    render() {
        const {
            pages, nav
        } = this.state;
        return (
            <aside className="mdc-drawer">
                <div className="mdc-drawer__content">
                    <nav className="mdc-list">
                        {nav.map((m, i) => {
                            return <div key={'nav' + i}
                                className={`mdc-list-item ${(pages === m.path) ? 'mdc-list-item--activated' : ''}`}
                                onClick={this.handleRouter.bind(this, m.path)} >
                                <span className="mdc-list-item__ripple"></span>
                                <i className="material-icons mdc-list-item__graphic" aria-hidden="true">{m.icon}</i>
                                <span className="mdc-list-item__text">{m.name}</span>
                            </div>
                        })}
                    </nav>
                </div>
            </aside>
        )
    }
}