import React, { Component } from "react";
import CreateVendor from "../../../Components/Licensor/NewVendor/CreateVendor";
import CreateProduct from "../../../Components/Licensor/NewVendor/CreateProduct";
import CreateProductLicense from "../../../Components/Licensor/NewVendor/CreateLicense";
import Confirm from "../../../Components/Licensor/NewVendor/Confirm";
import Success from "../../../Components/Licensor/NewVendor/Success";
import ProgressBar from "../../../Components/Licensor/NewVendor/ProgressBar";

export default class Wizard extends Component {
  nextStep = () => {
    this.props.nextStep();
  };
  prevStep = () => {
    this.props.prevStep();
  };
  handleChange = input => e => {
    let newData = {
      ...this.props.formData,
      [input]: e.target.value
    };
    this.props.saveData(newData);
  };

  render() {
    const { step } = this.props;
    const {
      vendorName,
      productName,
      licenseName,
      licenseDuration,
      licensePrice
    } = this.props.formData;
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
          <CreateVendor
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
