import { NavLink } from "react-router-dom";
import ChatImage from "../assets/chat-picture.png";
export default function Welcome() {
  return (
    <main className="h-100 container">
      <div className="row h-100 d-flex justify-content-center align-items-center gap-4 p-4">
        <div className="col-md">
          <img
            id="futsal-playing-img"
            src={ChatImage}
            className="img-fluid"
            alt="Fustal playing"
          />
        </div>
        <div className="col-md text-center">
          <h1 className="">Welcome to EasyChat</h1>
          <p className="fs-4 m-4">
            Your Ultimate Destination for Seamless Communication!
          </p>
          <div className="d-flex justify-content-center gap-2 m-4">
            <NavLink to="/login">
              <button className="btn btn-lg btn-outline-primary">Login</button>
            </NavLink>
            <NavLink to="/register">
              <button className="btn btn-lg btn-primary">Register</button>
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
}
