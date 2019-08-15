import React, { Component } from "react";
import classNames from "classnames";
import styles from "./ProgressBar.module.scss";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1
    };
  }

  // Need to define the state of the active step
  // Need to have each onclick event update the state accordingly
  handleToggle(e) {
    e.preventDefault();
    // this.setState(
    //   activeStep: this.activeStep,
    // )
  }

  render() {
    const { activeStep } = this.state;

    return (
      // Have a component take the active props
      <div className={classNames(["my-4"])}>
        <Pagination size="lg" aria-label="Page navigation example">
          <PaginationItem className={classNames([styles.step_item])}>
            <PaginationLink onClick={e => this.handleToggle(e)}>
              1
            </PaginationLink>
            <p className={classNames([styles.step_name])}>Vendor</p>
          </PaginationItem>
          <PaginationItem className={classNames([styles.step_item])}>
            <PaginationLink onClick={e => this.handleToggle(e)}>
              2
            </PaginationLink>
            <p className={classNames([styles.step_name])}>Product</p>
          </PaginationItem>
          <PaginationItem className={classNames([styles.step_item])}>
            <PaginationLink onClick={e => this.handleToggle(e)}>
              3
            </PaginationLink>
            <p className={classNames([styles.step_name])}>License</p>
          </PaginationItem>
          <PaginationItem className={classNames([styles.step_item])}>
            <PaginationLink onClick={e => this.handleToggle(e)}>
              4
            </PaginationLink>
            <p className={classNames([styles.step_name])}>Confirm</p>
          </PaginationItem>
          <PaginationItem className={classNames([styles.step_item])}>
            <PaginationLink onClick={e => this.handleToggle(e)}>
              5
            </PaginationLink>
            <p className={classNames([styles.step_name])}>Get Code</p>
          </PaginationItem>
        </Pagination>
      </div>
    );
  }
}

export default ProgressBar;

// licenseName, licenseDuration, licensePrice;

// <ul>
//   <li>
//     <p>1</p>
//   <p>Vendor Name</p>
//   </li>
//   <li>
//     <p>2</p>
//   <p>Product Name</p>
//   </li>
//   <li>
//     <p>3</p>
//   <p>License Details</p>
//   </li>
//   <li>
//     <p>4</p>
//   <p>Confirm</p>
//   </li>
//   <li>
//     <p>5</p>
//   <p>Get Code</p>
//   </li>
// </ul>
