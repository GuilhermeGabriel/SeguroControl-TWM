import React from 'react';

import './styles.css';

import { doc, deleteDoc, getFirestore } from "firebase/firestore";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CommentIcon from '@mui/icons-material/Comment';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import { useAuth } from '../../providers/auth';
import { deleteObject, getStorage, ref } from 'firebase/storage';

function ItemComentario({ id, id_maq, uid, timestamp, urlImg, name, comentario }) {
  const { user, setUser } = useAuth();

  const handle_delete = async () => {
    const db = getFirestore();
    const storage = getStorage();
    if (window.confirm("Deseja deletar?")) {
      const imgRef = ref(storage, `imgs/${id}`);
      await deleteDoc(doc(db, "pedidos", id_maq, "comments", id));
      await deleteObject(imgRef);
    }
  }

  const dateFormatted = () => {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString();
    }
  }

  return (
    <div id='container_itemlista_paradas'>
      <div>
        <div className='item_parada_info'>
          <AccountCircleIcon /><b>{name}</b>
          <AccessTimeIcon />
          <b>
            {
              dateFormatted()
            }
          </b>
        </div>

        <div className='item_parada_info'>
          <CommentIcon />
          <div>{comentario}</div>
        </div>

        <div id='img_comment_container'>
          {urlImg &&
            <img src={urlImg} id='img_comment'></img>
          }
        </div>

        {(user.uid === uid) &&
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

export default ItemComentario;