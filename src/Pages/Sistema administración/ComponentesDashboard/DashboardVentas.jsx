import { Layout, Row, Col, Card, Statistic, Table, Button, Select } from 'antd';
import { Column, Line, Pie } from '@ant-design/charts';
import { DollarOutlined, ShoppingCartOutlined, BarChartOutlined, RiseOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../FireBase/fireBase';
import dayjs from 'dayjs';
import EstadoCajaProductos from './EstadosCajaProductos';
import ComparativaPeriodos from './ComparativaPeriodos'
import './MostrarDashboard.css';
const { Option } = Select;

const { Header, Content, Footer } = Layout;

const columns = [
  {
    title: 'Nombres de productos',
    dataIndex: 'NombreProducto',
    key: 'name',
    width: '120px'
  },
  {
    title: 'Cantidad vendida',
    dataIndex: 'cantidad',
    key: 'category',
    width: '120px'
  },
  {
    title: 'Ventas',
    dataIndex: 'PrecioUnitario',
    render: (text) => `Bs   ${text}`,
    key: 'sales',
    width: '120px'
  },
];

const DashboardVentas = () => {
  const [dataCaja, setDataCaja] = useState([]);
  const [dataCajaControlOriginal, setDataCajaControlOriginal] = useState([]);
  const [dataRankingProductos, setDataRankingProductos] = useState([]);
  const [data, setData] = useState([]);
  const [dataReporteVentas, setDataReporteVentas] = useState([]);
  const [numeroVentas, setNumeroVentas] = useState(0);
  const [numeroProductosVendidos, setNumeroProductosVendidods] = useState(0);
  const [dataProductosOriginal, setDataProductosOriginal] = useState([]);

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - 
  useEffect(() => {
    // --> Define una función asíncrona para obtener los datos del historial de apertura de caja.
    const fetchCaja = async () => {
      // Obtiene todos los documentos de la colección "HistorialAperturaCaja".
      const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
      // Mapea los documentos para obtener los datos y su ID.
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Calcula los montos sumatorios para las ventas y las ganancias.
      const cajaDinero = {
        TotalVentas: dataList.reduce((total, item) => total + item.TotalVentas, 0), // Suma total de ventas.
        TotalGanancias: dataList.reduce((total, item) => total + item.TotalGanancias, 0) // Suma total de ganancias.
      };

      // Actualiza el estado con los totales calculados.
      setDataCaja(cajaDinero);

      // Añade un total de ventas global al final de la lista de datos.
      dataList.push(getTotalVentas(dataList));

      // Actualiza el estado con los datos de control de caja (incluyendo los totales).
      // setDataCajaControl(dataList);
      setDataCajaControlOriginal(dataList);
    };


    // --> Define una función asíncrona para obtener los reportes de ventas.
    const fetchReportesVentas = async () => {
      // Obtiene todos los documentos de la colección "ReportesVentas".
      const querySnapshot = await getDocs(collection(db, "ReportesVentas"));
      // Mapea los documentos de "ReportesVentas" y extrae los datos.
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      //Almacena la infroamción del reporte de ventas
      setDataReporteVentas(dataList);

      // Actualiza el estado con el número total de ventas.
      setNumeroVentas(dataList.length);

      // Crea un array de productos combinando los productos de todos los reportes de ventas.
      const productosArray = dataList.map(item =>
        item.productos.map(producto => ({
          ...producto,
          Fecha: item.Fecha // Añade la fecha de la venta a cada producto.
        }))
      ).flat();

      // Actualiza el estado con el array de productos.
      setData(productosArray);

      // Calcula el total de productos vendidos sumando la cantidad de todos los productos.
      const totalProductosVendidos = productosArray.reduce((total, item) => total + item.CantidadVendida, 0);
      setNumeroProductosVendidods(totalProductosVendidos);

      // Contabiliza la cantidad de cada producto vendido y agrega el precio unitario.
      const productCount = productosArray.reduce((acc, producto) => {
        if (!acc[producto.NombreProducto]) {
          acc[producto.NombreProducto] = {
            cantidad: 0,
            PrecioUnitario: producto.PrecioUnitario // Guarda el precio unitario para cada producto.
          };
        }
        // Suma la cantidad vendida de cada producto.
        acc[producto.NombreProducto].cantidad += producto.CantidadVendida;
        return acc;
      }, {});

      // Convierte el objeto en un array de objetos y los ordena según la cantidad vendida.
      const ranking = Object.entries(productCount)
        .map(([NombreProducto, data]) => ({
          NombreProducto,
          cantidad: data.cantidad,
          PrecioUnitario: parseInt(data.PrecioUnitario) * data.cantidad // Calcula el precio total por cantidad.
        }))
        .sort((a, b) => b.cantidad - a.cantidad); // Ordena los productos de mayor a menor cantidad vendida.

      // Actualiza el estado con el ranking de productos.
      setDataRankingProductos(ranking);
    };


    // Define una función asíncrona para obtener los productos de la base de datos.
    const fetchProductos = async () => {
      // Obtiene todos los documentos de la colección "ListaProductos".
      const querySnapshot = await getDocs(collection(db, "ListaProductos"));

      // Mapea los documentos de "ListaProductos" y extrae los datos.
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Agrega el id del documento a cada producto.
      }));

      // Actualiza el estado con los datos de los productos obtenidos.
      // setDataProductos(dataList);

      // Guarda una copia original de los productos.
      setDataProductosOriginal(dataList);
    };

    // Llama a las funciones para obtener productos, caja y reportes de ventas.
    fetchProductos();
    fetchCaja();
    fetchReportesVentas();
  }, []);
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // #region + + + + + + + + + + + + + + + + + + + + +  [ Métodos ]  + + + + + + + + + + + + + + + + + + + + + + + + + + 
  // Procesa los datos para crear el gráfico de línea
  const lineData = data.reduce((acc, producto) => {
    // Busca si ya existe una entrada con la misma fecha
    const existingEntry = acc.find(entry => entry.Fecha === producto.Fecha);
    if (existingEntry) {
      // Si existe, suma la cantidad vendida
      existingEntry.CantidadVendida += producto.CantidadVendida;
    } else {
      // Si no existe, agrega una nueva entrada con la fecha y cantidad vendida
      acc.push({
        Fecha: producto.Fecha,
        CantidadVendida: producto.CantidadVendida
      });
    }
    return acc;
  }, []);

  // Ordena los datos por fecha ascendente
  lineData.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

  // Configura las opciones del gráfico de línea
  const config = {
    data: lineData, // Datos a mostrar en el gráfico
    xField: 'Fecha', // Campo para el eje X (fecha)
    yField: 'CantidadVendida', // Campo para el eje Y (cantidad vendida)
    smooth: true, // Hace que la línea sea suave
    meta: {
      CantidadVendida: {
        alias: 'Cantidad Vendida', // Nombre personalizado para el eje Y
      },
    },
    // Configuración de responsividad
    responsive: true,
    autoFit: true, // Ajusta el tamaño automáticamente en diferentes dispositivos
    height: 250, // Altura inicial del gráfico
    padding: 'auto', // Espaciado automático para el gráfico
  };

  // Función para obtener el total de ventas
  const getTotalVentas = (listaDatos) => {
    // Suma el total de ventas de todos los elementos en listaDatos
    const totalVentasSumado = listaDatos.reduce((acumulador, item) => acumulador + item.TotalVentas, 0);

    // Crea una fila con los totales, dejando los demás campos vacíos
    const filaTotal = {
      Estado: "",
      Fecha: "",
      Hora: "",
      MontoActualCaja: "",
      MontoFinalCaja: "",
      MontoInicialCaja: "",
      NombreEmpleado: "",
      TotalCambio: "",
      TotalGanancias: "",
      TotalIngresoCaja: "",
      TotalPagado: "",
      TotalRetiroCaja: "",
      TotalVentas: totalVentasSumado, // Asigna el total calculado
      id: "total" // Id personalizado para identificar esta fila como total
    };

    // Devuelve la fila con los totales
    return filaTotal;
  }

  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

  return (
    <Layout>
      <Content style={{
        display: 'flex',
        justifyContent: 'center', // Centrado horizontal
        alignItems: 'center', // Centrado vertical
        minHeight: '100vh', // Asegura que el contenedor tenga la altura completa de la ventana
      }}>
        <div className="site-layout-content">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Ventas totales"
                  value={dataCaja.TotalVentas}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                  suffix="Bs"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Ganancias totales"
                  value={dataCaja.TotalGanancias}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<RiseOutlined />}
                  suffix="Bs"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Ventas realizadas"
                  value={numeroVentas}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Productos vendidos"
                  value={numeroProductosVendidos}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Producto más vendido"
                  value={`${(dataRankingProductos.length > 0 && dataRankingProductos[0]?.NombreProducto && dataRankingProductos[0]?.cantidad !== undefined)
                    ? `${dataRankingProductos[0].NombreProducto} `
                    : '0'
                    }`}
                  valueStyle={{ color: '#faad14', fontSize: '1.2rem' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
          </Row>


          <Col xs={24} sm={24} md={24} lg={24}>
            <Card title="Tendencias de ventas">
              {/* Contenedor con scroll similar al de la tabla */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <div style={{ minWidth: '800px' }}>
                  {/* Aseguramos que el gráfico tiene un ancho mínimo para activar el scroll */}
                  <Line {...config} />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Card title="Ventas por producto">
              <Table columns={columns} dataSource={dataRankingProductos} pagination={false} scroll={{ x: 'max-content', y: '200px' }} />
            </Card>
          </Col>

          <EstadoCajaProductos dataCajaControlOriginal={dataCajaControlOriginal} dataReporteVentas={dataReporteVentas} dataProductosOriginal={dataProductosOriginal} />

          <ComparativaPeriodos dataCajaControlOriginal={dataCajaControlOriginal} />

        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default DashboardVentas;
