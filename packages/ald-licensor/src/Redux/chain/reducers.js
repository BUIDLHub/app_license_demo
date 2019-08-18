import {Types} from './actions';
import {createReducer} from 'reduxsauce';

const INIT = {
  loading: false,
  initComplete: false,
  initStarted: false,
  web3: null,
  accounts: [],
  networkID: 0,
  error: null
}

const start = (state=INIT) => {
  return {
    ...state,
    loading: true,
    initStarted: true,
    initComplete: false,
    pendingTxns: {},
    error: null
  }
}

const success = (state=INIT, action) => {
  return {
    ...state,
    web3: action.web3,
    accounts: action.accouts,
    networkID: action.network,
    initComplete: true,
    loading: false
  }
}

const changeNetwork = (state=INIT, action) => {
  return {
    ...state,
    networkID: action.network
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

const updatePending = (state=INIT, action) => {
  return {
    ...state,
    pendingTxns: action.pending
  }
}

const HANDLERS = {
  [Types.INIT_START]: start,
  [Types.INIT_SUCCESS]: success,
  [Types.FAILURE]: fail,
  [Types.CHANGE_NETWORK]: changeNetwork,
  [Types.UPDATE_PENDING]: updatePending
}

export default createReducer(INIT, HANDLERS);
