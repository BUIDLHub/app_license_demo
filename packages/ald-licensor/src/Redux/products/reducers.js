import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const INIT = {
  loading: false,
  products: [],
  error: null
}

const start = (state=INIT) => {
    
    return {
        ...state,
        loading: true,
        error: null
    }
}

const success = (state=INIT, action) => {
    return {
        ...state,
        loading: false,
        products: action.products
    }
}

const add = (state=INIT, action) => {
    return {
        ...state,
        products: [
            ...state.products,
            action.product
        ]
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
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.ADD_PRODUCT]: add,
  [Types.FAILURE]: fail
}

export default createReducer(INIT, HANDLERS);
