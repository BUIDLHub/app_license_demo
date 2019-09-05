import React, { Component } from "react";
import classNames from "classnames";
import styles from "./Add.module.scss";
import FormCard from "../NewVendor/Card";

export class CreateProduct extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <FormCard
        header="Create a Product"
        subheader="Product name that contains your product licenses"
      >
        <div className={classNames(["form-group"], ["my-0"])}>
          <label className={classNames([styles.form_name])}>
            Product Name{" "}
            <div>
              <input
                className={classNames([styles.form_label])}
                placeholder="Sample Product Name"
                type="text"
                name="name"
                required
                autoComplete="off"
                onChange={handleChange("productName")}
                defaultValue={values.productName}
              />
            </div>
          </label>
        </div>
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
