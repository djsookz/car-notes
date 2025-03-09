import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './Navigation.css'

const Navigation = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Извършваме излизането
      window.location.href = "/"; // Пренасочваме към началната страница
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="nav-container">
        <div className='nav-logo'>
            <h2>LOGO</h2>
        </div>
      
      
      <div className="nav-buttons">
        <Link to="/home" className="nav-link">
          <button className="nav-button">Начало</button>
        </Link>
        <Link to="/fuel" className="nav-link">
          <button className="nav-button">Добави гориво</button>
        </Link>
        <Link to="/repair" className="nav-link">
          <button className="nav-button">Ремонт</button>
        </Link>
        <Link to="/notes" className="nav-link">
          <button className="nav-button">Бележки</button>
        </Link>
        <Link to="/notifications" className="nav-link">
          <button className="nav-button">Известия</button>
        </Link>
        <Link to="/statistics" className="nav-link">
          <button className="nav-button">Графика</button>
        </Link>
      </div>
      <div className="profile-container">
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="profile-image" />
        ) : (
          <div className="default-image">П</div> // Default профилна снимка (инициал)
        )}
        <span className="username">{user ? user.displayName : 'Гост'}</span>
      <button onClick={handleSignOut} className="sign-out-button">Изход</button>
      </div>
    </div>
  );
};

export default Navigation;
