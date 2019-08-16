import React, { Component } from "react";
import classNames from "classnames";
import LicensorForm from "./LicensorForm";
import ProgressBar from "./ProgressBar";
import styles from "./LicensorForm.module.scss";
import {connect} from 'react-redux'
import {default as ops} from 'Redux/init/operations';


class Licensor extends React.Component {
  componentDidMount() {
    if(this.props.needsInit) {
      this.props.runInit();
    }
  }

  render() {
    if(this.props.initializing) {
      return (
        <div>Please wait or something fancy here...</div>
      )
    }

    return (
      <div>
        <p className={classNames([styles.page_h])}>Get Started</p>
        <ProgressBar />
        <LicensorForm />
      </div>
    )
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
    runInit: () => {
      dispatch(ops.start())
    }
  }
}

export default connect(s2p, d2p)(Licensor);

/*
const Licensor = () => {
  return (
    <div>
      <p className={classNames([styles.page_h])}>Get Started</p>
      <ProgressBar />
      <LicensorForm />
    </div>
  );
};

export default Licensor;
*/


