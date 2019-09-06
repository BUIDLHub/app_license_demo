import React from 'react';
import Wizard from 'Components/Wizard';
import Vendor from './VendorPage';
import Confirm from '../Common/ConfirmPage';
import Loading from '../Common/LoadingPage';
import {connect} from 'react-redux';
import {default as wizOps} from 'Redux/wizard/operations';
import {default as mwOps} from 'Redux/middleware/operations';
import { toast } from 'react-toastify';

const ID = "vendor";

class VendorWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
    }

    handleChange = id => e => {
        e.preventDefault();
        let v = e.target.value;
        this.setState({
            error: null
        }, ()=>{
            let newData = {
                ...this.props.data,
                [id]: v
            }
            this.props.save(newData);
        });
    }

    validate = () => {
        let name = this.props.data.vendorName;
        let err = null;
        if(!name || name.trim().length === 0) {
            err = "Name is required";
        }

        this.setState({
            error: err
        });
        return err;
    }

    beforeNext =  (s) => {
        return new Promise((done, err)=>{
            
            if(s.activeStep !== 2) {
                s.nextStep();
                return done();
            }

            //go to loading page
            s.nextStep();

            //call middleware to register vendor
            this.props.registerVendor(this.props.data.vendorName).then(()=>{
                this.props.hideWizard();
                done();
            }).catch(e=>{
                toast("Problem with registration: " + e.message, {
                    autoClose: 5000,
                    type: toast.TYPE.ERROR,
                    closeButton: false,
                    newestOnTop: true
                  });
                //NOTE: could send an error back to wizard or something fance here
                this.props.hideWizard();
                done(e);
            });
           
        });
    }

    render() {
        const {
            showing,
            data
        } = this.props;

        return (
            <Wizard showing={showing} validate={this.validate} beforeNext={this.beforeNext}>
                <Vendor handleChange={this.handleChange} values={data} error={this.state.error} />
                <Confirm />
                <Loading header="Please Wait" message="Waiting for registration to complete"/>
               
            </Wizard>
        )
    }
}

const s2p = state => {
    let w = state.wizard;
    let showing = w.showing === ID;
    return {
        showing,
        data: w.data
    }
}

const d2p = dispatch => {
    return {
        save: data => {
            dispatch(wizOps.save(data));
        },

        registerVendor: name => {
            return dispatch(mwOps.send({fName: "registerVendor", args: [name]}));
        },

        hideWizard: () => {
            dispatch(wizOps.hide())
        }
    }
}
export default connect(s2p, d2p)(VendorWizard);