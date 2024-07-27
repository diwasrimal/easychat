import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaUserFriends, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import CurrChat from "../components/CurrChat";
import CurrChatPartnerProvider from "../contexts/CurrChatPartnerProvider";
import { ChatPartnersProvider } from "../contexts/ChatPartnersProvider";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1 overflow-auto justify-content-center">
        <NavBar />
        <ChatPartnersProvider>
          <CurrChatPartnerProvider>
            <div
              className="col-3 border-end d-flex flex-column p-3"
              style={{ maxHeight: "100vh" }}
            >
              <Outlet />
            </div>
            <div
              className="col-8 d-flex flex-column p-3"
              style={{ maxHeight: "100vh" }}
            >
              <CurrChat />
            </div>
          </CurrChatPartnerProvider>
        </ChatPartnersProvider>
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <div
      className="border-end d-flex flex-column align-items-center py-3"
      style={{ width: "60px" }}
    >
      <NavLink to="/home/chats" className="text-dark" title="Chats">
        <FaHome size={24} className="mb-3" />
      </NavLink>

      <NavLink to="/home/people" className="text-dark" title="People">
        <FaUserFriends size={24} className="mb-3" />
      </NavLink>

      <NavLink to="#" className="text-dark" title="Settings">
        <FaCog size={24} className="mb-3" />
      </NavLink>

      <div className="mt-auto">
        <NavLink to="/logout" className={navClassNameSetter} title="Chats">
          <FaSignOutAlt size={24} className="text-danger mb-3" />
        </NavLink>
      </div>
    </div>
  );
}

function navClassNameSetter({ isActive }) {
  return isActive ? "bg-secondary" : "";
}
