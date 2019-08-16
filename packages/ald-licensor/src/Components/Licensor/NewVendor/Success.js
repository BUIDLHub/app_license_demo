import React, { Component } from "react";
import classNames from "classnames";
import styles from "./LicensorForm.module.scss";
import FormCard from "./LicensorFormCard.js";

export class CreateProduct extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    return (
      <FormCard
        header="Use this code"
        subheader="In App.js (interacting with frontend)"
      >
        <div className={classNames([styles.success_area])}>
          <code className={classNames([styles.success_code])}>
            code technically goes here
          </code>
        </div>

        <div className={classNames(["mt-2"], ["form-group"], ["my-0"])}>
          <button
            className={classNames([styles.button_blue])}
            //   type="next"
            onClick={this.continue}
          >
            Continue
          </button>
        </div>
      </FormCard>
    );
  }
}

export default CreateProduct;
