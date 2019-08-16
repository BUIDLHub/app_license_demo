import React from 'react';
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  } from 'reactstrap';
import styles from './TopMenu.module.scss';
import {MdFlare} from 'react-icons/md';
// import PropTypes from 'prop-types';
import cx from 'classnames';

class TopMenu extends React.Component {

  static defaultProps = {};

  static propTypes = {};

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
      <div className={styles.root}> 
      <Navbar color="light" light expand="md">
          <NavbarBrand href="/" className={styles.appName}>
          <span className={styles.logo}>
            <MdFlare />
          </span>
          &nbsp;
          <span className={styles.primary}>Some</span>
          <span className={styles.secondary}>App</span>
          </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem className={cx('pr-4')}>
              <NavLink href="/components/">How it works</NavLink>
            </NavItem>
            <NavItem>
              <Button color="primary">Get Started</Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    );
  }
};

export default TopMenu;
