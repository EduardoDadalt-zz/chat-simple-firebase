import firebase from "firebase/app";
import { createContext, useEffect, useState } from "react";
import { auth } from "../config/fire";
interface AuthProps {
  user: firebase.User;
}
const AuthContext = createContext<AuthProps | any>({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    var Unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return Unsubscribe;
  }, []);
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
