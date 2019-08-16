import {Creators} from './actions';
import {registerDeps} from 'Redux/DepMiddleware';
import Web3 from 'web3';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  try {
    let ethProvider = window.ethereum;
    if(!ethProvider && window.web3){
      ethProvider =  window.web.currentProvider;
    }
    if(ethProvider) {
      let web3 = new Web3(ethProvider);
      let acts = await ethProvider.enable();
      if(!acts) {
        //user denied access to app
        acts = [];
      }
    
      //If the user changes network in metamask
      ethProvider.on('networkChanged', async (netId) => {
        //grab new account and assign as contract default caller address
        console.log("Network changed in MM");

        //re-establish the chain with new account
        dispatch(Creators.changeNetwork(netId));
      });

      dispatch(Creators.initSuccess(web3, acts, ethProvider.networkVersion));
    }
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

export default {
  init
}
