import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

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

  &:disabled {
    background: #6a679e;
    border-color: #6a679e;
  }
`;

const P = styled.p`
  color: red;
`;

const Registration = () => {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axios.post(
        "/users",
        { username: username, password: password, phone_number: phoneNumber },
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
      setErrorMsg(!errorMsg);
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
              <DivLogin>
                <Input
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="Telefonnummer"
                  value={phoneNumber}
                />
              </DivLogin>
              {errorMsg && <P>Fel användarnamn eller lösenord</P>}
              <InputSubmit
                disabled={
                  password.length < 6 ||
                  username === "" ||
                  phoneNumber.length !== 10
                }
                type="submit"
                value="Registrera dig"
              />
            </Form>
          </DivContent>
        </DivScreen>
      </Div>
    </>
  );
};

export default Registration;
