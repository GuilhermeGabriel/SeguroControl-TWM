import React, { useState, useEffect } from 'react';
import './styles.css';
import { getFirestore, getDoc, doc, collection, setDoc, query, onSnapshot, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import Resizer from "react-image-file-resizer";

// Componentes
import Header from '../../components/Header';
import ItemComentario from '../../components/ItemComentario';

import Popup from '../../components/Popup';
import { Form, Field, Formik } from 'formik';

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../providers/auth';
import Button from '@mui/material/Button';

function CommentPage() {
  const { user, setUser } = useAuth();
  const { id_maq } = useParams();
  const [infoMaquina, setInfoMaquina] = useState({});
  const [pedidoData, setPedidoData] = useState({});

  const [img, setImg] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
    setImg('');
  }

  const [comentarios, setComentarios] = useState([]);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const chooseImage = async () => {
    var inputs = document.getElementById("image_file_input").getElementsByTagName('input');
    var file = inputs[0].files[0];

    if (file) {
      const image = await resizeFile(file);
      setImg(image);
    }
  }

  const onFicarResp = async () =>{
    if (window.confirm("Deseja ficar responsável?")) {
      const db = getFirestore();
      const storage = getStorage();

      const comment_id = doc(db, "pedidos", id_maq);

      await setDoc(comment_id, 
        { tecnico: user.name, status: 'Em-andamento' }, { merge: true });
    }
  }

  const onFinalizar = async () =>{
    if (window.confirm("Deseja finalizar")) {
      const db = getFirestore();
      const storage = getStorage();

      const comment_id = doc(db, "pedidos", id_maq);

      await setDoc(comment_id, 
        { status: 'Finalizado' }, { merge: true });
    }
  }

  useEffect(() => {
    const db = getFirestore();

    async function getComentariosData() {
      const q = query(
        collection(db, 'pedidos', id_maq, 'comments'),
        orderBy('timestamp', 'desc')
      );
      onSnapshot(q, querySnapshot => {
        setComentarios(querySnapshot.docs.map(doc => doc.data()));
      });
    }

    async function getPedidoData() {
      onSnapshot(doc(db, "pedidos", id_maq), (docSnap) =>  {
        setPedidoData(docSnap.data());
      });
    }

    getComentariosData();
    getPedidoData();
  }, [id_maq]);

  return (
    <div id='info_maq_container'>

      <div id='info_top'>
        <Header/>
      </div>

      {isOpen && <Popup
        content={<>
          <Formik
            initialValues={{}}
            onSubmit={async (values) => {
              const db = getFirestore();
              const storage = getStorage();

              const comment_id = doc(collection(db, "pedidos", id_maq, "comments"));

              if (img) {

                const imgRef = ref(storage, `imgs/${comment_id.id}`);
                await uploadString(imgRef, img, 'data_url');

                const urlImg = await getDownloadURL(ref(storage, `imgs/${comment_id.id}`));

                await setDoc(comment_id, {
                  ...values,
                  id: comment_id.id,
                  uid: user.uid,
                  name: user.name,
                  urlImg,
                  timestamp: serverTimestamp(),
                });
              }else{
                await setDoc(comment_id, {
                  ...values,
                  id: comment_id.id,
                  uid: user.uid,
                  name: user.name,
                  timestamp: serverTimestamp(),
                });
              }

              setIsOpen(!isOpen);
            }}
          >
            <Form id='inserir_desc_form'>
              <div id='inserir_desc_title'>Inserir Comentário</div>

              <div>
                <Button
                  id='image_file_input'
                  variant="outlined"
                  component="label"
                  size='small'
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Enviar foto
                  <input
                    onChange={chooseImage}
                    type="file"
                    accept="image/*"
                    hidden
                  />
                </Button>
              </div>
              <img id='img_comment_upload' src={img}></img>

              <div id='title_commer_add'>Comentário:</div>
              <Field as="textarea" id='comment_field' name='comentario'></Field>

              <Button variant="contained" type="submit">Adicionar Comentário</Button>
            </Form>
          </Formik>
        </>}
        handleClose={togglePopup}
      />}

      <div id='rel_hist_cont'>
        <h1 id='info_ped_com'>Informações do pedido</h1>
        <Button variant='text' id='rel_maq_add_parada' onClick={togglePopup}>Adicionar comentário</Button>
        {
          (user.type==='tecnico'&&pedidoData.tecnico==='nenhum') 
            ?
            <Button variant='text' id='rel_maq_add_parada' onClick={onFicarResp}>Ficar responsável</Button>
            :
            (pedidoData.status==='Finalizado')
            ?
            <Button variant='text' disableRipple  id='rel_maq_add_parada'>Finalizado!</Button>
            :
            <span>
              {user.name === pedidoData.tecnico &&
                <Button variant='text' onClick={onFinalizar}>Finalizar</Button>
              }
              <Button variant='text' disableRipple  id='rel_maq_add_parada'>Responsável:&ensp;<b>{pedidoData.tecnico}</b></Button>
            </span>
        }
      </div>

      <div id='info_maq_container_bottom'>
        {
          comentarios.map(comentario => (
            <ItemComentario
              urlImg={comentario.urlImg}
              id={comentario.id}
              uid={comentario.uid}
              id_maq={id_maq}
              name={comentario.name}
              comentario={comentario.comentario}
              timestamp={comentario.timestamp}
            />
          ))
        }
      </div>
    </div>
  )
}

export default CommentPage;