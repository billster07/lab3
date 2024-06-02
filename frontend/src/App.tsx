import axios from "axios";
import Fixtures from "./pages/Fixtures";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import {
  createHashRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Registration from "./pages/Registration";
import SomeContext from "./SomeContext";
import Leaderboard from "./pages/Leaderboard";

interface UserInfo {
  token: string;
  user_id: number;
}

const Root = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const getUser = async () => {
    if (!userInfo) {
      try {
        const { data } = await axios.get("http://localhost:3000/user", {
          withCredentials: true,
        });
        setUserInfo(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return (
    // <div style={{display: "flex", flexDirection: "column"}}>
    <SomeContext.Provider value={{ setUserInfo, userInfo }}>
      {userInfo && <Navbar />}
      <main>
        <Outlet />
      </main>
    </SomeContext.Provider>
  );
};
function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: "/" },
        { element: <Fixtures />, path: "/matcher" },
        { element: <Login />, path: "/login" },
        { element: <Registration />, path: "/registrering" },
        { element: <Leaderboard />, path: "/leaderboard" },
      ],
      element: <Root />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
