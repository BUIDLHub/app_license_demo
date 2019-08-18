import {createActions} from 'reduxsauce';

const {
  Types,Creators
} = createActions({
  initStart: null,
  initSuccess: ['web3', 'accounts', 'network'],
  changeNetwork: ['network'],
  updatePending: ['pending'],
  failure: ['error']
}, {prefix: "chain."});

export {
  Types,
  Creators
}
