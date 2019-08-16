import {createActions} from 'reduxsauce';

const {
  Types,Creators
} = createActions({
  saveData: ['data'],
  nextStep: null,
  prevStep: null,
  failure: ['error']
}, {prefix: "licenseForm."});

export {
  Types,
  Creators
}
