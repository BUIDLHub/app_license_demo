import React from 'react';
import PropTypes from 'prop-types';
import styles from './FeatureCard.module.scss';
import { Card, CardTitle, CardText, CardBody } from 'reactstrap';
import { MdLock } from 'react-icons/md';

class FeatureCard extends React.Component {

  static defaultProps = {
  };

  static propTypes = {};

  render() {

    const {locked} = this.props;

    const body = locked ?
      this._renderLock() :
      this._renderBody();

    return (
      <div className={styles.root}>
        <Card className={locked ? styles.locked : styles.card}>
          <CardBody>
            {body}
          </CardBody>
        </Card>
      </div>
    );
    }
    _renderBody = () => {
      const {title, children} = this.props;

      return (
        <React.Fragment>

        <CardTitle>
          <h5>{title}</h5>
          {children}
        </CardTitle>
        <div>
        </div>

        </React.Fragment>
      );
    }

    _renderLock = () => {
      return (
        <React.Fragment>
          <MdLock color="#d9d9d9ff" size="6em" />
        </React.Fragment>
      )
    }

};

export default FeatureCard;




