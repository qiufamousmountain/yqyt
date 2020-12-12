import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';




import Order from './Main/Orders';
import Gitc from './Main/Gitc';
import GiPda from './Main/GiPda';
import Packages from './Main/Packages';
import Maps from './Main/Maps';



import Top from './Top';
import Nav from './Nav';
import Snack from './component/Snack';
import Loading from './component/Loading';
import ErrorDialog from './component/ErrorDialog';

import history from './util/history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            routers: [
                {
                    path: '/',
                    component: Main,
                },
                {
                    path: '/orders',
                    component: Order,
                },
                {
                    path: '/gitc',
                    component: Gitc,
                },

                {
                    path: '/gipda',
                    component: GiPda,
                },
                {
                    path: '/package',
                    component: Packages,
                }
                ,
                {
                    path: '/maps',
                    component: Maps,
                }
            ]
        }
    }



    render() {
        const { routers } = this.state;
        return (
            <Router history={history}>
                <div id="main">
                    <Top />
                    <div className="main-box">
                        <Route render={props => <Nav {...props} />} />
                        <Switch>
                            {
                                (routers || []).map((data, k) => {
                                    return (
                                        <Route exact key={k} path={data.path}
                                            component={data.component} />
                                    )
                                })
                            }
                            <Route exact path='/' component={Main} />

                        </Switch>
                    </div>

                    <Snack />
                    <Loading />
                    <ErrorDialog />

                </div >

            </Router>


        )
    }
}

ReactDOM.render(<App />, document.getElementById('page'));