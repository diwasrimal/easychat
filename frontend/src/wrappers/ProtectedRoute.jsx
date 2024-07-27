import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { loggedIn } = useContext(AuthContext);
  if (!loggedIn) return <Navigate to="/" />;

  return <>{children}</>;
}
