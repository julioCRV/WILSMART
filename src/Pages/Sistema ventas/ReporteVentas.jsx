import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase'; // Asegúrate de importar tu configuración de Firebase
import { Table } from 'antd';

const ReporteVentas = () => {
  const [reportes, setReportes] = useState([]);
  const [dataCaja, setDataCaja] = useState([]);

  useEffect(() => {
    const fetchData2 = async () => {
      // const idCaja = sessionStorage.getItem('id');
      const idCaja = 'xMFyO4kv4xDBTYOhvUsH';
      const docRef = doc(db, "HistorialAperturaCaja", idCaja);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { ...docSnap.data(), id: docSnap.id };
        // console.log(data);
        setDataCaja(data);
      } else {
        console.log("No such document!");
      }
    };
    fetchData2();
  }, []);

  let ventaCounter = 0;
  const flattenedData = reportes.flatMap((reporte, index) =>
    reporte.productos.map((producto, prodIndex) => {
      // Para la primera fila completamente vacía con sólo cajaActual
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
          cajaActual: `${reporte.CajaActual} Bs`, // Valor fijo de 500 Bs
        };
      }

      const commonFields = {
        id: `${reporte.id}-${producto.NombreProducto}`,
        venta: `Venta ${ventaCounter + index}`,
        fecha: reporte.Fecha,
        hora: reporte.Hora,
        NombreProducto: producto.NombreProducto,
        PrecioUnitario: producto.PrecioUnitario,
        CantidadInicial: producto.CantidadInicial,
        CantidadVendida: producto.CantidadVendida,
        total: producto.total,
      };

      // Para el primer elemento de cada reporte (después de la primera fila vacía)
      if (index !== 0 || prodIndex !== 0) {
        if (prodIndex === 0) {
          return {
            ...commonFields,
            pagoCliente: `${reporte.PagoCliente} Bs`,
            cambioCliente: `${reporte.CambioCliente} Bs`,
            cajaActual: `${reporte.CajaActual} Bs`,
            totalVenta: `${reporte.TotalVenta} Bs`,
          };
        }

        // Para todos los demás elementos
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

  useEffect(() => {
    if (Object.keys(dataCaja).length > 0) {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "ReportesVentas"));
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          FechaHora: new Date(`${doc.data().Fecha}T${doc.data().Hora}`)
        }));

        // Ordenar por fecha y hora en orden ascendente
        dataList.sort((a, b) => new Date(a.FechaHora) - new Date(b.FechaHora));
        const dataFiltrado = dataList.filter(item => item.IdCaja === dataCaja.id);

        const montoInicial = dataCaja.MontoInicialCaja ?? 0;
        const emptyObject = {
          CajaActual: montoInicial,
          productos: [{
            CantidadInicial: 90,
          }]
        };

        // Agregar el objeto vacío al inicio del dataList
        dataFiltrado.unshift(emptyObject);
        setReportes(dataFiltrado);
      };
      fetchData();
    };
  }, [flattenedData]);

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
    // {
    //   title: 'Cantidad Inicial',
    //   dataIndex: 'CantidadInicial',
    //   key: 'CantidadInicial',
    //   render: (text) => `${text} unidades`,
    // },
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

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="form-titleProductos">Reporte de ventas</h2>
      <div className='parentMostrarProductos'>
        <Table
          dataSource={flattenedData}
          columns={columns}
          rowKey={(record) => `${record.id}-${record.NombreProducto}`}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ReporteVentas;
