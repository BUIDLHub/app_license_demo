import React from "react";
import ReactLoading from "react-loading";
import classNames from "classnames";
import styles from "./Loading.module.scss";
// uses https://www.npmjs.com/package/react-loading

const Loader = ({ type, color }) => (
  <div>
    <p className={classNames([styles.loader_h])}>Welcome!</p>
    <p className={classNames([styles.loader_p])}>
      Checking that you are signed into Metamask.
    </p>
    <div className={classNames([styles.loader])}>
      <ReactLoading
        type={"spinningBubbles"}
        color={"9527dd"}
        height={85}
        width={85}
      />
    </div>
  </div>
);

export default Loader;
