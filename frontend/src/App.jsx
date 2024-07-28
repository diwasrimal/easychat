import { useContext } from "react";
import { AuthContext } from "./contexts/AuthProvider";
import Loading from "./components/Loading.jsx";
import ContentCenteredDiv from "./components/ContentCenteredDiv.jsx";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function App() {
  const { loggedIn, checking } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      sessionStorage.clear();
    };
  }, []);

  if (checking) {
    return (
      <ContentCenteredDiv>
        <Loading />
      </ContentCenteredDiv>
    );
  }

  return <Navigate to={loggedIn ? "/home" : "/welcome"} />;
}
