import {createActions} from 'reduxsauce';

const {
  Types,Creators
} = createActions({
  initStart: null,
  initSuccess: ['products'],
  addProduct: ['product'],
  failure: ['error']
}, {prefix: "products."});

export {
  Types,
  Creators
}
