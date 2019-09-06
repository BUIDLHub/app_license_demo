import React from "react";
//import ReactLoading from "react-loading";
import classNames from "classnames";
import styles from "./Failure.module.scss";

const Failure = () => (
  <div>
    <p className={classNames([styles.loader_h])}>Ruh Roh Shaggy</p>
    <p className={classNames([styles.loader_p])}>There's been an error!</p>
  </div>
);

export default Failure;
