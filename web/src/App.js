import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import InserirMaquina from "./pages/InserirMaquina";
import Login from './pages/Login';
import Register from './pages/Register';
import CommentPage from './pages/CommentPage';

function App() {
  return (
    <div> 
      <Routes>
        <Route exact path='/' element={<Home />}/>
        <Route exact path='/registrar' element={<Register />}/>
        <Route exact path='/login' element={<Login />}/>
        <Route exact path='/addpedido' element={<InserirMaquina />}/>
        <Route exact path='/info_pedido/:id_maq' element={<CommentPage />}/>
      </Routes>
    </div>
  );
}

export default App;
