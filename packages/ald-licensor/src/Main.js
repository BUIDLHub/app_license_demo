import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navigation from "./Components/Navbar";
import Licensor from "./Components/Licensor/index.js";
import Footer from "./Components/Footer";
import Marketplace from "./Components/Marketplace";
import Products from "./Components/Portfolio/Products";
import {Provider} from 'react-redux';
import configureStore from 'Store/configureStore';
import {default as initOps} from 'Redux/init/operations';
import {connect} from 'react-redux';

class Main extends React.Component {
  componentDidMount() {
    if(this.props.needsInit) {
      this.props.startInit();
    }
  }

  render() {
    return (
      <Router>
          <div className="App">
            <Navigation />
            <header className="page">
              {/* <Licensor /> */}
              <Switch>
                <Route path="/" exact component={Licensor} />
                <Route path="/marketplace" component={Marketplace} />
                <Route path="/products" component={Products} />
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
    needsInit: !state.init.initComplete && !state.init.initStarted,
    initializing: state.init.loading,
    isVendor: state.middleware.isVendor
  }
}

const d2p = dispatch => {
  return {
    startInit: () => {
      dispatch(initOps.start())
    }
  }
}

export default connect(s2p, d2p)(Main);

