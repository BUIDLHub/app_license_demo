import React from 'react';
import {
    Row,
    Col,
    Button,
    Modal,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import StepWizard from 'react-step-wizard';
import styles from './Wizard.module.scss';
import cn from 'classnames';

export default class Wizard extends React.Component {

    constructor(props) {
        super(props);
        [
            'stepChanged',
            'setInstance'
        ].forEach(fn=>this[fn]=this[fn].bind(this));

        this.state = {
            transitions: {
                enterRight: `${styles.animated} ${styles.enterRight}`,
                enterLeft: `${styles.animated} ${styles.enterLeft}`,
                exitRight: `${styles.animated} ${styles.exitRight}`,
                exitLeft: `${styles.animated} ${styles.exitLeft}`,
                intro: `${styles.animated} ${styles.intro}`,
            }
        };
    }

    setInstance = SW => this.setState({SW});

    stepChanged(s) {
        
        console.log("Step changed", s);
    }

    handleChange = input => e => {
        let newData = {
            ...this.props.formData,
            [input]: e.target.value
        };
        this.props.saveData(newData);
    }
        
    render() {
        const {
            showing
        } = this.props;
        if(!showing) {
            return null;
        }
       
        return (
            <Modal isOpen={showing} className={cn(styles.wizardModal)}>
                <ModalBody className={cn(styles.wizardBody)}>
                    <div className={cn("container", "w-100", styles.nomargin, styles.nopad)}>
                        <WizardBody transitions={this.state.transitions} 
                                    setInstance={this.setInstance}
                                    stepChanged={this.stepChanged}
                                    {...this.props}>
                            {
                                this.props.children
                            }
                        </WizardBody>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className={cn("container", "w-100")}>
                        <WizardButtons nextStep={()=>this.state.SW.checkThenNext()}
                                       previousStep={()=>this.state.SW.previousStep()} />
                    </div>
                </ModalFooter>
            </Modal>
        )

    }
}

class WizardBody extends React.Component {
    render() {
        const {
            transitions,
            setInstance,
            stepChanged 
        } = this.props;

        return (
            <Row className={cn("d-flex", "w-100", "justify-content-center", "align-items-center", styles.nomargin, styles.nopad)}>
                <Col md="10" className={cn("d-flex", "justify-content-center", "align-items-center", styles.nomargin, styles.nopad)}>
                    <CustomWizard className={cn("w-100", styles.nomargin, styles.nopad)} onStepChange={stepChanged}
                                transitions={transitions}
                                instance={setInstance} {...this.props}>
                        {
                            this.props.children
                        }
                    </CustomWizard>
                </Col>
            </Row>
        )
    }
}

class WizardButtons extends React.Component {
    render() {
        const {
            nextStep,
            previousStep
        } = this.props;

        return (
            <Row className={cn("d-flex", "w-100", "justify-content-center", "align-items-center", styles.nomargin, styles.nopad)}>
                <Col md="12" className={cn("mt-3", "mb-3")}>
                    <div className={cn("w-100","d-flex", "justify-content-end", "align-items-end", styles.nomargin, styles.nopad)}>
                        <Button size="sm" className={cn("mr-1")} onClick={()=>previousStep()}>Prev</Button>
                        <Button size="sm" onClick={()=>nextStep()}>Next</Button>
                    </div>
                </Col>
            </Row>
        )
    }
}

class CustomWizard extends StepWizard {
    
    checkThenNext = async () => {
        
        if(typeof this.props.validate === 'function') {
            let e = this.props.validate();
            if(e) {
                console.log("Problem with data", e);
            } else {
                if(typeof this.props.beforeNext === 'function') {
                    await this.props.beforeNext({
                        activeStep: this.state.activeStep+1,
                        nextStep: this.nextStep
                    });
                } else {
                    this.nextStep();
                }
            }
        } else {
            this.nextStep();
        }
    }

    previousStep() {
        super.previousStep();
    }
}