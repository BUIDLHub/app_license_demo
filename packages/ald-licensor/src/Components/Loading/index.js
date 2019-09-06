import React from "react";
import ReactLoading from "react-loading";
import cn from "classnames";
import styles from "./Loading.module.scss";
// uses https://www.npmjs.com/package/react-loading

const Loader = ({ header, message, type, color }) => (
  <div className={cn(styles.nomargin, styles.nopad)}>
    <p className={cn([styles.loader_h])}>{header}</p>
    <p className={cn([styles.loader_p])}>
      {message}
    </p>
    <div className={cn(styles.loader, styles.nomargin, styles.nopad)}>
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
