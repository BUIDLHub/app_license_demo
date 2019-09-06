import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Redirect, Route,Switch } from "react-router-dom";
import Portfolio from 'Routes/Portfolio';
import error from "Routes/Error";
import {default as initOps} from 'Redux/init/operations';

import Navigation from "Components/Navbar";
import Footer from "Views/Footer";
import { ToastContainer } from "react-toastify";

const DEF_START = "/portfolio"

class AppStart extends Component {
  componentWillMount() {
    if(this.props.needsInit) {
      this.props.callInit();
    }
  }

  render() {
    const { location, match } = this.props;
    if (location.pathname === '/') {
      return (<Redirect to={DEF_START} />);
    }

    return (
        <Router>
          <div className="App">
            <Navigation />
            <ToastContainer />
            <header className="page">
              {/* <Licensor /> */}
              <Switch>
                <Route path="/portfolio" component={Portfolio} />
                <Route path={`/error`} component={error} />
                <Redirect to="/error" />
              </Switch>
            </header>
            <Footer />
          </div>
        </Router>
      );
  }
}

const s2p = state => {
  return {
    needsInit: !state.init.initComplete && !state.init.initStarted
  }
}

const d2p = dispatch => {
  return {
    callInit: () => dispatch(initOps.start())
  }
}

export default connect(s2p, d2p)(AppStart);
