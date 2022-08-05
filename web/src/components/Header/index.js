import React, { useState, useEffect } from 'react';
import './styles.css';
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from '../../providers/auth';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import Button from '@mui/material/Button';

function Header() {  
  const { user, setUser } = useAuth();
  let navigate = useNavigate();

  const sign_out = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser({});
      navigate("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div id='home_title'>
      <div id='home-logo-title'>
        <img id='home_logo' src={logo} />
        <h2>Seguro Control</h2>
      </div>
   
      <div id='home_info_sair'>
        <div id='home_name'>
        {(user.type === 'cliente') ? 'cliente' : 'técnico'}
        @{user.name}</div>
        <Button variant='text' id='home_sair' onClick={() => sign_out()}>Sair</Button>
      </div>
    </div>
  )
}

export default Header;