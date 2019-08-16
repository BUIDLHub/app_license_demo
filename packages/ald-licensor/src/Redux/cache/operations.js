import {Creators} from './actions';
import {registerDeps} from 'Redux/DepMiddleware';
import {Types as chainTypes} from 'Redux/chain/actions';
import DB from 'buidl-storage';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());

  try {
    registerDeps([chainTypes.CHANGE_NETWORK], ()=>{
      let id = getState().chain.networkID;
      let cache = new DB({
        dbPrefix: "ald-" + id + "-"
      });
      dispatch(Creators.cacheChanged(cache));
    })
    let web3 = getState().chain.web3;
    let id = await web3.eth.net.getId();
    let cache = new DB({
      dbPrefix: "ald-" + id + "-"
    });
    dispatch(Creators.initSuccess(cache));
    
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

export default {
  init
}
