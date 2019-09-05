import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import MainRoute from "Routes/main";
// import error from "Routes/error";                <<< define error
// import { default as initOps } from "Redux/init/operations";

const DEF_START = "/main";

class AppStart extends Component {
  //     componentDidMount() {
  //     if(this.props.needsInit) {
  //       this.props.callInit();                     <<<< check for this
  //     }
  //   }

  render() {
    const { location, match } = this.props;
    if (location.pathname === "/") {
      return <Redirect to={DEF_START} />;
    }

    return (
      <Fragment>
        <Switch>
          <Route path={`${match.url}main`} component={MainRoute} />
          <Route path={`/error`} component={error} />
          <Redirect to="/error" />
        </Switch>
      </Fragment>
    );
  }
}

const s2p = state => {
  //   return {
  //     needsInit: !state.init.initComplete && !state.init.initStarted           <<<< check for this
  //   }
};

const d2p = dispatch => {
  //   return {
  //     callInit: () => dispatch(initOps.start())
  //   }
};

export default connect(
  s2p,
  d2p
)(AppStart);
