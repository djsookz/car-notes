import { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./NotificationsPage";
import "./LoginPage.css";

const LoginPage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate("/home");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Вход успешен:", user);
        setUser(user);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Грешка при вход:", error);
      });
  };

  return (
    <div className="container">
      <div className="login-container">
        {!user ? (
          <>
            <h1>Добре дошли!</h1>
            <p>Моля, влезте с Google:</p>
            <button onClick={handleLogin}>Вход с Google</button>
          </>
        ) : (
          <div>
            <h2>Добре дошли, {user.displayName}</h2>

            <p>Ти си логнат!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
