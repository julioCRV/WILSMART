import React, { useEffect, useState } from 'react';
import { Button, AutoComplete, Space } from 'antd';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';

const GeneradorCVS = () => {
  const [seleccionOpciones, setSeleccionOpciones] = useState(null);

  const handleAutoCompleteChange = (value) => {
    setSeleccionOpciones(value);
  };

  const exportCSV = async () => {
    // Se obtiene la lista actual basada en la opción seleccionada
    const ListaActual = getLista(seleccionOpciones);
    
    try {
      // Se realiza una consulta a la base de datos para obtener los documentos de la colección especificada
      const querySnapshot = await getDocs(collection(db, ListaActual));
      // Se mapea los documentos obtenidos a un array de datos
      const dataArray = querySnapshot.docs.map(doc => doc.data());
      // Se convierte el array de datos a formato CSV
      const csv = convertToCSV(dataArray);
      // Se crea un blob (objeto binario grande) con el contenido CSV y se especifica el tipo de archivo como 'text/csv'
      const blob = new Blob([csv], { type: 'text/csv' });
      // Se crea una URL temporal para el blob
      const url = window.URL.createObjectURL(blob);
      // Se crea un elemento de enlace (<a>)
      const a = document.createElement('a');
      // Se asigna la URL temporal al atributo href del enlace
      a.href = url;
      // Se asigna el nombre del archivo descargable, utilizando la opción seleccionada para el nombre
      a.download = `${seleccionOpciones}.csv`;
      // Se añade el enlace al DOM
      document.body.appendChild(a);
      // Se Programa un clic en el enlace para iniciar la descarga
      a.click();
      // Se elimina el enlace del DOM
      document.body.removeChild(a);
      // Se restablece la opción seleccionada a null (o su valor inicial)
      setSeleccionOpciones(null);
    } catch (error) {
      // Se captura y muestra cualquier error que ocurra durante el proceso de exportación
      console.error('Error al exportar datos como CSV:', error);
    }
  };
  

  const getLista = (nombreLista) => {
    if (nombreLista === "Clientes") {
      return "ListaClientes";
    } else if (nombreLista === "Ventas") {
      return "ReportesVentas";
    } else {
      return "HistorialAperturaCaja";
    }
  }

  const convertToCSV = (dataArray) => {
    const header = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(obj => Object.values(obj).join(','));
    return header + '\n' + rows.join('\n');
  };

  const existeAutocompletable = () => {
    if(seleccionOpciones === null){
      return true;
    }else{
      return false
    }
  }

  return (
    <Space size="middle">
      <p>Datos: </p>
      <AutoComplete
        style={{ width: '100px' }} // Ajusta el ancho según tus necesidades
        options={[{ value: 'Clientes' }, { value: 'Ventas' }, { value: 'Cajas' }]}
        placeholder="seleccione..."
        value={seleccionOpciones}
        onChange={handleAutoCompleteChange} // Función que se ejecuta al cambiar el valor
      />

      <Button onClick={exportCSV} disabled={existeAutocompletable()} style={{ marginRight: 16 }}>Exportar CSV</Button>
    </Space>
  );
};

export default GeneradorCVS;