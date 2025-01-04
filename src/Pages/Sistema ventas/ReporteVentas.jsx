import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { Table } from 'antd';

const ReporteVentas = () => {
  // Declaración de los estados `reportes` y `dataCaja` usando `useState`.
  // `reportes` es un arreglo que almacenará los datos de los reportes de ventas obtenidos de Firestore.
  // `dataCaja` almacenará los datos de la caja obtenidos desde Firestore.
  const [reportes, setReportes] = useState([]); // Inicializa el estado de reportes como un arreglo vacío.
  const [dataCaja, setDataCaja] = useState([]); // Inicializa el estado de la caja como un arreglo vacío.
  // `ventaCounter` es una variable que lleva el conteo de las ventas. 
  // Es útil para asignar identificadores o números únicos a las ventas durante el procesamiento de los datos.
  let ventaCounter = 0;
  // Definimos los datos que tendra la tabla
  const columns = [
    {
      title: 'Venta',
      dataIndex: 'venta',
      key: 'venta',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      // sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
    },
    {
      title: 'Hora',
      dataIndex: 'hora',
      // sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
    },
    {
      title: 'Producto',
      dataIndex: 'NombreProducto',
      key: 'NombreProducto',
    },
    {
      title: 'Precio unitario',
      dataIndex: 'PrecioUnitario',
      key: 'PrecioUnitario',
      render: (text) => text ? `${text} Bs` : '',
    },
    {
      title: 'Cantidad vendida',
      dataIndex: 'CantidadVendida',
      key: 'CantidadVendida',
      render: (text) => text ? `${text} unidades` : '',
    },
    {
      title: 'Sub-total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => text ? `${text} Bs` : '',
    },
    {
      title: 'Total venta',
      dataIndex: 'totalVenta',
      key: 'totalVenta',
      render: (text) => `${text}`,
    },
    {
      title: 'Pago del cliente',
      dataIndex: 'pagoCliente',
      // key: 'total',
      render: (text) => `${text}`,
    },
    {
      title: 'Cambio dado',
      dataIndex: 'cambioCliente',
      key: 'total',
      render: (text) => `${text}`,
    },
    {
      title: 'Monto en caja',
      dataIndex: 'cajaActual',
      key: 'total',
      render: (text) => `${text}`,
    },

  ];

  // El primer useEffect se ejecuta cuando el componente se monta (debido al arreglo vacío []),
  // buscando los datos de una caja específica por su ID en Firestore.
  useEffect(() => {
    const fetchData2 = async () => {
      const idCaja = sessionStorage.getItem('id'); // ID de la caja que se quiere consultar.
      const docRef = doc(db, "HistorialAperturaCaja", idCaja); // Referencia al documento de la caja en la colección "HistorialAperturaCaja".
      const docSnap = await getDoc(docRef); // Obtención del documento desde Firestore.

      // Si el documento existe, se establece el estado `dataCaja` con los datos del documento.
      if (docSnap.exists()) {
        const data = { ...docSnap.data(), id: docSnap.id }; // Se agrega el ID del documento a los datos.
        setDataCaja(data); // Actualización del estado con los datos de la caja.
      } else {
        console.log("No such document!"); // Si no se encuentra el documento, se muestra un mensaje en consola.
      }
    };
    fetchData2(); // Se llama a la función fetchData2 para obtener los datos de la caja.
  }, []); // Solo se ejecuta una vez cuando el componente se monta.

  // `flattenedData` transforma los datos de `reportes` en un formato más sencillo para su visualización.
  // Usa `flatMap` para aplanar la estructura de datos y organizar la información en filas.
  const flattenedData = reportes.flatMap((reporte, index) =>
    reporte.productos.map((producto, prodIndex) => {
      // Crea una fila vacía al inicio con solo la caja actual y valores nulos para el resto de los campos.
      if (index === 0 && prodIndex === 0) {
        return {
          id: reporte.id,
          venta: "",
          fecha: "",
          hora: "",
          NombreProducto: "",
          PrecioUnitario: "",
          CantidadInicial: "",
          CantidadVendida: "",
          total: "",
          pagoCliente: "",
          cambioCliente: "",
          totalVenta: "",
          cajaActual: `${reporte.CajaActual} Bs`, // Muestra el valor de la caja actual.
        };
      }

      const commonFields = {
        id: `${reporte.id}-${producto.NombreProducto}`,
        venta: `Venta ${ventaCounter + index}`, // Contador de ventas que aumenta con cada venta.
        fecha: reporte.Fecha,
        hora: reporte.Hora,
        NombreProducto: producto.NombreProducto,
        PrecioUnitario: producto.PrecioUnitario,
        CantidadInicial: producto.CantidadInicial,
        CantidadVendida: producto.CantidadVendida,
        total: producto.total,
      };

      // Para todos los productos después de la primera fila vacía, agrega más detalles.
      if (index !== 0 || prodIndex !== 0) {
        if (prodIndex === 0) {
          return {
            ...commonFields,
            pagoCliente: `${reporte.PagoCliente} Bs`, // Pago realizado por el cliente.
            cambioCliente: `${reporte.CambioCliente} Bs`, // Cambio dado al cliente.
            cajaActual: `${reporte.CajaActual} Bs`, // Valor de la caja actual después de la venta.
            totalVenta: `${reporte.TotalVenta} Bs`, // Total de la venta.
          };
        }

        // Para los productos restantes, no se muestran los campos de pago y cambio.
        return {
          ...commonFields,
          pagoCliente: "",
          cambioCliente: "",
          cajaActual: "",
          totalVenta: "",
        };
      }
    })
  );

  // El segundo useEffect se ejecuta cuando `dataCaja` cambia (cuando se obtienen los datos de la caja),
  // y busca los reportes de ventas asociados a esa caja.
  useEffect(() => {
    if (Object.keys(dataCaja).length > 0) { // Solo se ejecuta si se han cargado los datos de la caja.
      const fetchData = async () => {
        // Obtiene todos los documentos de la colección "ReportesVentas" desde Firestore.
        const querySnapshot = await getDocs(collection(db, "ReportesVentas"));
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(), // Extrae los datos del documento.
          id: doc.id, // Agrega el ID del documento.
          FechaHora: new Date(`${doc.data().Fecha}T${doc.data().Hora}`) // Combina la fecha y hora en un solo campo Date.
        }));

        // Ordena los reportes por fecha y hora de manera ascendente.
        dataList.sort((a, b) => new Date(a.FechaHora) - new Date(b.FechaHora));
        // Filtra los reportes que corresponden a la caja actual.
        const dataFiltrado = dataList.filter(item => item.IdCaja === dataCaja.id);

        const montoInicial = dataCaja.MontoInicialCaja ?? 0; // Obtiene el monto inicial de la caja, si existe, o usa 0 por defecto.
        const emptyObject = {
          CajaActual: montoInicial, // Inicializa el valor de la caja actual con el monto inicial.
          productos: [{
            CantidadInicial: 90, // Inicializa una cantidad ficticia para el primer producto.
          }]
        };

        // Se agrega el objeto vacío al inicio del listado de reportes filtrados.
        dataFiltrado.unshift(emptyObject);
        // Se establece el estado `reportes` con la lista de reportes filtrada.
        setReportes(dataFiltrado);
      };
      fetchData(); // Llama a la función `fetchData` para obtener los reportes de ventas.
    };
  }, [flattenedData]); // Se ejecuta cada vez que cambia el estado `flattenedData` (probablemente relacionado con los reportes).




  return (
    <div style={{ padding: '20px' }}>
      <h2 className="form-titleProductos">Reporte de ventas</h2>
      <div className='parentMostrar'>
        <Table
          dataSource={flattenedData.map((data, index) => ({
            ...data,
            key: index,
          }))}
          columns={columns}
          rowKey={(record) => `${record.id}-${record.NombreProducto}`}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}  // Establece el ancho máximo de la tabla, ajusta según lo necesario
          size="middle"
          bordered
          style={{ maxWidth: '100%' }}  // Asegura que la tabla no se desborde
        />
      </div>
    </div>
  );
};

export default ReporteVentas;
