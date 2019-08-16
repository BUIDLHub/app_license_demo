import React, { Component } from "react";
import classNames from "classnames";
import LicensorForm from './NewVendor'; //from "./LicensorForm";
import ProgressBar from "./ProgressBar";
import styles from "./LicensorForm.module.scss";
import {connect} from 'react-redux'
import Portfolio from 'Components/Portfolio/Products';

class Licensor extends React.Component {
  
  render() {
    if(this.props.initializing) {
      return (
        <div className={classNames([styles.page_h])}>Please wait or something fancy here...</div>
      )
    }

    //I don't like the hack below for embed portfolio into this page. To avoid, we would need
    //to redirect somewhere else during initialization. Could do a 'window.location="/products" 
    //in a componentDidMount function; but then the screen flashes at startup and it's weird.

    return (
      <div>
        
        {
          !this.props.isVendor &&
          <React.Fragment>
            <p className={classNames([styles.page_h])}>Get Started</p>
            <ProgressBar />
            <LicensorForm />
          </React.Fragment>
        }
        {
          this.props.isVendor &&
          <Portfolio />
        }
        
      </div>
    )
  }
}

const s2p = state => {

  return {
    initializing: state.init.loading,
    isVendor: state.middleware.isVendor
  }
}

const d2p = dispatch => {
  return {
    
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


