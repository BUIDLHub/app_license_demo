import {Creators} from './actions';

const save = (data) => async (dispatch, getState) => {
   dispatch(Creators.saveData(data));
}

const next = () => (dispatch) => {
    dispatch(Creators.nextStep())
}

const prev = () => (dispatch) => {
    dispatch(Creators.prevStep())
}

export default {
  save,
  next,
  prev
}
