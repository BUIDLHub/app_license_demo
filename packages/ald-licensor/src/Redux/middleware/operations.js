import {Creators} from './actions';
import {registerDeps} from 'Redux/DepMiddleware';
import {Types as cacheTypes} from 'Redux/cache/actions';
import Storage from 'buidl-storage';
import * as ChainInfo from 'Constants/chain';
import API from 'Mock/MockMiddleware'; //from 'ald-middleware';
import {default as chainOps} from 'Redux/chain/operations';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  try {
    registerDeps(cacheTypes.CACHE_CHANGED, async ()=>{
      let storage = getState().cache.storage;
      let mw = new API({
        web3,
        storage,
        contractAddress: ChainInfo.contractAddress
      });
      await mw.init();
      dispatch(Creators.middlewareChanged(mw));
    });

    let web3 = getState().chain.web3;
    if(!web3) {
      return dispatch(Creators.failure(new Error("Missing web3 in state tree")));
    }
    let storage = getState().cache.storage;
    let mw = new API({
      web3,
      storage,
      contractAddress: ChainInfo.contractAddress
    });
    console.log("Initializing middleware");
    await mw.init();
    let isV = false;
    try {
      console.log("Calling isVendor");
      isV = await mw.isVendor();
      console.log("isV result", isV);
    } catch (e) {
      console.log("Problem getting vendor info", e);
    }
    
    dispatch(Creators.initSuccess(mw, isV));

  }catch(e){
    dispatch(Creators.failure(e));
  }
}

const send = ({fName, args}) => async (dispatch, getState) => {
  let api = getState().middleware.api;
  let fn = api[fName];
  if(typeof fn !== 'function') {
    throw new Error("No such API method: " + fName);
  }
  let p = fn(...args);
  let hash = null;
  console.log("Registered for callbacks", p);
  p.on("transactionHash", h=>{
    hash = h;
    console.log("Getting txn hash", h);
    dispatch(chainOps.markPending(hash));
  });
  console.log("Setting up result handler");
  p.then(r=>{
    console.log("Result of", fName, r);
    dispatch(chainOps.txnComplete(hash));
    return r;
  }).catch(e=>{
    console.log("Problem with", fName, e);
    dispatch(chainOps.txnFailed(hash, e.message));
  })
  return p;
}

const call = ({fName, ...args}) => async (dispatch, getState) => {
  let api = getState().middlware.api;
  let fn = api[fName];
  if(typeof fn !== 'function') {
    throw new Error("No such API method: " + fName);
  }
  return fn(...args);
}

export default {
  init,
  call,
  send
}
