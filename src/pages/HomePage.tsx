import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import './HomePage.css'

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
  }, [auth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Извършваме излизането
      navigate('/'); // След излизането пренасочваме към началната страница
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className='Home-Container' >
      <Navigation />
      <h1>Добре дошли в сайта!</h1>
      


      
    </div>
  );
};

export default HomePage;
