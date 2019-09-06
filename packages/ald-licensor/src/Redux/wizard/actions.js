import {createActions} from 'reduxsauce';

const {
  Types,Creators
} = createActions({
  saveData: ['data'],
  nextStep: null,
  prevStep: null,
  show: ['id'],
  hide: null,
  failure: ['error']
}, {prefix: "wizard."});

export {
  Types,
  Creators
}
