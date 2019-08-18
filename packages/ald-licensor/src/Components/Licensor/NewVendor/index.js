import {connect} from 'react-redux';
import {default as formOps} from 'Redux/licenseForm/operations';
import Wizard from './Wizard';

const s2p = state => {
    let data = state.licenseForm.data;
    return {
        formData: data,
        step: state.licenseForm.stepNumber
    }
}

const d2p = dispatch => {
    return {
        saveData: data => {
            dispatch(formOps.save(data));
        },
        nextStep: () => {
            dispatch(formOps.next());
        },
        prevStep: () => {
            dispatch(formOps.prev());
        },
        submit: () => {
            dispatch(formOps.submit());
        }
    }
}

export default connect(s2p, d2p)(Wizard);