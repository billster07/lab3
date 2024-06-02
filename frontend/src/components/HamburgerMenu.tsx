import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Div = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  top: 3.5rem;
  width: 100%;
  height: 150px;
  background-color: #014ea1;
  z-index: 2;
`;

const Ul = styled.ul`
  list-style: none;
  heigth: 100%;

  & li {
    margin-top: 10px;
    font-size: 20px;
  }
`;

interface Click {
  handleClickProp: () => void;
}

const HamburgerMenu = ({ handleClickProp }: Click) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen ? (
        <IoMenu onClick={handleClick} color={"#fff"} size={40} />
      ) : (
        <>
          <IoClose onClick={handleClick} color={"#fff"} size={40} />
          <Div>
            <Ul>
              <li>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/"
                  onClick={handleClick}
                >
                  Hem
                </Link>
              </li>
              <li>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/matcher"
                  onClick={handleClick}
                >
                  Matcher
                </Link>
              </li>
              <li>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/leaderboard"
                  onClick={handleClick}
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <a
                  style={{ textDecoration: "none", color: "white" }}
                  onClick={handleClickProp}
                >
                  Logga ut
                </a>
              </li>
            </Ul>
          </Div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
