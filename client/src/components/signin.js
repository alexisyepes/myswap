import React, { Component } from "react";
// import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import "./signin.scss";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: "",
    loggedIn: false,
    showError: false,
    showNullError: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === "" || password === "") {
      return this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
        errorMessage: "Llene los campos primero!",
      });
    } else {
      try {
        const response = await axios.post("/auth/login", {
          email,
          password,
        });
        console.log(response);
        localStorage.setItem("JWT", response.data.token);
        localStorage.setItem("USERNAME", response.data.username);
        localStorage.setItem("USERTYPE", response.data.userType);

        if (response.data.userType === "admin") {
          window.location.href = "/auth/admin_profile";
        } else {
          window.location.href = "/auth/profile";
        }

        this.setState({
          loggedIn: true,
          showError: false,
          showNullError: false,
        });
      } catch (error) {
        console.error(error.response);
        this.setState({
          errorMessage: error.response.data.message,
        });
      }
    }
  };
  render() {
    return (
      <div className="container__signinPage">
        <div className=" form-box-signin">
          <form className="form-signin" onSubmit={this.handleSubmit.bind(this)}>
            <h2 className="signin-title">
              <i className="fas fa-lock"></i> - Users Sign In{" "}
            </h2>
            <hr />
            <label htmlFor="email">* Email</label>
            <input
              className="signin-input"
              type="email"
              id="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <label htmlFor="password">* Password</label>
            <input
              className="signin-input"
              type="password"
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <button className="login-btn">Login</button>
            <h4 className="signin-form-err-msg">{this.state.errorMessage}</h4>
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;
