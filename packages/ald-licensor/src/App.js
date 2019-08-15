import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navigation from "./Components/Navbar";
import Licensor from "./Components/Licensor/index.js";
import Footer from "./Components/Footer";
import Marketplace from "./Components/Marketplace";
import Products from "./Components/Portfolio/Products";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <header className="page">
          {/* <Licensor /> */}
          <Switch>
            <Route path="/" exact component={Licensor} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/products" component={Products} />
          </Switch>
        </header>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
