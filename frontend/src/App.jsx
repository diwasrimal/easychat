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

  console.log("<App />");

  if (checking) {
    return (
      <ContentCenteredDiv>
        <Loading />
      </ContentCenteredDiv>
    );
  }

  if (loggedIn) {
    console.log("user logged in, navigating to dasboard");
  } else {
    console.log("user not logged in navigating to welcome screen");
  }

  return <Navigate to={loggedIn ? "/home" : "/welcome"} />;
}
