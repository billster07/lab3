import { createContext } from "react";

interface UserInfo {
  token: string;
  user_id: number;
}
interface ContextProps {
  setUserInfo: (userInfo: null | UserInfo) => void;
  userInfo: null | UserInfo;
}
const SomeContext = createContext<ContextProps | null>(null);

export default SomeContext;
