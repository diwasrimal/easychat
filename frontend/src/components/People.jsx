import { useContext } from "react";
import { useState } from "react";
import { CurrChatPartnerContext } from "../contexts/CurrChatPartnerProvider";
import { debounce, getLoggedInUserId, makePayload } from "../utils/utils";
import { useEffect } from "react";
import ContentCenteredDiv from "./ContentCenteredDiv";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";

export default function ChatList() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const loggedInId = getLoggedInUserId();

  // Debounced search function
  const searchUser = useMemo(() => {
    return debounce((query) => {
      if (query.length === 0) return;
      const params = new URLSearchParams([["name", query]]);
      const url = `/api/search?${params}`;
      console.log("fetching ", url);
      setLoading(true);
      const token = localStorage.getItem("jwt");
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => makePayload(res))
        .then((payload) => {
          if (payload.ok) {
            setResults(payload.results || []);
          } else {
            console.error(`Error msg: GET ${url}`, payload.message);
          }
        })
        .catch((err) => console.error(`Error: GET ${url}`, err))
        .finally(() => setLoading(false));
    }, 250);
  }, []);

  // Call debounced search function on each keystroke
  useEffect(() => searchUser(input), [input]);

  return (
    <div className="w-full h-full border-1 flex flex-col overflow-auto">
      <h3 className="mb-3">People</h3>
      <input
        autoFocus
        type="text"
        className="form-control"
        placeholder="Search for a user"
        onChange={(e) => setInput(e.target.value)}
      />

      {loading ? (
        <ContentCenteredDiv>Loading...</ContentCenteredDiv>
      ) : results.length === 0 ? (
        <ContentCenteredDiv>No matches</ContentCenteredDiv>
      ) : (
        <ul className="list-group mt-3 flex-grow-1 overflow-auto">
          {results.map((user) => (
            <li
              key={user.id}
              className="list-group-item py-3 d-flex justify-content-between align-items-center"
            >
              {user.fullname}
              {user.id !== loggedInId && <StartChatButton user={user} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StartChatButton({ user }) {
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { setCurrChatPartner } = useContext(CurrChatPartnerContext);

  function startChat() {
    // Set user as active chat partner and navigate to chats
    setCurrChatPartner(user);
    setShouldNavigate(true);
  }

  if (shouldNavigate) return <Navigate to="/home/chats" />;

  return (
    <button
      className="btn btn-secondary py-1 px-3"
      onClick={startChat}
      title="Message"
    >
      <FiMessageSquare />
    </button>
  );
}
