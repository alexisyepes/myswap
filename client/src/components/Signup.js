import React, { Component } from "react";
// import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import "./signup.scss";

class Signup extends Component {
  state = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    errorMessage: "",
    loggedIn: false,
    showError: false,
    showNullError: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, password2 } = this.state;
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      password2 === ""
    ) {
      return this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
        errorMessage: "Llene los campos primero!",
      });
    }
    if (this.state.password !== this.state.password2) {
      return this.setState({
        errorMessage: "Los passwords no coinciden!",
      });
    } else {
      try {
        const newUser = {
          firstName,
          lastName,
          username: firstName + lastName,
          email,
          password,
          userType: "client",
        };
        const response = await axios.post("/auth/signup", newUser);

        if (response.data.status === 400) {
          return this.setState({
            errorMessage: response.data.message,
          });
        }

        this.setState({
          loggedIn: true,
          showError: false,
          showNullError: false,
          errorMessage: "",
        });
        alert("Ya puede iniciar sesion!");
        window.location.reload();
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
              <i className="fas fa-lock"></i> Crear Cuenta
            </h2>
            <hr />
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="firstName">
                * Nombre
              </label>
              <input
                name="firstName"
                className="signup-input"
                type="firstName"
                id="firstName"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="lastName">
                * Apellido
              </label>
              <input
                name="lastName"
                className="signup-input"
                type="lastName"
                id="lastname"
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="email">
                * Email
              </label>
              <input
                name="email"
                className="signup-input"
                type="email"
                id="email"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="password">
                * Password
              </label>
              <input
                name="password"
                className="signup-input"
                type="password"
                id="password"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group-signup">
              <label className="label-form-signup" htmlFor="password">
                * Confirme Password
              </label>
              <input
                name="password2"
                className="signup-input"
                type="password"
                id="password2"
                onChange={this.handleChange}
              />
            </div>
            <button className="signup-btn">Registrarse</button>
            <h4 className="signin-form-err-msg">{this.state.errorMessage}</h4>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
