import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import UsersProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignIn from "./components/Signin";
import Signup from "./components/Signup";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: false,
    };
  }

  componentDidMount() {
    const accessString = localStorage.getItem("JWT");
    if (accessString == null) {
      this.setState({
        isAuth: false,
      });
    } else {
      try {
        this.setState({
          isAuth: true,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  render() {
    return (
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/auth/profile" component={UsersProfile} />
          <Route exact path="/auth/admin_profile" component={AdminProfile} />
        </Switch>
      </Router>
    );
  }
}

export default App;
