import React, { Component } from "react";
import classNames from "classnames";
// import logo from "../../Images/ALD-logo-blueish.svg";
import styles from "./Card.module.scss";

const LicensorFormCard = props => {
  return (
    <div className={classNames(["card"], ["shadow"], ["my-2"])}>
      <div className={classNames([styles.card_body])}>
        <div className={classNames([styles.card_div])}>
          <p className={classNames([styles.card_h])}>{props.header}</p>
          <p className={classNames([styles.card_subh], ["mt-1"])}>
            {props.subheader}
          </p>
          <hr />
          <div className={classNames([styles.center])}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default LicensorFormCard;
