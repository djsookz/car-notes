import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase/config";  // Увери се, че използваш правилния auth

const LoginButton = () => {
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);  // Използвай signInWithRedirect
  };

  return <button onClick={handleLogin}>Вход с Google</button>;
};

export default LoginButton;
