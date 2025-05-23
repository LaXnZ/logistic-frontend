import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

function Callback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.signinRedirectCallback()
      .then(() => navigate("/dashboard"))
      .catch((error) => {
        console.error("Login callback error", error);
        navigate("/");
      });
  }, [auth, navigate]);

  return <div>Processing login...</div>;
}

export default Callback;
