import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase/config";

const LoginButton = () => {
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return <button onClick={handleLogin}>Вход с Google</button>;
};

export default LoginButton;
