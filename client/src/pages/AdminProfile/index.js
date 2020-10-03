import axios from "axios";
import React, { Component } from "react";
import "./style.scss";

class Profile extends Component {
  constructor(props) {
    super();

    this.state = {
      email: "",
      username: "",
      isLoading: true,
      error: false,
      userType: "",
      firstName: "",
      usersArray: [],
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    } else {
      try {
        await axios
          .get("/auth/users_profile", {
            headers: { Authorization: `JWT ${accessString}` },
          })
          .then(async (res) => {
            this.setState({
              userType: res.data.userType,
              firstName: res.data.firstName,
            });
            await axios
              .get("/auth/users", {
                headers: { Authorization: `JWT ${accessString}` },
              })
              .then((res) => {
                this.setState({
                  usersArray: res.data.filter(
                    (user) => user.userType === "client"
                  ),
                });
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));

        window.scrollTo(0, 1000);

        this.setState({
          isLoading: false,
          error: false,
        });
      } catch (error) {
        console.error(error.response);
        this.setState({
          error: true,
        });
      }
    }
  }

  //Logout User
  handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("JWT");
    window.location.href = "/";
  };

  render() {
    // const { isLoading, error } = this.state;
    if (this.state.error) {
      return (
        <div
          style={{
            marginLeft: "10%",
            fontSize: "30px",
            height: "100vh",
            marginTop: "120px",
          }}
        >
          ...Problem fetching user data. Please login again
          <span role="img" aria-label="Face With Rolling Eyes Emoji">
            🙄
          </span>
        </div>
      );
    }
    if (this.state.isLoading) {
      return (
        <div
          style={{
            marginTop: "120px",
            marginLeft: "10%",
            fontSize: "30px",
            height: "100vh",
          }}
        >
          Loading Admin Profile Data...
        </div>
      );
    }

    return (
      <div style={{ marginTop: "60px", marginLeft: "60px" }}>
        <button onClick={this.handleLogOut}>Logout</button>{" "}
        <h1>Bienvenido Admin {this.state.firstName} </h1>{" "}
        <h2>Lista de usuarios</h2>
        {this.state.usersArray.length > 0 ? (
          this.state.usersArray.map((user) => {
            return (
              <div key={user.id}>
                <ul>
                  <li>Nombre: {user.firstName}</li>
                  <li>Apellido: {user.lastName}</li>
                  <li>Email: {user.email}</li>
                </ul>
              </div>
            );
          })
        ) : (
          <p>No hay usuarios todavia</p>
        )}
      </div>
    );
  }
}

export default Profile;
