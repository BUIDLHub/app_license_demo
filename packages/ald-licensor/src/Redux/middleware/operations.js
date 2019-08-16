import {Creators} from './actions';
import {registerDeps} from 'Redux/DepMiddleware';
import {Types as cacheTypes} from 'Redux/cache/actions';
import Storage from 'buidl-storage';
import * as ChainInfo from 'Constants/chain';
import API from 'ald-middleware';

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
    await mw.init();
    let isV = await mw.isVendor();
    dispatch(Creators.initSuccess(mw, isV));

  }catch(e){
    dispatch(Creators.failure(e));
  }
}

export default {
  init
}
