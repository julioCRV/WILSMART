import React, { useEffect, useState } from 'react';
import { Button, AutoComplete, Space } from 'antd';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';

const GeneradorCVS = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAutoCompleteChange = (value) => {
    setSelectedOption(value); // Actualiza el estado con el valor seleccionado
  };
  
  const exportCSV = async () => {
    const ListaActual = getLista(selectedOption);
    try {
      const querySnapshot = await getDocs(collection(db, ListaActual));
      const dataArray = querySnapshot.docs.map(doc => doc.data());

      const csv = convertToCSV(dataArray);

      // Crear un enlace temporal y descargar el archivo CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedOption}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar datos como CSV:', error);
    }
  };

  const getLista = (nombreLista) => {
    if(nombreLista === "Clientes"){
      return "ListaClientes";
    }else if (nombreLista === "Ventas"){
      return "ReportesVentas";
    }else{
      return "HistorialAperturaCaja";
    }
  }

  const convertToCSV = (dataArray) => {
    const header = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(obj => Object.values(obj).join(','));
    return header + '\n' + rows.join('\n');
  };

  return (
    <Space size="middle">
      <p>Datos: </p>
      <AutoComplete
        style={{ width: '100px' }} // Ajusta el ancho según tus necesidades
        options={[{ value: 'Clientes' }, { value: 'Ventas' }, { value: 'Cajas' }]}
        placeholder="seleccione..."
        onChange={handleAutoCompleteChange} // Función que se ejecuta al cambiar el valor
      />

      <Button onClick={exportCSV} style={{ marginRight: 16 }}>Exportar CSV</Button>
    </Space>
  );
};

export default GeneradorCVS;