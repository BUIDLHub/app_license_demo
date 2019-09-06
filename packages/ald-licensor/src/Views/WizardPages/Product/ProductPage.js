import React, { Component } from "react";
import cn from "classnames";
import styles from "./Product.module.scss";
import {
  Row,
  Col
} from 'reactstrap';

export class ProductPage extends Component {
  
  render() {
    const { values, handleChange, error } = this.props;
    return (
      <Row className={cn(styles.page_h, styles.nopad, styles.nomargin, "w-100")}>
        <Col md="12" className={cn(styles.nopad, styles.nomargin)}>
          <p className={cn(styles.card_h)}>
            Register as a Product
          </p>
          <p className={cn(styles.card_subh, "mb-5")}>
            Register a new product
          </p>
          
            <div className={cn(["form-group"], ["my-0"])}>
              <label className={cn([styles.form_name])}>
                Product Name{" "}
                <div>
                  <input
                    className={cn([styles.form_label])}
                    placeholder="Sample Product Name"
                    type="text"
                    name="name"
                    required
                    autoComplete="off"
                    onChange={e=>{
                      console.log("VPage props", this.props);
                      handleChange("productName")(e);
                    }}
                    defaultValue={values.productName}
                  />
                </div>
                {
                  error &&
                  <div className={cn("w-100", styles.errorBox)}>
                    {error}
                  </div>
                }
              </label>
            </div>

          </Col>
        </Row>
          
    );
  }
}

export default ProductPage;
