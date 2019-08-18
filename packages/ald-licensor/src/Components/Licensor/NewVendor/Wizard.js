import React, { Component } from "react";
import RegisterVendor from "./RegisterVendor";
import CreateProduct from "./CreateProduct";
import CreateProductLicense from "./CreateProductLicense";
import Confirm from "./Confirm";
import Success from "./Success";
import ProgressBar from "../ProgressBar";

export default class Wizard extends Component {
    /*
  state = {
    step: 1,
    vendorName: "",
    productName: "",
    licenseName: "",
    licenseDuration: "",
    licensePrice: ""
  };
  */

  //   Proceed to next step
  nextStep = () => {
      this.props.nextStep();
    //const { step } = this.state;
    //this.setState({ step: step + 1 });
  };
  // Go back to previous step
  prevStep = () => {
      this.props.prevStep();
    //const { step } = this.state;
    //this.setState({ step: step - 1 });
  };

  //   Handle fields change
  handleChange = input => e => {
    //this.setState({ [input]: e.target.value });
    let newData = {
        ...this.props.formData,
        [input]: e.target.value
    };
    this.props.saveData(newData);
  };

  render() {
    const { step } = this.props; //this.state;
    const {
      vendorName,
      productName,
      licenseName,
      licenseDuration,
      licensePrice
    } = this.props.formData; //= this.state;
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
            submit={this.props.submit}
            values={values}
          />
        );
      case 5:
        return <Success nextStep={this.nextStep} />;
    }
  }
}
