import {Creators} from './actions';
import {default as chainOps} from 'Redux/chain/operations';
import {default as dbOps} from 'Redux/cache/operations';
import {default as middlewareOps} from 'Redux/middleware/operations';
import {default as prodOps} from 'Redux/products/operations';

const initChain = props => {
  return props.dispatch(chainOps.init())
    .then(()=>props);
}

const initStorage = props => {
  return props.dispatch(dbOps.init())
      .then(()=>props)
}

const initMiddleware = async props => {
  return props.dispatch(middlewareOps.init())
    .then(()=>props)
}

const initProducts = async props => {
  return props.dispatch(prodOps.init())
    .then(()=>props);
}

const recoverHistory = async props => {
    return props;
}

const startSubscriptions = props => {
    return props;
}

const start = () => (dispatch,getState) => {
  let state = getState();
  if(state.init.initComplete) {
    return;
  }
  return dispatch(_doStart());
}

const _doStart = () => (dispatch,getState) => {
  dispatch(Creators.initStart());
  let props = {
    dispatch,
    getState
  }
  return initChain(props)
        .then(initStorage)
        .then(initMiddleware)
        .then(initProducts)
        .then(recoverHistory)
        .then(startSubscriptions)
        .then(()=>{
          dispatch(Creators.initSuccess());
        })
        .catch(e=>{
          dispatch(Creators.failure(e));
        });
}

export default {
  start
}
