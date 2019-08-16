import React from "react";
import {Provider} from 'react-redux';
import configureStore from 'Store/configureStore';
import Main from './Main';
let store = configureStore();

export default class App extends React.Component {
  
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

