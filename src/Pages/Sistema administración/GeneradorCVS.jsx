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
      var dataArray = querySnapshot.docs.map(doc => doc.data());

      if (seleccionOpciones === "Ventas") {

        const flattenedArray = dataArray.flatMap(obj =>
          obj.productos.map(producto => {
            const { productos, ...rest } = obj; // Extrae 'productos' y guarda el resto en 'rest'
            return {
              ...producto,
              ...rest // Copia todas las propiedades del objeto principal, excepto 'productos'
            };
          })
        );


        dataArray = flattenedArray;
        // console.log(flattenedArray);
      }

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
    if (dataArray.length === 0) return '';

    const keys = Object.keys(dataArray[0]);
    const header = keys.join(',');

    const rows = dataArray.map(obj =>
      keys.map(key => {
        let value = obj[key] ?? '';
        // Escapar comillas dobles y encerrar en comillas dobles si contiene comas, saltos de línea o comillas dobles
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        // Envolver las fechas en comillas dobles
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.test(value)) {
          value = '"' + value + '"';
        }
        return value;
      }).join(',')
    );

    return [header, ...rows].join('\n');
  };



  const existeAutocompletable = () => {
    if (seleccionOpciones === null) {
      return true;
    } else {
      return false
    }
  }

  return (
    <Space size="middle">
      <p>Datos: </p>
      <AutoComplete
        style={{ width: '100px' }} // Ajusta el ancho según tus necesidades
        options={[ { value: 'Ventas' }, { value: 'Cajas' }]}
        placeholder="seleccione..."
        value={seleccionOpciones}
        onChange={handleAutoCompleteChange} // Función que se ejecuta al cambiar el valor
      />

      <Button onClick={exportCSV} disabled={existeAutocompletable()} style={{ marginRight: 16 }}>Exportar CSV</Button>
    </Space>
  );
};

export default GeneradorCVS;