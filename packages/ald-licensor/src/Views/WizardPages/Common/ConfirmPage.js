import React, { Component } from "react";
import cn from "classnames";
import styles from "./Common.module.scss";
import {
  Row,
  Col
} from 'reactstrap';

export class ConfirmPage extends Component {
  
  render() {
    const { values, handleChange, error } = this.props;
    return (
      <Row className={cn(styles.page_h, styles.nopad, styles.nomargin, "w-100")}>
        <Col md="12" className={cn(styles.nopad, styles.nomargin)}>
          This is confirmation page...
          </Col>
        </Row>
          
    );
  }
}

export default ConfirmPage;
