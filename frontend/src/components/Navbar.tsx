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
  display: flex;
  align-items: center;
  height: 100%;
  @media (min-width: 700px) {
    display: flex;
  }
  @media (max-width: 699px) {
    display: none;
  }
`;

const Ul = styled.ul`
  display: flex;
  list-style: none;

  & li {
    margin-right: 10px;
    font-size: 20px;
  }
`

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
          "/logout",
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
          <Ul>
            <li>
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>Hem</Link>
            </li>
            <li>
              <Link to="/matcher" style={{ textDecoration: "none", color: "white" }}>Matcher</Link>
            </li>
            <li>
              <Link to="/leaderboard" style={{ textDecoration: "none", color: "white" }}>Leaderboard</Link>
            </li>
            <li>
              <a
                style={{ textDecoration: "none", color: "white" }}
                onClick={handleClick}
              >
                Logga ut
              </a>
            </li>
          </Ul>
        </DivDesktop>
      </Nav>
    </>
  );
};

export default Navbar;
