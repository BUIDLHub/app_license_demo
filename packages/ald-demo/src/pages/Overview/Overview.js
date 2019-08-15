import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './Overview.module.css';
import { Container, Row, Col, CardDeck } from 'reactstrap';
import { FeatureCard, PurchaseModal, TopMenu } from '../../components';
import {Example1, Example2, Example3, Example4 } from '../../components/FeatureCard/Examples';

class Overview extends React.Component {
  static defaultProps = {

  };
  
  static propTypes = {
  
  };
  

  render() {
    return (
      <React.Fragment>
        <Container fluid={true}>
          <TopMenu />
        </Container>

        <Container className={cx(styles.root, 'mt-4')}>

          <Row>
            <Col sm="12">
              <CardDeck>
            
                <FeatureCard title="Feature 1">
                  <Example1 />
                </FeatureCard>
              
                <FeatureCard title="Feature 2">
                  <Example2 />
                </FeatureCard>
              
                <FeatureCard title="Feature 3" locked="true">
                  <Example3 />
                </FeatureCard>
              
              </CardDeck>
            </Col>
            
          </Row>
          <Row>
            <Col sm="12" className="mt-4">
            <FeatureCard title="Feature 4">
                <Example4 />
              </FeatureCard>
            </Col>
          </Row>
        
        </Container>
      </React.Fragment>
    );
  }
};


export default Overview;
