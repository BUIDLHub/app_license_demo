import ContentLoader from "react-content-loader"
import React from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText, CardGroup,
    CardSubtitle, CardBody, CardColumns
} from 'reactstrap';

const Example1 = () => (
    <ContentLoader
        height={160}
        width={400}
        animate={false}
        primaryColor="#de6f39"
        secondaryColor="#f07940"
    >
        <rect x="8" y="60" rx="3" ry="3" width="350" height="24" />
        <rect x="8" y="100" rx="3" ry="3" width="380" height="22" />
        <rect x="9" y="19" rx="3" ry="3" width="201" height="23" />
    </ContentLoader>
);

const Example2 = () => (
    <ContentLoader
        height={160}
        width={400}
        animate={false}
        primaryColor="#de6f39"
        secondaryColor="#f07940"
    >
        <rect x="9" y="100" rx="3" ry="3" width="22" height="46" />
        <rect x="48" y="83" rx="3" ry="3" width="22" height="63" />
        <rect x="89" y="60" rx="3" ry="3" width="22" height="85" />
        <rect x="129" y="97" rx="3" ry="3" width="22" height="50" />
        <rect x="169" y="84" rx="3" ry="3" width="22" height="62" />
    </ContentLoader>
);


const Example3 = () => (
    'FIXME: SHOW UNLOCKED CONTENT'
);

const Example4 = () => (
    <div>
        <CardColumns>
            <Card>
                <CardBody>
                    <Example4Inner />
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Example4Inner />
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Example4Inner />
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <Example4Inner />

                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Example4Inner />

                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Example4Inner />

                </CardBody>
            </Card>
        </CardColumns>
    </div>
)



const Example4Inner = () => (
    <ContentLoader
        height={280}
        width={500}
        animate={false}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
    >
        <rect x="3" y="3" rx="10" ry="10" width="300" height="180" />
        <rect x="6" y="190" rx="0" ry="0" width="292" height="20" />
        <rect x="4" y="215" rx="0" ry="0" width="239" height="20" />
        <rect x="4" y="242" rx="0" ry="0" width="274" height="20" />
    </ContentLoader>
)

export { Example1, Example2, Example3, Example4 };