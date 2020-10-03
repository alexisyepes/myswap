import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import UsersProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import Home from "./pages/Home";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/auth/profile" component={UsersProfile} />
          <Route exact path="/auth/admin_profile" component={AdminProfile} />
        </Switch>
      </Router>
    );
  }
}

export default App;
