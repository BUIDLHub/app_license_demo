import React, { Component } from "react";
import cn from "classnames";
import styles from "./Common.module.scss";
import Loading from 'Components/Loading';

import {
  Row,
  Col
} from 'reactstrap';

export class LoadingPage extends Component {
  
  render() {
    const { header, message } = this.props;
    return (
      <Row className={cn(styles.page_h, styles.nopad, styles.nomargin, "w-100")}>
        <Col md="12" className={cn(styles.nopad, styles.nomargin)}>
          <Loading header={header} message={message}/>
        </Col>
        </Row>
          
    );
  }
}

export default LoadingPage;
