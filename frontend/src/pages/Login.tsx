import { useState, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import SomeContext from "../SomeContext";

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const DivScreen = styled.div`
  background: linear-gradient(90deg, #014ea1, #366ca5);
  height: 550px;
  width: 320px;
  box-shadow: 0px 0px 24px #5c5696;
`;

const DivContent = styled.div`
  z-index: 1;
  position: relative;
  height: 100%;
`;

const Form = styled.form`
  width: 280px;
  padding: 20px;
  padding-top: 156px;
`;

const DivLogin = styled.div`
  padding: 20px 0px;
  position: relative;
`;

const Input = styled.input`
  border: none;
  border-bottom: 2px solid #6a679e;
  background: none;
  padding: 10px;
  padding-left: 24px;
  font-weight: 700;
  width: 75%;
  transition: 0.2s;
  color: #d1d1d4;

  &:hover,
  &:active,
  &:focus {
    outline: none;
    border-bottom-color: #d1d1d4;
  }
`;

const InputSubmit = styled.input`
  background: #fff;
  font-size: 14px;
  margin-top: 30px;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid #d4d3e8;
  text-transform: uppercase;
  font-weight: 700;
  width: 100%;
  color: #014ea1;
  box-shadow: 0px 2px 2px #5c5696;
  cursor: pointer;
  transition: 0.2s;

  &:active,
  &:focus,
  &:hover {
    border-color: #6a679e;
    outlone: none;
  }
`;

const P = styled.p`
  color: red;
`;

const A = styled.a`
  position: absolute;
  bottom: 50px;
  right: 30px;
  color: #fff;
  cursor: pointer;
`;

const DivBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  -webkit-clip-path: inset(0 0 0 0);
  clip-path: inset(0 0 0 0);
`;

const SpanShape2 = styled.span`
  transform: rotate(45deg);
  position: absolute;
  height: 520px;
  width: 520px;
  background: #014ea1;
  top: -30px;
  right: 120px;
  border-radius: 0 100px 0 0;
  border: 7px solid #fee417;
`;
const SpanShape3 = styled.span`
  transform: rotate(45deg);
  position: absolute;
  height: 520px;
  width: 520px;
  background: #014ea1;
  top: -30px;
  right: 127px;
  border-radius: 0 100px 0 0;
  border: 7px solid #fe3f2a;
`;
const SpanShape4 = styled.span`
  transform: rotate(45deg);
  position: absolute;
  height: 520px;
  width: 520px;
  background: #014ea1;
  top: -30px;
  right: 134px;
  border-radius: 0 100px 0 0;
  border: 7px solid black;
`;

const Login = () => {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();
  const context = useContext(SomeContext);
  if (!context) {
    console.error("Context is null");
    return;
  }
  const { setUserInfo } = context;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        "/login",
        { username: username, password: password },
        { withCredentials: true }
      );
      navigate("/");
      setUserInfo(data);
      setErrorMsg(false);
    } catch (error) {
      console.log(error);
      setErrorMsg(true);
    }
  };

  return (
    <>
      <Div>
        <DivScreen>
          <DivContent>
            <Form onSubmit={handleSubmit}>
              <DivLogin>
                <Input
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Användarnamn"
                  value={username}
                />
              </DivLogin>
              <DivLogin>
                <Input
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Lösenord"
                  value={password}
                  type="password"
                />
              </DivLogin>
              {errorMsg && <P>Fel användarnamn eller lösenord</P>}
              <InputSubmit type="submit" value="Logga in" />
              <A onClick={() => navigate("/registrering")}>Registrera dig</A>
            </Form>
            <DivBackground>
              <SpanShape2></SpanShape2>
              <SpanShape3></SpanShape3>
              <SpanShape4></SpanShape4>
            </DivBackground>
          </DivContent>
        </DivScreen>
      </Div>
    </>
  );
};

export default Login;
