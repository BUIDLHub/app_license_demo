import {Creators} from './actions';
import {default as mwOps} from 'Redux/middleware/operations';

const save = (data) => async (dispatch, getState) => {
   dispatch(Creators.saveData(data));
}

const next = () => (dispatch) => {
    dispatch(Creators.nextStep())
}

const prev = () => (dispatch) => {
    dispatch(Creators.prevStep())
}

const submit = () => async (dispatch, getState) => {
  let data = {
    ...getState().licenseForm.data
  };
  let r = await dispatch(mwOps.send({
    fName: "registerVendor", 
    args: [data.vendorName]
  }));
  console.log("results of submit", r);
}

export default {
  save,
  next,
  prev,
  submit
}
