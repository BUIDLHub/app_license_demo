import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const INIT = {
  loading: false,
  initComplete: false,
  initStarted: false,
  middleware: null,
  vendorProducts: [],
  error: null
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    initStarted: true,
    initComplete: false,
    isVendor: false,
    error: null
  }
}

const success = (state=INIT, action) => {
  return {
    ...state,
    initComplete: true,
    middleware: action.middleware,
    isVendor: action.isVendor,
    loading: false
  }
}

const updateProducts = (state=INIT, action) => {
  return {
    ...state, 
    vendorProducts: action.products
  }
}

const changed = (state=INIT, action) => {
  return {
    ...state,
    middleware: action.middleware
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
  [Types.MIDDLEWARE_CHANGED]: changed,
  [Types.UPDATE_PRODUCTS]: updateProducts
}

export default createReducer(INIT, HANDLERS);
