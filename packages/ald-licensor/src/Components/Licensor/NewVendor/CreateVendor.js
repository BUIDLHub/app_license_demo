import React, { Component } from "react";
import classNames from "classnames";
import styles from "./NewVendor.module.scss";
import FormCard from "./Card";

export class CreateVendor extends Component {
  continue = e => {
    console.log("Ayo I was clicked man");
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <div>
        <FormCard
          header="Register as a Vendor"
          subheader="Enter a name to be publicly visible for all your products."
        >
          <div className={classNames(["form-group"], ["my-0"])}>
            <label className={classNames([styles.form_name])}>
              Vendor Name{" "}
              <div>
                <input
                  className={classNames([styles.form_label])}
                  placeholder="Sample Vendor Name"
                  type="text"
                  name="name"
                  required
                  autoComplete="off"
                  onChange={handleChange("vendorName")}
                  defaultValue={values.vendorName}
                />
              </div>
            </label>
          </div>
          <div className={classNames(["mt-2"], ["form-group"], ["my-0"])}>
            {/* <button
                  className={classNames([styles.button_blue])}
                  type="prev"
                >
                  Previous
                </button> */}
            <button
              className={classNames([styles.button_blue])}
              //   type="next"
              onClick={this.continue}
            >
              Continue
            </button>
          </div>
        </FormCard>
      </div>
    );
  }
}

export default CreateVendor;
