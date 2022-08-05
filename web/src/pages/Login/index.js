import React, { useEffect, useState } from 'react';

import './styles.css';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../providers/auth';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebase';
import {
  doc,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@mui/material/Button';

import logo from '../../assets/logo.png';

function Login() {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    if (user.uid) {
      navigate('/');
    }
  }, [user]);

  const login = async (e) => {
    e.preventDefault();

    if (email.trim().length === 0) {
      alert("Email não deve ser vazio!");
      return;
    }

    if (password.trim().length === 0) {
      alert("Senha não deve ser vazia!");
      return;
    }

    try {
      toast("Fazendo login...", {
        theme: 'colored',
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true
      });
      const result = await signInWithEmailAndPassword(auth, email, password);

      user.uid = result.user.uid;
      user.email = result.user.email;
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const docSnapshot = await getDoc(userRef);

      user.name = docSnapshot.data().name;
      user.photoUrl = docSnapshot.data().photoUrl;
      user.role = docSnapshot.data().role;
      user.type = docSnapshot.data().type;

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/invalid-email') {
        alert('Email inválido!');
        return;
      }

      if (errorCode === 'auth/user-not-found') {
        alert('Usuário não encontrado!');
        return;
      }

      if (errorCode === 'auth/wrong-password') {
        alert('Senha e/ou email incorretos!');
        return;
      }

      if (errorCode === 'auth/too-many-requests') {
        alert('Muitas tentativas incorretas, aguarde um momento!');
        return;
      }

      alert(errorCode, errorMessage);
    }
  }

  return (
    <div id='login_container'>
      <ToastContainer />
      <form>
        <div id='logo_container'>
          <img id='login_logo' src={logo} />
          <h2>SeguroControl</h2>
        </div>

        <input
          type='email'
          placeholder='Email'
          onChange={e => setEmail(e.target.value)}
        ></input>

        <input
          type='password'
          placeholder='Senha'
          onChange={e => setPassword(e.target.value)}
        ></input>
        <div id='login_form_buttons'>
          <Button type='submit' variant='contained' onClick={(e) => login(e)}>Entrar</Button>
        </div>

        <div id='login_nova_conta'>
          <p>Não tem conta?&nbsp;</p><Link to='/registrar'>Criar nova conta</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;