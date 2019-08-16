import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const MAX_STEPS = 5;

const INIT = {
  loading: false,
  data: {},
  stepNumber: 1,
  error: null
}

const save = (state=INIT, action) => {
    return {
        ...state,
        data: action.data
    }
}

const next = (state=INIT) => {
    let n = state.stepNumber+1;
    if(n > MAX_STEPS) {
        n = MAX_STEPS;
    }
    return {
        ...state,
        stepNumber: n
    }
}

const prev = (state=INIT) => {
    let n = state.stepNumber-1;
    if(n < 1) {
        n = 1;
    }
    return {
        ...state,
        stepNumber: n
    }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const HANDLERS = {
  [Types.SAVE_DATA]: save,
  [Types.NEXT_STEP]: next,
  [Types.PREV_STEP]: prev,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
