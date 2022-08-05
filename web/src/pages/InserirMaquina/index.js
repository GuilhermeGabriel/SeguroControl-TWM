import React, { useEffect, useState } from 'react';
import './styles.css';

// Firebase e routes
import { useAuth } from '../../providers/auth';
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from 'react-router-dom';

// Form
import { Formik, Field, Form } from "formik";

// Material UI
import Button from '@mui/material/Button';

function InserirMaquina() {
  const { user, setUser } = useAuth();
  const { id_maq } = useParams();
  const [infoMaquina, setInfoMaquina] = useState({});

  let navigate = useNavigate();

  return (
    <div className='container_insererirmaquina'>
      <Formik
        initialValues={{...infoMaquina}}
        onSubmit={async (values) => {
          const db = getFirestore();
          console.log(user.uid);

          const id = doc(collection(db, "pedidos")).id;
          const id_ref = doc(db, "pedidos", id);
          await setDoc(id_ref, {
            ...values,
            id_cliente: user.uid,
            id,
            status: 'Pendente',
            tecnico: 'nenhum',
            cliente: user.name,
            timestamp: serverTimestamp(),
          });

          navigate(-1);    
        }}>
        <Form id='inserir_maq_form'>
          <div id='inserir_maq_title'>Inserir pedido de conserto.</div>

          <label>Equipamento: </label>
          <Field type="text" name='equipamento'></Field>

          <label>Marca: </label>
          <Field type="text" name='marca'></Field>

          <label>Valor: </label>
          <Field type="text" min="1" step="any" name='valor'></Field>

          <label>Ano de fabricação: </label>
          <Field type="date" name='data_fabricacao'></Field>

          <Button variant='contained' type="submit">Registrar</Button>
        </Form>
      </Formik>

    </div>
  );
}

export default InserirMaquina;