import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "./Navigation.css";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={`nav-container ${menuOpen ? "open" : ""}`}>
      <div className="nav-logo">
        <h2>LOGO</h2>
      </div>
  
      
      <button className="hamburger-menu" onClick={toggleMenu}>{menuOpen ? '×' : '☰'}</button>
  
      <div className={`nav-buttons ${menuOpen ? "active" : ""}`}>
        <Link to="/home" className="nav-link">
          <button className="nav-button">Начало</button>
        </Link>
        <Link to="/fuel" className="nav-link">
          <button className="nav-button">Добави гориво</button>
        </Link>
        <Link to="/repair" className="nav-link">
          <button className="nav-button">Ремонт</button>
        </Link>
        <Link to="/documents" className="nav-link">
          <button className="nav-button">Документи</button>
        </Link>
        <Link to="/notifications" className="nav-link">
          <button className="nav-button">Известия</button>
        </Link>
        <Link to="/statistics" className="nav-link">
          <button className="nav-button">Графика</button>
        </Link>
      </div>
  
      {/* Преместено тук */}
      <div className={`profile-container ${menuOpen ? "active" : ""}`}>
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="profile-image" />
        ) : (
          <div className="default-image">П</div>
        )}
        <span className="username">{user ? user.displayName : "Гост"}</span>
        <button onClick={handleSignOut} className="sign-out-button">
          Изход
        </button>
      </div>
    </div>
  );
  
};

export default Navigation;
