import { useContext, useEffect, useState } from "react";
import {
  getLoggedInUserId,
  getMessagesFromSession,
  makePayload,
  saveMessagesToSession,
} from "../utils/utils";
import ContentCenteredDiv from "./ContentCenteredDiv";
import { CurrChatPartnerContext } from "../contexts/CurrChatPartnerProvider";
import { Navigate } from "react-router-dom";
import { WebsocketContext } from "../contexts/WebsocketProvider";
import { useRef } from "react";

export default function CurrChat() {
  const [messages, setMessages] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);
  // const messageContainerRef = useRef<HTMLDivElement>(null);

  const { currChatPartner } = useContext(CurrChatPartnerContext);

  // Load messages from sessionStorage or from server
  useEffect(() => {
    if (!currChatPartner) return;
    const messages = getMessagesFromSession(currChatPartner.id);
    if (messages) {
      setMessages(messages);
      return;
    }
    const url = `/api/messages/${currChatPartner.id}`;
    console.log(`fetching ${url}...`);
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
          const msgs = payload.messages;
          setMessages(msgs || []);
          saveMessagesToSession(currChatPartner.id, msgs);
        }
      })
      .catch((err) => console.error(`Error: GET ${url}:`, err));
  }, [currChatPartner]);

  // Update messages state when received through websocket connection
  // If the message was with currently active chat partner, then we have to setMessages().
  // If some other user sent a message, we store that in session storage corresponding to sender.
  const { wsData } = useContext(WebsocketContext);
  useEffect(() => {
    console.log("wsData has changed:", wsData);
    if (wsData?.msgType === "chatMsgReceive") {
      const msg = wsData.msgData;
      const sentByPartner = msg.senderId === currChatPartner?.id;
      const sentByMePreviously =
        msg.senderId === getLoggedInUserId() &&
        msg.receiverId === currChatPartner?.id;

      if (sentByMePreviously || sentByPartner) {
        console.log("Setting messages to ", [msg, ...messages]);
        setMessages([msg, ...messages]);
        return;
      }

      // Message was sent my user that's not the active chat partner
      // In this case we update the messages in session storage for the sender
      // If messages are not in session, fetch from server and store to session storage
      const prevMsgs = getMessagesFromSession(msg.senderId);
      if (prevMsgs !== undefined) {
        saveMessagesToSession(msg.senderId, [msg, ...prevMsgs]);
        return;
      }
      const url = `/api/messages/${msg.senderId}`;
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
            saveMessagesToSession(msg.senderId, [
              msg,
              ...(payload.messages || []),
            ]);
          } else {
            setUnauthorized(payload.statusCode === 401);
          }
        })
        .catch((err) => console.error(`Error: GET ${url}:`, err));
    }
  }, [wsData]);

  if (unauthorized) return <Navigate to="/login" />;
  if (!currChatPartner)
    return <ContentCenteredDiv>Select a chat!</ContentCenteredDiv>;

  // return (
  //   <>
  //     currchatpartner: {JSON.stringify(currChatPartner)}, messages:{" "}
  //     {JSON.stringify(messages)}
  //   </>
  // );

  return (
    <>
      <h5 className="text-muted py-2 m-0 border-bottom">
        {currChatPartner.fullname}
      </h5>
      <div className="flex-grow-1 p-2 mt-3 d-flex flex-column overflow-auto">
        {messages.length > 0 ? (
          <MessageList messages={messages} />
        ) : (
          <ContentCenteredDiv>No messages found</ContentCenteredDiv>
        )}
        <MessageBox receiverId={currChatPartner.id} />
      </div>
    </>
  );
}

function MessageList({ messages }) {
  const loggedInId = getLoggedInUserId();
  return (
    <div className="mb-2 flex-grow-1 overflow-auto d-flex gap-1 flex-column flex-column-reverse">
      {messages.map((msg) => {
        const sent = msg.senderId === loggedInId;
        return (
          <div
            className={`d-flex justify-content-${sent ? "end" : "start"}`}
            key={msg.id}
          >
            <div
              className={`p-2 rounded ${sent ? "bg-primary text-white" : "bg-body-secondary"}`}
              style={{ maxWidth: "400px" }}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MessageBox({ receiverId }) {
  const messageRef = useRef(null);
  const { wsSend } = useContext(WebsocketContext);

  function sendMessage(e) {
    e?.preventDefault();
    const text = messageRef.current?.value.trim();
    if (!text || text.length === 0) return;
    if (wsSend === undefined) {
      console.error("wsSend === undefined, cannot send msg.");
      return;
    }
    wsSend(
      JSON.stringify({
        msgType: "chatMsgSend",
        msgData: {
          receiverId: receiverId,
          text: text,
          timestamp: new Date().toISOString(),
        },
      }),
    );
    console.log("Sending message", text);
    messageRef.current.value = "";
  }

  const sendMessageOnEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="input-group p-2 gap-2 d-flex">
      <input
        type="text"
        className="form-control"
        placeholder="Type a message..."
        ref={messageRef}
        autoComplete="off"
        autoFocus
        onKeyDown={sendMessageOnEnterKey}
      />
      <div className="input-group-append">
        <button className="btn btn-primary" type="button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>

    // <form
    //   onSubmit={sendMessage}
    //   className="flex items-stretch gap-2 h-full px-2 pt-2"
    // >
    //   <textarea
    //     placeholder="Aa"
    //     ref={messageRef}
    //     autoComplete="off"
    //     autoFocus
    //     onKeyDown={sendMessageOnEnterKey}
    //     className="w-full py-1 px-2 outline-none border border-gray-400"
    //   />
    //   <button className="w-[80px] bg-[#f1f1f5] border border-gray-400 p-2 active:bg-[#e1e1e5]">
    //     Send
    //   </button>
    // </form>
  );
}
