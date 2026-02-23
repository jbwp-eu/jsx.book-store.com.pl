import { useState } from "react";
import Container from "./Container";
import Navigation from "./Navigation";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [toggler, setToggler] = useState(false);

  const handleToggle = () => {
    setToggler((prev) => !prev);
  };

  return (
    <>
      <header className="main-header">
        <Container>
          <div className="main-header__wrapper">
            <NavLink to="/">
              <div className="main-header__name">
                <img src={"/logo.svg"} alt="logo" width="35px" />
                <h2>BookStore</h2>
              </div>
            </NavLink>
            <nav className="main-header__nav">
              <Navigation />
            </nav>
            <div className="main-header__menu-btn" onClick={handleToggle}>
              <span />
              <span />
              <span />
            </div>
          </div>
          {toggler && (
            <div className="main-header__bottom-nav">
              <Navigation />
            </div>
          )}
        </Container>
      </header>
    </>
  );
};

export default Header;
