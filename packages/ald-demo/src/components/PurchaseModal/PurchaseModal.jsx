import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import PropTypes from 'prop-types';
import styles from './PurchaseModal.module.scss';
// import cx from 'classnames';

class PurchaseModal extends React.Component {

  static defaultProps = {
    title: 'Purchase Content',
    description: 'Unlock new features by purchasing a NFT based software license.'
  };

  static propTypes = {};

  render() {
    const {title, description, cost } = this.props;
    return (
      <div className={styles.root}>
        <Modal isOpen={this.props.show} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            {description}
            <div className={styles.cost}>
              {cost}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Purchase</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
};

export default PurchaseModal;
