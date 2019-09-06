import React from 'react';
import Wizard from 'Components/Wizard';
import Product from './ProductPage';
import Confirm from '../Common/ConfirmPage';
import Loading from '../Common/LoadingPage';
import {connect} from 'react-redux';
import {default as wizOps} from 'Redux/wizard/operations';
import {default as mwOps} from 'Redux/middleware/operations';
import {default as prodOps} from 'Redux/products/operations';

import { toast } from 'react-toastify';

const ID = "product";

class ProductWizard extends React.Component {
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
        let name = this.props.data.productName;
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
            this.props.registerProduct(this.props.data.productName).then(()=>{
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
                <Product handleChange={this.handleChange} values={data} error={this.state.error} />
                <Confirm />
                <Loading header="Please Wait" message="Waiting for product registration to complete"/>
               
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


        registerProduct: async name => {
            let prod = await dispatch(mwOps.send({fName: "registerProduct", args: [name]}));
            if(prod && prod.length > 0) {
                dispatch(prodOps.addProduct(prod[0]));
            }
        },

        hideWizard: () => [
            dispatch(wizOps.hide())
        ]
    }
}
export default connect(s2p, d2p)(ProductWizard);