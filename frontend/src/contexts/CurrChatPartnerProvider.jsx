import { createContext, useEffect, useState } from "react";

export const CurrChatPartnerContext = createContext({
  currChatPartner: undefined,
  setCurrChatPartner: undefined,
});

export default function CurrChatPartnerProvider({ children }) {
  const [partner, setPartner] = useState(() => {
    const data = localStorage.getItem("currChatPartner");
    return data ? JSON.parse(data) : undefined;
  });

  // Store to localStorage if changed
  useEffect(() => {
    partner && localStorage.setItem("currChatPartner", JSON.stringify(partner));
  }, [partner]);

  return (
    <CurrChatPartnerContext.Provider
      value={{
        currChatPartner: partner,
        setCurrChatPartner: setPartner,
      }}
    >
      {children}
    </CurrChatPartnerContext.Provider>
  );
}
