import { useContext } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

export default function Logout() {
  const { setLoggedIn, setUserId } = useContext(AuthContext);

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    setLoggedIn(false);
    setUserId(-1);
  }, []);

  return <Navigate to="/" />;
}
