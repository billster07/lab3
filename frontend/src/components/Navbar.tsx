import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import HamburgerMenu from "./HamburgerMenu";
import SomeContext from "../SomeContext";

const Nav = styled.nav`
  background-color: #014ea1;
  height: 4rem;
  width: 100vw;
`;

const DivMobile = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  align-items: center;
  @media (max-width: 699px) {
    display: flex;
  }
  @media (min-width: 700px) {
    display: none;
  }
`;

const DivDesktop = styled.div`
  @media (min-width: 700px) {
    display: inline;
  }
  @media (max-width: 699px) {
    display: none;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const context = useContext(SomeContext);
  if (!context) {
    console.error("Context is null");
    return;
  }
  const { userInfo, setUserInfo } = context;

  const handleClick = async () => {
    try {
      if (userInfo) {
        await axios.post(
          "http://localhost:3000/logout",
          { token: userInfo.token },
          { withCredentials: true }
        );
        setUserInfo(null);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Nav>
        <DivMobile>
          <HamburgerMenu handleClickProp={handleClick} />
        </DivMobile>
        <DivDesktop>
          <ul>
            <li>
              <Link to="/">Hem</Link>
            </li>
            <li>
              <Link to="/matcher">Matcher</Link>
            </li>
            <li>
              <Link to="/leaderboard">Leaderboard</Link>
            </li>
            <li>
              <a
                style={{ textDecoration: "none", color: "white" }}
                onClick={handleClick}
              >
                Logga ut
              </a>
            </li>
          </ul>
        </DivDesktop>
      </Nav>
    </>
  );
};

export default Navbar;
