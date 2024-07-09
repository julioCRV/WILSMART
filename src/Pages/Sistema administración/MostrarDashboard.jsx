import { Layout, Breadcrumb, Row, Col, Card, Statistic, Table, Button } from 'antd';
import { Line } from '@ant-design/charts';
import { DollarOutlined, ShoppingCartOutlined, UserOutlined, BarChartOutlined, RiseOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import ButtonGenerador from './GeneradorCVS'
import './MostrarDashboard.css';

const { Header, Content, Footer } = Layout;

const columns = [
  {
    title: 'Nombres de productos',
    dataIndex: 'NombreProducto',
    key: 'name',
  },
  {
    title: 'Cantidad vendida',
    dataIndex: 'cantidad',
    key: 'category',
  },
  {
    title: 'Ventas',
    dataIndex: 'PrecioUnitario',
    render: (text) => `Bs   ${text}`,
    key: 'sales',
  },
];

const MostrarDashboard = () => {
  const [dataCaja, setDataCaja] = useState([]);
  const [dataRankingProductos, setDataRankingProductos] = useState([]);
  const [dataUsuarios, setDataUsuario] = useState([]);
  const [data, setData] = useState([]);
  const [numeroVentas, setNumeroVentas] = useState(0);
  const [numeroProductosVendidos, setNumeroProductosVendidods] = useState(0);

  useEffect(() => {
    const fetchCaja = async () => {
      const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      const cajaDinero = {
        TotalVentas: dataList.reduce((total, item) => total + item.TotalVentas, 0),
        TotalGanancias: dataList.reduce((total, item) => total + item.TotalGanancias, 0)
      };
      setDataCaja(cajaDinero);
    };

    const fetchReportesVentas = async () => {
      const querySnapshot = await getDocs(collection(db, "ReportesVentas"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setNumeroVentas(dataList.length)
      const productosArray = dataList.map(item =>
        item.productos.map(producto => ({
          ...producto,
          Fecha: item.Fecha
        }))
      ).flat();

      setData(productosArray);

      const totalProductosVendidos = productosArray.reduce((total, item) => total + item.CantidadVendida, 0)
      setNumeroProductosVendidods(totalProductosVendidos)


      // Contar la cantidad vendida de cada producto y agregar el precio unitario
      const productCount = productosArray.reduce((acc, producto) => {
        if (!acc[producto.NombreProducto]) {
          acc[producto.NombreProducto] = {
            cantidad: 0,
            PrecioUnitario: producto.PrecioUnitario
          };
        }
        acc[producto.NombreProducto].cantidad += producto.CantidadVendida;
        return acc;
      }, {});

      // Convertir el objeto en un array de objetos para ordenarlo
      const ranking = Object.entries(productCount)
        .map(([NombreProducto, data]) => ({
          NombreProducto,
          cantidad: data.cantidad,
          PrecioUnitario: parseInt(data.PrecioUnitario) * data.cantidad
        }))
        .sort((a, b) => b.cantidad - a.cantidad);

      setDataRankingProductos(ranking);
    };

    const fetchUsuarios = async () => {
      const querySnapshot = await getDocs(collection(db, "ListaClientes"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      const usuariosClasificados = dataList.reduce((acc, item) => {
        if (item.Estado === "Activo") {
          acc.usuariosActivos += 1;
        } else if (item.Estado === "Inactivo") {
          acc.usuariosInactivos += 1;
        }
        return acc;
      }, { usuariosActivos: 0, usuariosInactivos: 0 });
      console.log(usuariosClasificados);
      setDataUsuario(usuariosClasificados);
    };

    fetchUsuarios();
    fetchCaja();
    fetchReportesVentas();
  }, []);


  // Procesar los datos para el gráfico de línea
  const lineData = data.reduce((acc, producto) => {
    const existingEntry = acc.find(entry => entry.Fecha === producto.Fecha);
    if (existingEntry) {
      existingEntry.CantidadVendida += producto.CantidadVendida;
    } else {
      acc.push({
        Fecha: producto.Fecha,
        CantidadVendida: producto.CantidadVendida
      });
    }
    return acc;
  }, []);


  const config = {
    data: lineData,
    xField: 'Fecha',
    yField: 'CantidadVendida',
    xAxis: {
      type: 'timeCat',
    },
    smooth: true,
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px', marginTop: '10px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2>Dashboard</h2>
            <ButtonGenerador />
          </div>
        </Breadcrumb>

        <div className="site-layout-content">
          <Row gutter={16}>
            <Col span={6}>
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
            <Col span={6}>
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
            <Col span={6}>
              <Card>
                <Statistic
                  title="Ventas realizadas"
                  value={numeroVentas}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Productos vendidos"
                  value={numeroProductosVendidos}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Clientes activos"
                  value={dataUsuarios.usuariosActivos}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Clientes perdidos"
                  value={dataUsuarios.usuariosInactivos}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Producto más vendido"
                  value={`${(dataRankingProductos.length > 0 && dataRankingProductos[0]?.NombreProducto && dataRankingProductos[0]?.cantidad !== undefined)
                    ? `${dataRankingProductos[0].NombreProducto} `
                    : '0'
                    }`}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
          </Row>


          <Row gutter={16} style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Card title="Tendencias de ventas">
                <Line {...config} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Card title="Ventas por producto">
                <Table columns={columns} dataSource={dataRankingProductos} pagination={false} />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default MostrarDashboard;
