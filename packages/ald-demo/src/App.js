import React from 'react';
import './App.css';
import './styles/style.scss';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Overview } from './pages';
// import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (

    <Router>
        <Route path="/" exact component={Overview} />
    </Router>);
}

export default App;
