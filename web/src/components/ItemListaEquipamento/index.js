import React from 'react';
import './styles.css';

import { useNavigate } from 'react-router-dom';

import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

function ItemListaEquipamento({id, cliente, equipamento, status, dimensoes, marca, data_fabricacao, tecnico, data_pedido}) {
  let navigate = useNavigate();

  const goToInfoMaq = () => {
    navigate(`/info_pedido/${id}`);
  };

  return (
    <div id='item_lista_cotainer' onClick={() => goToInfoMaq()} 
      className={
          (status==='Em-andamento') 
          ? 
          'container_itemlista_and'
          :
          (status==='Finalizado')
          ? 
          'container_itemlista_fin' 
          :
          'container_itemlista_pen' 
      } 
    >
      <div>
        <div id='item_lista_title_machine_top'>
          <div id='item_align_title'>
            <InfoIcon/> Status: <b>{status}</b>
          </div>
          <div id='item_align_title'>
            <AccessTimeFilledIcon/><b>{
              new Date(data_pedido.seconds * 1000).toLocaleDateString()
            }</b>
            
          </div>
        </div>

        <div id='item_lista_title_machine'> 
          <EngineeringIcon/>Técnico:<b>{tecnico}</b>
        </div>

        <div id='item_lista_title_machine'>
          <PrecisionManufacturingOutlinedIcon/> Equipamento: <b>{equipamento}</b>
        </div>
        
        <div id='item_lista_title_machine'> 
          <WarehouseOutlinedIcon/> Marca: <b>{marca}</b>
        </div>

        <div id='item_lista_title_machine'> 
          <LocationOnOutlinedIcon/>Data fabricação:<b>{data_fabricacao}</b>
        </div>

        <div id='item_lista_title_machine'> 
          <AccountCircleIcon/>Cliente:<b>{cliente}</b>
        </div>

      </div>
    </div>
  );
}

export default ItemListaEquipamento;