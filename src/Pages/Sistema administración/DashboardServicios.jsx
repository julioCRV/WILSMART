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
    // Estado para almacenar los datos relacionados con las órdenes.
    const [dataOrden, setDataOrden] = useState([]);
    // Estado para gestionar los datos del ranking de productos.
    const [dataRankingProductos, setDataRankingProductos] = useState([]);
    // Estado para almacenar la información de los usuarios.
    const [dataUsuarios, setDataUsuario] = useState([]);
    // Estado para almacenar la lista con información de cada repuesto.
    const [data, setData] = useState([]);
    // Estado para manejar los datos relacionados con el inventario o caja de repuestos.
    const [cajaRepuestos, setCajaRepuestos] = useState([]);


    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - 
    useEffect(() => {

        // Define una función asíncrona para obtener los datos relacionados con las órdenes de servicio y sus repuestos.
        const fetchReportesVentas = async () => {
            // Obtiene todos los documentos de la colección "ListaOrdenServicio" de la base de datos.
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));

            // Mapea cada documento de "ListaOrdenServicio" y obtiene los datos de la subcolección "ListaRepuestos".
            const dataList = await Promise.all(querySnapshot.docs.map(async doc => {
                // Referencia a la subcolección "ListaRepuestos" dentro de cada documento de "ListaOrdenServicio".
                const listaRepuestosRef = collection(db, `ListaOrdenServicio/${doc.id}/ListaRepuestos`);
                // Obtiene todos los documentos de la subcolección "ListaRepuestos".
                const listaRepuestosSnapshot = await getDocs(listaRepuestosRef);
                // Mapea los documentos de "ListaRepuestos" para incluir su contenido y su ID.
                const ListaRepuestos = listaRepuestosSnapshot.docs.map(repuestoDoc => ({
                    ...repuestoDoc.data(),
                    id: repuestoDoc.id
                }));

                return {
                    ListaRepuestos
                };
            }));

            // Combina todas las listas de repuestos de los documentos en un solo arreglo.
            const allRepuestos = dataList.reduce((acc, item) => {
                return acc.concat(item.ListaRepuestos);
            }, []);

            // Calcula la cantidad total seleccionada y guarda el precio unitario para cada tipo de repuesto.
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

            // Convierte el objeto con el conteo de productos en un arreglo y lo ordena por cantidad vendida de mayor a menor.
            const ranking = Object.entries(productCount)
                .map(([NombreRepuesto, data]) => ({
                    NombreRepuesto,
                    cantidad: data.cantidadSeleccionada,
                    PrecioRepuesto: parseInt(data.PrecioRepuesto) * data.cantidadSeleccionada
                }))
                .sort((a, b) => b.cantidad - a.cantidad);

            // Actualiza el estado con el ranking de productos según la cantidad vendida.
            setDataRankingProductos(ranking);

        };

        // Define una función asíncrona para obtener los datos relacionados con las órdenes de servicio y sus repuestos.
        const fetchRepuestos = async () => {
            // Obtiene todos los documentos de la colección "ListaOrdenServicio".
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));

            // Mapea cada documento de "ListaOrdenServicio" y obtiene los datos de la subcolección "ListaRepuestos".
            const dataList = await Promise.all(querySnapshot.docs.map(async doc => {
                // Referencia a la subcolección "ListaRepuestos" dentro de cada documento de "ListaOrdenServicio".
                const listaRepuestosRef = collection(db, `ListaOrdenServicio/${doc.id}/ListaRepuestos`);

                // Obtiene todos los documentos de la subcolección "ListaRepuestos".
                const listaRepuestosSnapshot = await getDocs(listaRepuestosRef);

                // Mapea los documentos de "ListaRepuestos" para incluir su contenido y su ID.
                const ListaRepuestos = listaRepuestosSnapshot.docs.map(repuestoDoc => ({
                    ...repuestoDoc.data(),
                    id: repuestoDoc.id
                }));

                // Devuelve los datos del documento actual junto con su lista de repuestos.
                return {
                    ...doc.data(),
                    ListaRepuestos
                };
            }));

            // Actualiza el estado con la lista completa de datos obtenidos.
            setData(dataList);

            // También actualiza el estado de las órdenes con la misma lista de datos.
            setDataOrden(dataList);

            // Calcula diferentes métricas relacionadas con las órdenes de servicio y los repuestos.
            const cajaRepuestos = {
                // Suma el total de reparaciones considerando el monto de los repuestos y el servicio.
                TotalReparaciones: dataList.reduce((total, item) => total + item.MontoRepuestos + item.MontoServicio, 0),

                // Suma el costo total de la mano de obra de todas las órdenes.
                TotalCostoMano: dataList.reduce((total, item) => total + item.MontoServicio, 0),

                // Calcula la ganancia total de los repuestos restando el costo de compra al precio de venta.
                TotalGananciaRepuestos: dataList.reduce((total, item) => {
                    const totalRepuestos = item.ListaRepuestos.reduce((subTotal, repuesto) => {
                        return subTotal + (parseFloat(repuesto.PrecioRepuesto) * repuesto.cantidadSeleccionada - parseFloat(repuesto.PrecioCompra) * repuesto.cantidadSeleccionada);
                    }, 0);
                    return total + totalRepuestos;
                }, 0),

                // Cuenta la cantidad total de órdenes de servicio.
                CantidadOrdenServicios: dataList.length,

                // Cuenta la cantidad total de repuestos vendidos en todas las órdenes.
                CantidadRepuestos: dataList.reduce((total, item) => {
                    const totalRepuestos = item.ListaRepuestos.reduce((subTotal, repuesto) => {
                        return subTotal + repuesto.cantidadSeleccionada;
                    }, 0);
                    return total + totalRepuestos;
                }, 0),
            };

            // Actualiza el estado con las métricas calculadas.
            setCajaRepuestos(cajaRepuestos);
        };

        // Define una función asíncrona para obtener los datos de los usuarios registrados en la base de datos.
        const fetchUsuarios = async () => {
            // Obtiene todos los documentos de la colección "ListaClientes".
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));

            // Mapea cada documento de "ListaClientes" para obtener sus datos y su ID.
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            // Clasifica los usuarios en activos e inactivos con base en el campo "Estado".
            const usuariosClasificados = dataList.reduce((acc, item) => {
                if (item.Estado === "Activo") {
                    acc.usuariosActivos += 1; // Incrementa el contador de usuarios activos.
                } else if (item.Estado === "Inactivo") {
                    acc.usuariosInactivos += 1; // Incrementa el contador de usuarios inactivos.
                }
                return acc;
            }, { usuariosActivos: 0, usuariosInactivos: 0 });

            // Actualiza el estado con los datos clasificados de usuarios.
            setDataUsuario(usuariosClasificados);
        };

        // Llama a las funciones para obtener los datos necesarios.
        fetchRepuestos(); // Obtiene los datos de repuestos y calcula métricas relacionadas.
        fetchUsuarios(); // Obtiene los datos de usuarios y los clasifica según su estado.
        fetchReportesVentas(); // Obtiene los datos relacionados con las ventas

    }, []);
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + +
    // Procesa los datos para crear una estructura adecuada para el gráfico de líneas.
    const lineData = data.reduce((acc, producto) => {
        // Busca si ya existe una entrada para la fecha actual en el acumulador.
        const existingEntry = acc.find(entry => entry.Fecha === producto.Fecha);

        if (existingEntry) {
            // Si ya existe, incrementa el contador de la cantidad para esa fecha.
            existingEntry.cantidad += 1;
        } else {
            // Si no existe, agrega una nueva entrada con la fecha y la cantidad inicial de 1.
            acc.push({
                Fecha: producto.Fecha,
                cantidad: 1
            });
        }
        return acc;
    }, []);

    // Ordena los datos del gráfico por fecha para asegurar una secuencia cronológica.
    lineData.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

    // Configuración del gráfico de líneas.
    const config = {
        data: lineData, // Datos procesados para el gráfico.
        xField: 'Fecha', // Campo para el eje X (fechas).
        yField: 'cantidad', // Campo para el eje Y (cantidad).
        smooth: true, // Suaviza las líneas del gráfico.

        responsive: true, // Habilita la capacidad de respuesta para diferentes tamaños de pantalla.
        autoFit: true, // Ajusta automáticamente el tamaño del gráfico al contenedor.
        height: 400, // Define la altura inicial del gráfico.
        padding: 'auto', // Aplica un espaciado automático alrededor del gráfico.
    };

    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    return (
        <Layout style={{ minHeight: '100vh' }}>
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

                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Card title="Tendencias de ordenes de servicio">
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
                        <Card title="Repuestos por demanda">
                            <Table columns={columns} dataSource={dataRankingProductos} pagination={false} scroll={{ x: 'max-content' }} />
                        </Card>
                    </Col>

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
