import { createContext, useEffect, useState } from "react";
import { makePayload } from "../utils/utils.js";

export const AuthContext = createContext({
  loggedIn: false,
  setLoggedIn: undefined,
  userId: -1,
  setUserId: undefined,
  checking: true,
});

export default function AuthProvider({ children }) {
  const [userId, setUserId] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  // Get login details at startup
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setChecking(false);
      return;
    }
    fetch("/api/auth", {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })
      .then((res) => makePayload(res))
      .then((payload) => {
        if (payload.ok) {
          setLoggedIn(true);
          setUserId(payload.data.userId);
        }
        setChecking(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, userId, setUserId, checking }}
    >
      {children}
    </AuthContext.Provider>
  );
}
