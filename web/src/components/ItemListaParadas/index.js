import React from 'react';

import './styles.css';

import { doc, deleteDoc, getFirestore } from "firebase/firestore";

import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import { useAuth } from '../../providers/auth';

function ItemListaParadas({ id, id_maq, codigo, descricao, comentario, inicio, fim }) {
  const { user, setUser } = useAuth();

  const getDateFormmated = (date_rec) => {
    let date = new Date(date_rec);
    return `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const time_between = () => {
    if (inicio && fim) {
      let diff = new Date(fim).getTime() / 1000 - new Date(inicio).getTime() / 1000;
      let horas = Math.trunc(diff / 3600);
      let minutos = (diff / 60) % 60;
      return `${horas}h${minutos}min`;
    }
  }

  const handle_delete = async () => {
    const db = getFirestore();
    if (window.confirm("Deseja deletar?")) {
      await deleteDoc(doc(db, "machines", id_maq, "stops", id));
    }
  }

  return (
    <div id='container_itemlista_paradas'>
      <div>
        <div id='item_lista_paradas_horas'>
          <b>
            <EventOutlinedIcon /> ({getDateFormmated(inicio)})
            -

            ({getDateFormmated(fim)})

            <AccessTimeOutlinedIcon /> {time_between()}

          </b>
        </div>
        <div className='item_parada_info'><InfoOutlinedIcon /><b>Código:</b> {codigo}</div>
        <div className='item_parada_info'><DescriptionOutlinedIcon /> <b>Descrição:</b> {descricao}</div>
        <div className='item_parada_info'><CommentOutlinedIcon /><b>Comentario:</b> {comentario}</div>

        {user.role == 'admin' &&
          <Button
            variant="text"
            style={{ color: 'red', width: '100%' }}
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={handle_delete}>
            Delete
          </Button>
        }
      </div>
    </div>
  );
}

export default ItemListaParadas;