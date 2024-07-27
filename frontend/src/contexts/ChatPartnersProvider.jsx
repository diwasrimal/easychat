import { createContext, useEffect, useState } from "react";
import { makePayload } from "../utils/utils";
import { Navigate } from "react-router-dom";

export const ChatPartnersContext = createContext({
  chatPartners: [],
  setChatPartners: undefined,
  errMsg: "",
  loading: true,
});

export function ChatPartnersProvider({ children }) {
  const [chatPartners, setChatPartners] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get people logged in user has chatted with
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch("/api/chat-partners", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => makePayload(res))
      .then((payload) => {
        if (payload.ok) {
          setChatPartners(payload.partners || []);
          console.log(payload.partners);
        } else {
          setUnauthorized(payload.statusCode === 401);
          setErrMsg(payload.message);
        }
      })
      .catch((err) => console.error("Error: GET /api/chat-partners:", err))
      .finally(() => setLoading(false));
  }, []);

  if (unauthorized) {
    console.log("Unauthorized response while requesting fro chat partners");
    return <Navigate to="/login" />;
  }

  return (
    <ChatPartnersContext.Provider
      value={{ chatPartners, setChatPartners, errMsg, loading }}
    >
      {children}
    </ChatPartnersContext.Provider>
  );
}
