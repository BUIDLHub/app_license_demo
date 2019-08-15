import React, { Component } from "react";
import classNames from "classnames";
import LicensorForm from "./LicensorForm";
import ProgressBar from "./ProgressBar";
import styles from "./LicensorForm.module.scss";

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
