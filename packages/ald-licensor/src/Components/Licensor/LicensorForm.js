import React, { Component } from "react";
import RegisterVendor from "./RegisterVendor";
import CreateProduct from "./CreateProduct";
import CreateProductLicense from "./CreateProductLicense";
import Confirm from "./Confirm";
import Success from "./Success";
import ProgressBar from "./ProgressBar";

export class LicensorForm extends Component {
  state = {
    step: 1,
    vendorName: "",
    productName: "",
    licenseName: "",
    licenseDuration: "",
    licensePrice: ""
  };

  //   Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };
  // Go back to previous step
  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  //   Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  render() {
    const { step } = this.state;
    const {
      vendorName,
      productName,
      licenseName,
      licenseDuration,
      licensePrice
    } = this.state;
    const values = {
      vendorName,
      productName,
      licenseName,
      licenseDuration,
      licensePrice
    };
    switch (step) {
      case 1:
        return (
          <RegisterVendor
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <CreateProduct
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 3:
        return (
          <CreateProductLicense
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 4:
        return (
          <Confirm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 5:
        return <Success nextStep={this.nextStep} />;
    }
  }
}

export default LicensorForm;
