import React, { Component } from "./node_modules/react";
import classNames from "./node_modules/classnames";
import logo from "../../Images/ALD-logo-blueish.svg";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "./node_modules/reactstrap";
import styles from "./Navbar.module.scss";
import { Link } from "./node_modules/react-router-dom";

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar dark expand="md">
          <div className={classNames(["container"])}>
            <NavbarBrand className={classNames(["my-0"], ["pt-0"])}>
              <img className={classNames([styles.nav_logo])} src={logo} />
              <p className={classNames([styles.nav_brand])}>
                <Link to="/">
                  License
                  <span className={classNames([styles.nav_brand_span])}>
                    Hub
                  </span>
                </Link>
              </p>
            </NavbarBrand>
            <NavbarToggler
              className={classNames([styles.toggler_style])}
              onClick={this.toggle}
            />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink>
                    <Link to="/marketplace">
                      <p className={classNames([styles.nav_link])}>
                        Marketplace
                      </p>
                    </Link>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classNames([styles.nav_link])}>
                    <Link to="/products">
                      <p
                        className={classNames(
                          [styles.button_slide],
                          [styles.slide_right]
                        )}
                      >
                        My Portfolio
                      </p>
                    </Link>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>
                    <Link to="/">
                      <p className={classNames([styles.nav_link])}>Profile</p>
                    </Link>
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
