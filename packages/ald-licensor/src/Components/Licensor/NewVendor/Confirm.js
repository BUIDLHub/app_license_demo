import React, { Component } from "react";
import classNames from "classnames";
import styles from "./LicensorForm.module.scss";
import FormCard from "./LicensorFormCard.js";

export class CreateProduct extends Component {
  continue = e => {
    e.preventDefault();
    this.props.submit();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const {
      values: {
        vendorName,
        productName,
        licenseName,
        licenseDuration,
        licensePrice
      }
    } = this.props;
    return (
      <FormCard
        header="Confirm Product and License Data"
        subheader="Associated metadata with your account for the marketplace"
      >
        <ul>
          <li>
            <p className={classNames([styles.confirm_name])}>Vendor Name:</p>
            <p className={classNames([styles.confirm_value])}>{vendorName}</p>
          </li>
          <li>
            <p className={classNames([styles.confirm_name])}>Product Name:</p>
            <p className={classNames([styles.confirm_value])}>{productName}</p>
          </li>
          <li>
            <p className={classNames([styles.confirm_name])}>License Name:</p>
            <p className={classNames([styles.confirm_value])}>{licenseName}</p>
          </li>
          <li>
            <p className={classNames([styles.confirm_name])}>
              License Duration:
            </p>
            <p className={classNames([styles.confirm_value])}>
              {licenseDuration}
            </p>
          </li>
          <li>
            <p className={classNames([styles.confirm_name])}>License Price:</p>
            <p className={classNames([styles.confirm_value])}>{licensePrice}</p>
          </li>
        </ul>
        <div className={classNames(["mt-2"], ["form-group"], ["my-0"])}>
          <button
            className={classNames([styles.button_blue])}
            //   type="prev"
            onClick={this.back}
          >
            Previous
          </button>
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
