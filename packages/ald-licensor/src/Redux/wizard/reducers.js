import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const INIT = {
  loading: false,
  data: {},
  showing: null,
  error: null
}

const show = (state=INIT, action) => {
    
    return {
        ...state,
        data: {},
        showing: action.id,
        stepNumber: 1,
        error: null
    }
}

const hide = (state=INIT) => {
    return {
        ...state,
        showing: null,
        stepNumber: 1,
        error: null,
        data: {}
    }
}

const save = (state=INIT, action) => {
    return {
        ...state,
        data: action.data
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
  [Types.SHOW]: show,
  [Types.HIDE]: hide,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
