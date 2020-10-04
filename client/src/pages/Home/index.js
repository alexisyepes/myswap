import React, { Component } from "react";
import Signin from "../../components/signin";
import "./style.scss";

class index extends Component {
  render() {
    return (
      <div className="container__home">
        <h1>Trueques Colombia </h1>
        <Signin />
      </div>
    );
  }
}

export default index;
