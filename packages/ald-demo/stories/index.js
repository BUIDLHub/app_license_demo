// import 'bootstrap/dist/css/bootstrap.css';
import '../src/styles/style.scss';

import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import { FeatureCard, TopMenu, PurchaseModal } from '../src/components';
import {Example1, Example2, Example3, Example4 } from '../src/components/FeatureCard/Examples';
import { Container, Row, Col } from 'reactstrap';

const GridDecorator = storyFn => (
    <Container>
        <Row>
            <Col sm="6">
                {storyFn()}
            </Col>
        </Row>
    </Container>
)

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with emoji', () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));

storiesOf('TopMenu', module)
    .add('default', () => (
        <TopMenu />
    ));

storiesOf('FeatureCard', module)
    .addDecorator(GridDecorator)
    .add('with title', () => (
        <FeatureCard title="Feature Title" />
    ))
    .add('with lock', () => (
        <FeatureCard title="Feature Title" locked={true}/>
    ))
    .add('with example 1', () => (
        <FeatureCard title="Feature 1">
            <Example1 />
        </FeatureCard>
    ))
    .add('with example 2', () => (
        <FeatureCard title="Feature 2">
            <Example2 />
        </FeatureCard>
    ))
    .add('with example 3 (locked)', () => (
        <FeatureCard title="Feature 3" locked={true}>
            <Example3 />
        </FeatureCard>
    ))
    .add('with example 3 (unlocked)', () => (
        <FeatureCard title="Feature 3">
            <Example3 />
        </FeatureCard>
    ))
    .add('with example 4', () => (
        <FeatureCard title="Feature 4">
            <Example4 />
        </FeatureCard>
    ));

    storiesOf('PurchaseModal', module)
    .add('default', () => (
        <PurchaseModal cost="1 ETH"/>
    ));