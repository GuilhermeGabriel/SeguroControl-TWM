import React, { useState, useEffect } from 'react';
import './styles.css';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { auth } from '../../services/firebase';
import { useAuth } from '../../providers/auth';
import { Navigate, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [type, setType] = useState('cliente');

  const { user, setUser } = useAuth();
  let navigate = useNavigate();

  useEffect(()=>{
    if(user.uid){
      navigate('/');
    }
  },[user]);

  const register = async (e) => {
    e.preventDefault();

    if (name.trim().length === 0) {
      alert("Identificação não deve ser vazio!");
      return;
    }

    if (email.trim().length === 0) {
      alert("Email não deve ser vazio!");
      return;
    }

    if (password.trim().length === 0 || passwordConfirm.trim().length === 0) {
      alert("Senhas não deve ser vazias!");
      return;
    }

    if (password.trim() !== passwordConfirm.trim()) {
      alert("Senhas não não correspondem!");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      user.uid = result.user.uid;
      user.name = name;
      user.email = result.user.email;
      user.photoUrl = result.user.photoURL;
      user.type = type;
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      const db = getFirestore();
      const userRef = doc(db, `users/${user.uid}`);
      await setDoc(userRef, {
        ...user,
        password
      });

      navigate('/');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/weak-password') {
        alert('Senha fraca!');
        return;
      }

      if (errorCode === 'auth/invalid-email') {
        alert('Email inválido!');
        return;
      }

      if (errorCode === 'auth/email-already-in-use') {
        alert('Email já em uso!');
        return;
      }

      alert(errorCode + errorMessage);
    }

  };

  return (
    <div id='register_container'>
      <form>
        <h2> Registrar nova conta</h2>

        <label>Identificação</label>
        <input
          type='text'
          placeholder='Nome'
          onChange={e => setName(e.target.value)}
        ></input>

        <label>Email</label>
        <input
          type='email'
          placeholder='Email'
          onChange={e => setEmail(e.target.value)}
        ></input>

        <label>O que você é?</label>
        <select 
          id='register_select_tipo'
          name="area"
          onChange={e => setType(e.target.value)}
          >
          <option value="cliente">Cliente</option>
          <option value="tecnico">Técnico</option>
        </select>

        <label>Crie uma senha</label>
        <input
          type='password'
          placeholder='Senha'
          onChange={e => setPassword(e.target.value)}
        ></input>

        <label>Digite a senha novamente</label>
        <input
          type='password'
          placeholder='Senha'
          onChange={e => setPasswordConfirm(e.target.value)}></input>

        <div id='register_form_buttons'>
          <Button
            type='submit'
            variant='contained'
            onClick={(e) => register(e)}
          >Registrar</Button>
        </div>
      </form>
    </div>
  );
}

export default Login;