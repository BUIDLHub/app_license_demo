import React, { Component } from "react";
import classNames from "classnames";
import logo from "../../Images/ALD-logo-blueish.svg";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={classNames([styles.background])}>
      <div className={classNames([styles.subcontainer], ["py-3"])}>
        {/* <hr className={classNames([styles.hr])} /> */}
        <img className={classNames([styles.footer_logo])} src={logo} />
        <p className={classNames([styles.footer_text])}>BUIDLHub ©2019</p>
      </div>
    </div>
  );
};

export default Footer;
