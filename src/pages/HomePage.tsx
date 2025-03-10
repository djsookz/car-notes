import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState<any>(null);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        console.log(user);
      }
    });
  }, [auth]);

  return (
    <div className="Home-Container">
      <Navigation />
      <div>
        <h1>Добре дошли в сайта!</h1>
      </div>
    </div>
  );
};

export default HomePage;
