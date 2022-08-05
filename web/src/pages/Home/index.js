import React, { useState, useEffect } from 'react';
import './styles.css';

// Firebase
import { getFirestore, query, collection, onSnapshot, where, orderBy } from 'firebase/firestore';

// Auth and Routes
import { useAuth } from '../../providers/auth';
import { Link, useNavigate } from 'react-router-dom';

// Material UI
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

// Componentes
import Header from '../../components/Header';
import ItemListaEquipamento from '../../components/ItemListaEquipamento';

function Home() {
  const { user, setUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    if (!user.uid) navigate('/login');
  }, [user]);

  useEffect(() => {
    const db = getFirestore();

    async function getPedidosCliente() {
      const q = query(
        collection(db, 'pedidos'),
        orderBy("timestamp", "desc"),
        where("id_cliente", "==", user.uid)
      );

      onSnapshot(q, querySnapshot => {
        setPedidos(querySnapshot.docs.map(doc => doc.data()));
      });
    }

    async function getTodosPedidos() {
      const q = query(
        collection(db, 'pedidos'),
        orderBy("timestamp", "desc")
      );

      onSnapshot(q, querySnapshot => {
        setPedidos(querySnapshot.docs.map(doc => doc.data()));
      });
    }

    if(user.type==='cliente'){
      getPedidosCliente();
    }else{
      getTodosPedidos();
    }
  }, []);

  return (
    <div id='home_container'>
      <Header />

      <div id='home_menu'>
        
        {(user.type==='cliente') ? 
          <h2>Meus pedidos</h2>
          :
          <h2>Todos os pedidos</h2>
        }

        <div className='buttons'>
          {user.type === 'cliente' &&
            <Link style={{ textDecoration: 'none' }} to='/addpedido'>
              <Button
                startIcon={<AddIcon />}
                variant='outlined'
                id='home_add_maq_button'>
                Novo pedido
              </Button>
            </Link>
          }
        </div>
      </div>

      <div className='lista'>


        {
          pedidos.map(pedido => 
            <ItemListaEquipamento
              key={pedido.id}
              id={pedido.id}
              data_pedido={pedido.timestamp}
              name={pedido.codigo}
              marca={pedido.marca}
              equipamento={pedido.equipamento}
              data_fabricacao={pedido.data_fabricacao}
              status={pedido.status}
              cliente={pedido.cliente}
              tecnico={pedido.tecnico}
            />
          )
        }
      </div>
    </div>
  )
}

export default Home;