import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import "./navbar.scss";

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSigninForm, setShowSigninForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [username, setUsername] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const accessString = localStorage.getItem("JWT");
    if (accessString == null) {
      setAuthorized(false);
    } else {
      try {
        const username = localStorage.getItem("USERNAME");

        setUsername(username);
        setAuthorized(true);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const showSigninFormHandler = () => {
    setShowSigninForm(true);
    setShowSignupForm(false);
  };

  const showSignupFormHandler = () => {
    setShowSigninForm(false);
    setShowSignupForm(true);
  };

  const hideSigninFormHandler = () => {
    setShowSigninForm(false);
    setShowSignupForm(false);
  };
  //Logout User
  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar color="dark" light expand="md">
        <NavbarBrand className="text-light" href="/">
          Trueques Colombia
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {!authorized ? (
              <>
                {!showSigninForm ? (
                  <NavItem>
                    <NavLink to="/signin">
                      <span
                        className="login-btns"
                        onClick={showSigninFormHandler}
                      >
                        Iniciar sesion
                      </span>
                    </NavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <NavLink to="/">
                      <span
                        className="login-btns"
                        onClick={hideSigninFormHandler}
                      >
                        <i className="fas fa-home"></i> Regresar a inicio
                      </span>
                    </NavLink>
                  </NavItem>
                )}
                {!showSignupForm ? (
                  <NavItem>
                    <NavLink to="/signup">
                      <span
                        onClick={showSignupFormHandler}
                        className="login-btns"
                      >
                        Crear Cuenta
                      </span>{" "}
                    </NavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <span
                      className="login-btns"
                      onClick={hideSigninFormHandler}
                    >
                      <i className="fas fa-home"></i> Regresar a inicio
                    </span>
                  </NavItem>
                )}
              </>
            ) : (
              <NavItem>
                <div>
                  <button className="btn btn-success mr-5">Mi Cuenta</button>
                  <span className="text-light">
                    <i className="fas fa-user"></i>&nbsp;{" "}
                    <span className="ml-2 mr-2">{username}</span>
                  </span>{" "}
                  <button
                    className="btn btn-warning text-dark "
                    onClick={handleLogOut}
                  >
                    Cerrar sesion
                  </button>
                </div>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Example;
