import { combineReducers } from 'redux';
//import {reducer as toastrReducer} from 'react-redux-toastr'
import {default as init} from './init/reducers';
import {default as chain} from './chain/reducers';
import {default as middleware} from './middleware/reducers';
import {default as cache} from './cache/reducers';
import {default as licenseForm} from './licenseForm/reducers';

/**
 * Collection of all dashboard state tree reducers
 */
export default combineReducers({
  //toastr: toastrReducer,
  init,
  chain,
  middleware,
  cache,
  licenseForm
});
