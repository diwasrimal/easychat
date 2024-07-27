import { useContext } from "react";
import { useState } from "react";
import { ChatPartnersContext } from "../contexts/ChatPartnersProvider";
import { CurrChatPartnerContext } from "../contexts/CurrChatPartnerProvider";
import { getLoggedInUserId, makePayload } from "../utils/utils";
import { useEffect } from "react";
import { WebsocketContext } from "../contexts/WebsocketProvider";
import ContentCenteredDiv from "./ContentCenteredDiv";

export default function ChatList() {
  const { chatPartners, setChatPartners, errMsg, loading } =
    useContext(ChatPartnersContext);

  // Sets the curr chat pair's id, which causes chats to be
  // loaded on chat window at right side
  const { currChatPartner, setCurrChatPartner } = useContext(
    CurrChatPartnerContext,
  );

  // When a message is received from a user that is not the active chat partner
  // we change the conversations list to show the most recent chat partner at top
  const { wsData } = useContext(WebsocketContext);
  useEffect(() => {
    if (wsData?.msgType === "chatMsgReceive") {
      const msg = wsData.msgData;
      if (
        msg.senderId === getLoggedInUserId() ||
        msg.senderId === currChatPartner?.id
      ) {
        return;
      }
      // TODO: maybe cache into session storage
      const url = `/api/users/${msg.senderId}`;
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
            const messager = payload.user;
            setChatPartners([
              messager,
              ...chatPartners.filter((p) => p.id !== messager.id),
            ]);
          } else {
            throw new Error(`errmsg: ${payload.message}`);
          }
        })
        .catch((err) => console.error(`Error: GET ${url}:`, err));
    }
  }, [wsData]);

  if (loading) return <ContentCenteredDiv>Loading...</ContentCenteredDiv>;

  if (errMsg) return <p className="text-red-400">{errMsg}</p>;

  return (
    <>
      <h3>Chats</h3>
      {chatPartners.length === 0 ? (
        <p className="mt-4">No recent chats</p>
      ) : (
        <ul className="list-group mt-3 flex-grow-1 overflow-auto">
          {chatPartners.map((partner) => (
            <li
              className={`list-group-item py-3 ${partner.id === currChatPartner?.id && "bg-body-secondary"}`}
              onClick={() => setCurrChatPartner(partner)}
              key={partner.id}
            >
              {partner.fullname}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
