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
      items: [],
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
          .then((res) => {
            console.log(res);
            this.setState({
              userType: res.data.userType,
              firstName: res.data.firstName,
              items: res.data.Items,
            });
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
    const itemsList =
      this.state.items.length > 0 ? (
        this.state.items.map((item) => {
          return (
            <div className="item-container" key={item.id}>
              <h2 className="item-title">{item.itemName}</h2>
              <img className="item-img" src={item.itemImg} alt="item imagen" />
              <p>Descripcion: {item.description}</p>
              <p>Valor aproximado: ${item.itemPrice}</p>
              <button className="edit-item-btn">Editar producto</button>
            </div>
          );
        })
      ) : (
        <p>No hay productos en la lista aun</p>
      );

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
          Loading Amazing Pet Grooming Data...try logging in again
        </div>
      );
    }

    return (
      <div style={{ marginTop: "60px", marginLeft: "60px" }}>
        <button onClick={this.handleLogOut}>Logout</button>
        <h2>Bienvenido {this.state.firstName.toUpperCase()}</h2>
        <hr />
        <h1 className="mis-productos-title">Mis Productos</h1>
        <hr />
        <div className="items-wrapper">{itemsList}</div>
      </div>
    );
  }
}

export default Profile;
