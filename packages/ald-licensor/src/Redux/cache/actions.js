import {createActions} from 'reduxsauce';

const {
  Types,Creators
} = createActions({
  initStart: null,
  initSuccess: ['cache'],
  cacheChanged: ['cache'],
  failure: ['error']
}, {prefix: "cache."});

export {
  Types,
  Creators
}
