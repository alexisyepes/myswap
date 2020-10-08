import React, { Component } from "react";
import "./style.scss";
import axios from "axios";
import { Modal } from "react-responsive-modal";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showSigninForm: false,
      showSignupForm: false,
      isLoggedIn: false,
      modalToContact: false,
      itemId: "",
      comment: "",
      userId: "",
      username: "",
    };
  }

  async componentDidMount() {
    const accessString = localStorage.getItem("JWT");
    const userId = localStorage.getItem("USER");
    const username = localStorage.getItem("USERNAME");
    if (accessString === null) {
      this.setState({
        isLoggedIn: false,
      });
    } else {
      this.setState({
        isLoggedIn: true,
        userId,
        username,
      });
    }

    await axios
      .get("/auth/items")
      .then((res) => {
        const filteredData = res.data.filter((item) => {
          return item.UserId !== userId;
        });
        return this.setState({
          items: filteredData,
        });
      })
      .catch((err) => console.log(err));
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  showSigninFormHandler = () => {
    this.setState({
      showSigninForm: true,
      showSignupForm: false,
    });
  };

  showSignupFormHandler = () => {
    this.setState({
      showSignupForm: true,
      showSigninForm: false,
    });
  };

  hideSigninFormHandler = () => {
    this.setState({
      showSigninForm: false,
      showSignupForm: false,
    });
  };

  checkIsLoggedIn = ({ currentTarget }) => {
    if (!this.state.isLoggedIn) {
      alert("Debe iniciar sesion primero");
      return (window.location.href = "/signin");
    }
    this.openModal(currentTarget.value);
  };

  openModal = (itemId) => {
    this.setState({
      modalToContact: true,
      itemId,
    });
  };

  closeModal = async () => {
    await this.setState({
      modalToContact: false,
      itemId: "",
    });
  };

  sendMsgToOwner = async (e) => {
    e.preventDefault();
    const dt = new Date();
    const today =
      dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    const newComment = {
      date: today,
      comment: this.state.comment,
      userId: this.state.userId,
      userName: this.state.username,
    };

    await axios
      .post("/auth/comments/" + this.state.itemId, newComment)
      .then((res) => {
        // console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const itemsList =
      this.state.items.length > 0 ? (
        this.state.items.map((item) => {
          return (
            <div className="item-container-home" key={item.id}>
              <h4 className="item-title mt-2">{item.itemName}</h4>
              {item.itemImg === "" ? null : (
                <img
                  className="item-img-home"
                  src={item.itemImg}
                  alt="item imagen"
                />
              )}
              <p className="items-home-info">
                Descripcion: <b>{item.description}</b>{" "}
              </p>
              <p className="items-home-info">
                Valor aproximado: <b>${item.itemPrice}</b>{" "}
              </p>
              <button
                value={item.id}
                onClick={this.checkIsLoggedIn}
                className="btn btn-info"
              >
                <i className="fas fa-user"></i> Contactar
              </button>
            </div>
          );
        })
      ) : (
        <p>No hay productos todavia</p>
      );

    return (
      <div className="container__home">
        <h3>Productos mas recientes</h3>
        <hr />
        <div className="item-home-wrapper">{itemsList}</div>
        <Modal
          classNames={{
            modal: "customModalComment",
          }}
          open={this.state.modalToContact}
          onClose={this.closeModal}
          closeIcon={
            <span className="x-close-modal" onClick={this.closeModal}>
              X
            </span>
          }
        >
          <div className="col-xl-12">
            <h4>Contacte al dueño del producto</h4>
            <hr />
            <p>
              No olvide incluir la descripcion del articulo que usted desea
              canjear
            </p>
            <form className="form-signin" onSubmit={this.sendMsgToOwner}>
              <div className="form-group-signup">
                <label className="label-form-signup" htmlFor="comment">
                  Mensaje
                </label>
                <textarea
                  name="comment"
                  className="comment-input"
                  type="text"
                  onChange={this.handleChange}
                />
              </div>
              <button className="signup-btn">Contactar</button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default index;
