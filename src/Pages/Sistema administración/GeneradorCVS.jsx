import React, { useEffect, useState } from 'react';
import { Button, AutoComplete, Space } from 'antd';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';

const GeneradorCVS = () => {
  // Declaración de un estado llamado 'seleccionOpciones' con un valor inicial de 'null'
  const [seleccionOpciones, setSeleccionOpciones] = useState(null);

  // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

  // Función que maneja el cambio de valor en el campo de autocompletado
  const handleAutoCompleteChange = (value) => {
    setSeleccionOpciones(value);  // Actualiza el estado `seleccionOpciones` con el valor seleccionado
  };

  // Función asincrónica para exportar los datos seleccionados a un archivo CSV
  const exportCSV = async () => {
    // Se obtiene la lista actual basada en la opción seleccionada
    const ListaActual = getLista(seleccionOpciones);

    try {
      // Se realiza una consulta a la base de datos para obtener los documentos de la colección especificada
      const querySnapshot = await getDocs(collection(db, ListaActual));
      // Se mapea los documentos obtenidos a un array de datos
      var dataArray = querySnapshot.docs.map(doc => doc.data());

      // Si la opción seleccionada es "Ventas", se aplanan los datos de productos
      if (seleccionOpciones === "Ventas") {
        // Se aplana el array de productos de cada objeto en la lista
        const flattenedArray = dataArray.flatMap(obj =>
          obj.productos.map(producto => {
            const { productos, ...rest } = obj;  // Extrae 'productos' y guarda el resto en 'rest'
            return {
              ...producto,  // Añade las propiedades de 'producto'
              ...rest        // Añade las propiedades restantes del objeto principal
            };
          })
        );

        // Se reemplaza el array original con el array aplanado
        dataArray = flattenedArray;
      }

      // Se convierte el array de datos a formato CSV
      const csv = convertToCSV(dataArray);
      // Se crea un blob (objeto binario grande) con el contenido CSV y se especifica el tipo de archivo como 'text/csv'
      const blob = new Blob([csv], { type: 'text/csv' });
      // Se crea una URL temporal para el blob
      const url = window.URL.createObjectURL(blob);
      // Se crea un elemento de enlace (<a>) para la descarga
      const a = document.createElement('a');
      // Se asigna la URL temporal al atributo href del enlace
      a.href = url;
      // Se asigna el nombre del archivo descargable, utilizando la opción seleccionada para el nombre
      a.download = `${seleccionOpciones}.csv`;
      // Se añade el enlace al DOM
      document.body.appendChild(a);
      // Se programa un clic en el enlace para iniciar la descarga
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

  // Función que devuelve el nombre de la colección en Firestore según el nombre de la lista seleccionada
  const getLista = (nombreLista) => {
    if (nombreLista === "Clientes") {
      return "ListaClientes"; // Devuelve la colección 'ListaClientes' si la opción es "Clientes"
    } else if (nombreLista === "Ventas") {
      return "ReportesVentas"; // Devuelve la colección 'ReportesVentas' si la opción es "Ventas"
    } else {
      return "HistorialAperturaCaja"; // Devuelve la colección 'HistorialAperturaCaja' si no es ninguna de las anteriores
    }
  }

  // Función para convertir un array de objetos a formato CSV
  const convertToCSV = (dataArray) => {
    // Si el array está vacío, se retorna una cadena vacía
    if (dataArray.length === 0) return '';

    // Se obtienen las claves (propiedades) del primer objeto del array para el encabezado
    const keys = Object.keys(dataArray[0]);
    const header = keys.join(',');  // Se une las claves con una coma para formar el encabezado

    // Se mapea cada objeto del array a una fila en formato CSV
    const rows = dataArray.map(obj =>
      keys.map(key => {
        let value = obj[key] ?? '';  // Obtiene el valor de la propiedad o usa una cadena vacía si no existe
        // Si el valor es un string que contiene comas, saltos de línea o comillas dobles, se escaparán y se envolverán entre comillas dobles
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
          value = '"' + value.replace(/"/g, '""') + '"';  // Escapa las comillas dobles reemplazándolas por dos comillas dobles
        }
        // Si el valor es una fecha (en formato 'YYYY-MM-DD'), también se envuelve entre comillas dobles
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.test(value)) {
          value = '"' + value + '"';
        }
        return value;
      }).join(',')  // Se unen los valores de cada propiedad en una fila separada por comas
    );

    // Se une el encabezado y las filas con saltos de línea y se devuelve el CSV como una cadena
    return [header, ...rows].join('\n');
  };

  // Función que verifica si hay una opción seleccionada en el autocompletado
  const existeAutocompletable = () => {
    if (seleccionOpciones === null) {
      return true;  // Si no se ha seleccionado ninguna opción, retorna 'true' indicando que no hay nada seleccionado
    } else {
      return false;  // Si hay una opción seleccionada, retorna 'false'
    }
  }

  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

  return (
    <Space size="middle">
      <p>Datos: </p>
      <AutoComplete
        style={{ width: '100px' }} // Ajusta el ancho según tus necesidades
        options={[{ value: 'Ventas' }, { value: 'Cajas' }]}
        placeholder="seleccione..."
        value={seleccionOpciones}
        onChange={handleAutoCompleteChange} // Función que se ejecuta al cambiar el valor
      />

      <Button onClick={exportCSV} disabled={existeAutocompletable()} style={{ marginRight: 16 }}>Exportar CSV</Button>
    </Space>
  );
};

export default GeneradorCVS;