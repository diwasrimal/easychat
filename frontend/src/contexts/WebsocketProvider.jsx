import {
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const WebsocketContext = createContext({
  wsIsOpen: false,
  wsData: undefined,
  wsSend: undefined,
});

export function WebsocketProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const ws = useRef(null);

  useEffect(() => {
    // The browser's WebSocket API doesnot allow adding Authorization headers,
    // Thus we send it as a query param
    // More: https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api
    const token = localStorage.getItem("jwt");
    const socketProtocol = location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${socketProtocol}://${location.host}/ws?jwt=${token}`,
    );

    socket.onopen = () => {
      console.log("Opened ws connection");
      setOpen(true);
    };
    socket.onclose = () => {
      console.log("Closed ws connection");
      setOpen(false);
    };
    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("Got ws data:", parsed);
        setData(parsed);
      } catch (err) {
        console.log("Error parsing ws msg as json", err);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebsocketContext.Provider
      value={{
        wsIsOpen: open,
        wsData: data,
        wsSend: ws.current?.send.bind(ws.current),
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
}
