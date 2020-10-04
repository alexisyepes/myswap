import React, { Component } from "react";
import "./AddItems.scss";
import axios from "axios";

class AddItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemName: "",
      description: "",
      category: "",
      itemPrice: "",
      itemStatus: "",
      itemReadyForPhoto: false,
      showInputForm: true,
      loadingAxiosRequest: false,
    };
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  fileSelectedHandler = async (event) => {
    await this.setState({
      itemImg: event.target.files[0],
    });
    this.fileUploadHandler();
  };

  fileUploadHandler = async () => {
    if (!this.state.itemImg) {
      return;
    }
    const itemId = this.state.itemId;
    const fd = new FormData();
    fd.append("file", this.state.itemImg);
    fd.append("upload_preset", "myswap");
    this.setState({
      loadingAxiosRequest: true,
    });

    await axios
      .post("	https://api.cloudinary.com/v1_1/myswapaplicacion/upload", fd)
      .then(async (res) => {
        let newItemImg = {
          itemImg: res.data.secure_url,
        };
        await axios
          .put("/auth/item/" + itemId, newItemImg)
          .then(() => {
            // console.log(res);
            window.location.reload();
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status === 500 || error) {
              console.log(error);
              // this.errorOnPhotoUpload();
              this.setState({
                loadingAxiosRequest: false,
              });
            }
          });
      })
      .catch((err) => {
        this.errorOnPhotoUpload();
        this.setState({
          loadingAxiosRequest: false,
        });
        console.log(err);
      });
  };

  submitItemHandler = async (e) => {
    e.preventDefault();
    let itemObj = {
      itemName: this.state.itemName,
      description: this.state.description,
      category: this.state.category,
      itemPrice: this.state.itemPrice,
      itemStatus: this.state.itemStatus,
      itemImg: "",
    };
    if (
      itemObj.itemName === "" ||
      itemObj.description === "" ||
      itemObj.category === "" ||
      itemObj.itemPrice === "" ||
      itemObj.itemStatus === ""
    ) {
      return alert("Todos los campos son necesarios");
    }
    await axios
      .post("/auth/user/" + this.props.userId, itemObj)
      .then((res) => {
        this.setState({
          itemId: res.data.id,
          itemReadyForPhoto: true,
          showInputForm: false,
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        {this.state.loadingAxiosRequest ? (
          <div>Por favor espere...</div>
        ) : (
          <div>
            {this.state.showInputForm ? (
              <form
                className="add-items-form"
                onSubmit={this.submitItemHandler}
              >
                <input
                  className="input-add-items"
                  name="itemName"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Nombre de producto"
                />
                <textarea
                  className="input-add-items"
                  name="description"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Descripcion"
                />
                <input
                  className="input-add-items"
                  name="category"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Categoria"
                />
                <input
                  className="input-add-items"
                  name="itemPrice"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Valor aprox. en el mercado"
                />
                <input
                  className="input-add-items"
                  name="itemStatus"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Status"
                />
                <button className="btn-submit-addItems">Añada producto</button>
              </form>
            ) : null}
            {this.state.itemReadyForPhoto ? (
              <div>
                <button
                  className="add-photo-btn"
                  onClick={() => {
                    this.fileInput.click();
                  }}
                >
                  Añadir foto <i className="fas fa-camera-retro"></i>
                </button>
                <input
                  style={{ display: "none" }}
                  type="file"
                  capture="environment"
                  onChange={this.fileSelectedHandler}
                  ref={(fileInput) => (this.fileInput = fileInput)}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default AddItems;
