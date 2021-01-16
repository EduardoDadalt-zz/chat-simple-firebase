import firebase from "firebase/app";
import { createContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { auth } from "../config/fire";
interface AuthProps {
  user: firebase.User;
}
const AuthContext = createContext<AuthProps | any>({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(auth.currentUser);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    var Unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (loading) setLoading(false);
    });
    return Unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <div
          style={{ width: "100vw", height: "100vh" }}
          className="d-flex align-items-center justify-content-center"
        >
          <Spinner animation="border" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
