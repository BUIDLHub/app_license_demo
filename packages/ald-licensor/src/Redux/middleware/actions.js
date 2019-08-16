import {createActions} from 'reduxsauce';

const {
  Types,Creators
} = createActions({
  initStart: null,
  initSuccess: ['middleware', 'isVendor'],
  updateProducts: ['products'],
  middlewareChanged: ['middleware'],
  failure: ['error']
}, {prefix: "middleware."});

export {
  Types,
  Creators
}
