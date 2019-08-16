import React from 'react';
// import PropTypes from 'prop-types';
import styles from './FeatureCard.module.scss';
import { Card, CardTitle, CardBody } from 'reactstrap';
import { MdLock } from 'react-icons/md';
import cx from 'classnames';

class FeatureCard extends React.Component {

  static defaultProps = {
  };

  static propTypes = {};

  render() {
    const {onClick, locked} = this.props;

    const cardClasses = [styles.root, 'shadow-sm'];
    if (locked) {
      cardClasses.push(styles.locked);
    } else {
      cardClasses.push(styles.card);
    }

    const body = locked ?
      this._renderLock() :
      this._renderBody();

    return (
      <Card className={cx(cardClasses)} top width="100%" onClick={onClick} >
        <CardBody>
          {body}
        </CardBody>
      </Card>
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
          <MdLock color="#d9d9d9ff" size="6em" className="mt-4"/>
        </React.Fragment>
      )
    }

};

export default FeatureCard;




