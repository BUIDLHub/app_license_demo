import React, { Component } from "react";
import classNames from "classnames";
import styles from "./NewVendor.module.scss";
import FormCard from "./Card";
import { Input } from "reactstrap";

export class CreateProductLicense extends Component {
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
        header="Create a Product License"
        subheader="Enter the details for restricted access to a product"
      >
        <div className={classNames(["form-group"], ["my-0"])}>
          <label className={classNames([styles.form_name])}>
            License Name{" "}
            <div>
              <input
                className={classNames([styles.form_label])}
                placeholder="Locked Feature Name"
                type="text"
                name="licenseName"
                required
                autoComplete="off"
                onChange={handleChange("licenseName")}
                defaultValue={values.licenseName}
              />
            </div>
          </label>
        </div>
        <div className={classNames(["form-group"], ["my-0"])}>
          <label className={classNames([styles.form_name])}>
            License Duration{" "}
            <div>
              <Input
                type="select"
                name="licenseDuration"
                id="licenseDuration"
                multiple
                required
                onChange={handleChange("licenseDuration")}
                defaultValue={values.licenseDuration}
              >
                <option>24 Hours</option>
                <option>72 Hours</option>
                <option>1 Week</option>
                <option>1 Month</option>
                <option>6 Months</option>
              </Input>
            </div>
          </label>
        </div>
        <div className={classNames(["form-group"], ["my-0"])}>
          <label className={classNames([styles.form_name])}>
            License Price{" "}
            <div>
              <Input
                type="select"
                name="licensePrice"
                id="licensePrice"
                multiple
                required
                onChange={handleChange("licensePrice")}
                defaultValue={values.licensePrice}
              >
                <option>1 Ξ</option>
                <option>2 Ξ</option>
                <option>3 Ξ</option>
                <option>4 Ξ</option>
                <option>5 Ξ</option>
              </Input>
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

export default CreateProductLicense;

// licenseName, licenseDuration, licensePrice;
