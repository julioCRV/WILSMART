import { Layout, Breadcrumb, Row, Col, Card, Statistic, Table, Button } from 'antd';
import { Line } from '@ant-design/charts';
import { DollarOutlined, ProfileOutlined, UserOutlined, BarChartOutlined, RiseOutlined, UserDeleteOutlined, StockOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import ButtonGenerador from './GeneradorCVS';
import dayjs from 'dayjs';
import './MostrarDashboard.css';

const { Header, Content, Footer } = Layout;

const columns = [
    {
        title: 'Nombre del repuesto',
        dataIndex: 'NombreRepuesto',
        key: 'name',
    },
    {
        title: 'Cantidad demandada',
        dataIndex: 'cantidad',
        key: 'category',
    },
    {
        title: 'Total',
        dataIndex: 'PrecioRepuesto',
        render: (text) => `Bs   ${text}`,
        key: 'sales',
    },
];

const columnsCaja = [
    {
        title: 'Numero de orden',
        dataIndex: 'CodOrden',
        key: 'name',
        // render: (text, record, index) => `${index + 1}`,
    },
    {
        title: 'Técnico encargado',
        dataIndex: 'TecnicoEncargado',
        key: 'category',
    },
    {
        title: 'Fecha de reparación',
        dataIndex: 'FechaReparacion',
        key: 'category',
        defaultSortOrder: 'descend',
        sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
    },
    {
        title: 'Fecha de entrega',
        dataIndex: 'FechaEntrega',
        key: 'category',
    },
    {
        title: 'Ingresos repuestos',
        dataIndex: 'MontoRepuestos',
        render: (text) => `Bs   ${text}`,
        key: 'sales',
    },
    {
        title: 'Ingresos servicio',
        dataIndex: 'MontoServicio',
        render: (text) => `Bs   ${text}`,
        key: 'sales',
    },
    {
        title: 'Nombre del cliente',
        dataIndex: 'NombreCliente',
        key: 'category',
    },
];

const DashboardServicios = () => {
    const [dataOrden, setDataOrden] = useState([]);
    const [dataCajaControl, setDataCajaControl] = useState([]);
    const [dataRankingProductos, setDataRankingProductos] = useState([]);
    const [dataUsuarios, setDataUsuario] = useState([]);
    const [data, setData] = useState([]);
    const [numeroVentas, setNumeroVentas] = useState(0);
    const [numeroProductosVendidos, setNumeroProductosVendidods] = useState(0);

    const [cajaRepuestos, setCajaRepuestos] = useState([]);

    useEffect(() => {
        const fetchReportesVentas = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));
            const dataList = await Promise.all(querySnapshot.docs.map(async doc => {
                const listaRepuestosRef = collection(db, `ListaOrdenServicio/${doc.id}/ListaRepuestos`);
                const listaRepuestosSnapshot = await getDocs(listaRepuestosRef);
                const ListaRepuestos = listaRepuestosSnapshot.docs.map(repuestoDoc => ({
                    ...repuestoDoc.data(),
                    id: repuestoDoc.id
                }));

                return {
                    ListaRepuestos
                };
            }));

            const allRepuestos = dataList.reduce((acc, item) => {
                return acc.concat(item.ListaRepuestos);
            }, []);
            
            // Contar la cantidad vendida de cada repuesto y agregar el precio unitario
            const productCount = allRepuestos.reduce((acc, repuesto) => {
                if (!acc[repuesto.NombreRepuesto]) {
                    acc[repuesto.NombreRepuesto] = {
                        cantidadSeleccionada: 0,
                        PrecioRepuesto: parseFloat(repuesto.PrecioRepuesto)
                    };
                }
                acc[repuesto.NombreRepuesto].cantidadSeleccionada += repuesto.cantidadSeleccionada;
                return acc;
            }, {});

            // console.log(productCount);

            // Convertir el objeto en un array de objetos para ordenarlo
            const ranking = Object.entries(productCount)
                .map(([NombreRepuesto, data]) => ({
                    NombreRepuesto,
                    cantidad: data.cantidadSeleccionada,
                    PrecioRepuesto: parseInt(data.PrecioRepuesto) * data.cantidadSeleccionada
                }))
                .sort((a, b) => b.cantidad - a.cantidad);

            setDataRankingProductos(ranking);
        };

        const fetchRepuestos = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));
            const dataList = await Promise.all(querySnapshot.docs.map(async doc => {
                const listaRepuestosRef = collection(db, `ListaOrdenServicio/${doc.id}/ListaRepuestos`);
                const listaRepuestosSnapshot = await getDocs(listaRepuestosRef);
                const ListaRepuestos = listaRepuestosSnapshot.docs.map(repuestoDoc => ({
                    ...repuestoDoc.data(),
                    id: repuestoDoc.id
                }));

                return {
                    ...doc.data(),
                    ListaRepuestos
                };
            }));

            setData(dataList);
            setDataOrden(dataList);

            const cajaRepuestos = {
                TotalReparaciones: dataList.reduce((total, item) => total + item.MontoRepuestos + item.MontoServicio, 0),
                TotalCostoMano: dataList.reduce((total, item) => total + item.MontoServicio, 0),
                TotalGananciaRepuestos: dataList.reduce((total, item) => {
                    const totalRepuestos = item.ListaRepuestos.reduce((subTotal, repuesto) => {
                        return subTotal + (parseFloat(repuesto.PrecioRepuesto) * repuesto.cantidadSeleccionada - parseFloat(repuesto.PrecioCompra) * repuesto.cantidadSeleccionada);
                    }, 0);
                    return total + totalRepuestos;
                }, 0),
                CantidadOrdenServicios: dataList.length,
                CantidadRepuestos: dataList.reduce((total, item) => {
                    const totalRepuestos = item.ListaRepuestos.reduce((subTotal, repuesto) => {
                        return subTotal + repuesto.cantidadSeleccionada
                    }, 0);
                    return total + totalRepuestos
                }, 0),
            };

            setCajaRepuestos(cajaRepuestos) 
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
            // console.log(usuariosClasificados);
            setDataUsuario(usuariosClasificados);
          };

        fetchRepuestos();
        fetchUsuarios();
        fetchReportesVentas();
    }, []);

    // console.log(dataCajaControl);

    const lineData = data.reduce((acc, producto) => {
        const existingEntry = acc.find(entry => entry.Fecha === producto.Fecha);
    
        if (existingEntry) {
            existingEntry.cantidad += 1;
        } else {
            acc.push({
                Fecha: producto.Fecha,
                cantidad: 1
            });
        }
        return acc;
    }, []);

    lineData.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

    const config = {
        data: lineData,
        xField: 'Fecha',
        yField: 'cantidad',
        smooth: true,

        responsive: true,
        // Opciones para ajustar el tamaño del gráfico en diferentes dispositivos
        autoFit: true,
        height: 400, // Altura inicial del gráfico
        padding: 'auto', // Espaciado automático para el gráfico
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '0 50px', marginTop: '10px' }}>
                <div className="site-layout-content">
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Total generado por reparaciones"
                                    value={cajaRepuestos.TotalReparaciones}
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
                                    title="Total costo de mano de obra"
                                    value={cajaRepuestos.TotalCostoMano}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<StockOutlined />}
                                    suffix="Bs"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Ganancias total de repuestos"
                                    value={cajaRepuestos.TotalGananciaRepuestos}
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
                                    title="Total repuestos utilizados"
                                    value={cajaRepuestos.CantidadRepuestos}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ProfileOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Total ordenes de atención"
                                    value={cajaRepuestos.CantidadOrdenServicios}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ProfileOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Clientes activos"
                                    value={dataUsuarios.usuariosActivos}
                                    valueStyle={{ color: '#1890ff' }}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Clientes perdidos"
                                    value={dataUsuarios.usuariosInactivos}
                                    valueStyle={{ color: '#1890ff' }}
                                    prefix={<UserDeleteOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Repuesto más demandado"
                                    value={`${(dataRankingProductos.length > 0 && dataRankingProductos[0]?.NombreRepuesto && dataRankingProductos[0]?.cantidad !== undefined)
                                        ? `${dataRankingProductos[0].NombreRepuesto} `
                                        : '0'
                                        }`}
                                    valueStyle={{ color: '#faad14' }}
                                    prefix={<BarChartOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>


                    {/* <Row gutter={16}> */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Card title="Tendencias de ordenes de servicio">
                            <Line {...config} />
                        </Card>
                    </Col>
                    {/* </Row> */}

                    {/* <Row gutter={16}> */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Card title="Repuestos por demanda">
                            <Table columns={columns} dataSource={dataRankingProductos} pagination={false} scroll={{ x: 'max-content' }} />
                        </Card>
                    </Col>
                    {/* </Row> */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Card title="Estados de orden de servicios">
                            <Table columns={columnsCaja} dataSource={dataOrden} pagination={false} scroll={{ x: 'max-content' }} />
                        </Card>
                    </Col>
                </div>
            </Content>
            <Footer></Footer>
        </Layout>
    );
};

export default DashboardServicios;
