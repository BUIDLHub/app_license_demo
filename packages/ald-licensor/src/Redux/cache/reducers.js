import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const INIT = {
  loading: false,
  initComplete: false,
  initStarted: false,
  storage: null,
  accounts: [],
  error: null
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    initStarted: true,
    initComplete: false,
    error: null
  }
}

const success = (state=INIT, action) => {
  return {
    ...state,
    storage: action.cache,
    initComplete: true,
    loading: false
  }
}

const changed = (state=INIT, action) => {
  return {
    ...state,
    storage: action.cache 
  }
}

const fail = (state=INIT, action) => {
  return {
    ...state,
    loading: false,
    initComplete: true,
    error: action.error
  }
}

const HANDLERS = {
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.FAILURE]: fail,
  [Types.CACHE_CHANGED]: changed
}

export default createReducer(INIT, HANDLERS);
