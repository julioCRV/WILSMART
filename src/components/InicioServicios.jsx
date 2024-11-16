import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';

const HomePage = () => {
    const { Title, Paragraph } = Typography;
    return (
        <div style={{ textAlign: 'center' }}>
            <Title level={4}>
                WilSmart
            </Title>

            <div className='EcardVentas'>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-servicios/registro-repuesto">
                            <Card title="Repuestos">
                                <img src="/assets/agregarRepuesto.png" alt="agregarRepuesto" style={{ width: '50px' }} />
                                <Paragraph>
                                    Registro de repuesto
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>

                        <Link to="/sistema-servicios/mostrar-repuestos">
                            <Card title="Repuestos">
                                <img src="/assets/mostrarRepuestos.png" alt="mostrarRepuestos" style={{ width: '50px' }} />
                                <Paragraph>
                                    Mostrar repuestos
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-servicios/mostrar-registrarClientes">
                            <Card title="Clientes">
                                <img src="/assets/registrarCliente.png" alt="registraCliente" style={{ width: '50px' }} />
                                <Paragraph>
                                    Registrar clientes
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-servicios/mostrar-clientes">
                            <Card title="Clientes">
                                <img src="/assets/listarClientes.png" alt="mostrarClientes" style={{ width: '50px' }} />
                                <Paragraph>
                                    Mostrar clientes
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-servicios/mostrar-tickets">
                            <Card title="Clientes">
                                <img src="/assets/mostrarTickets.png" alt="mostrarTickets" style={{ width: '50px' }} />
                                <Paragraph>
                                    Mostrar tickets de atención
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-servicios/registrar-clientePerdido">
                            <Card title="Clientes">
                                <img src="/assets/registrarPerdido.png" alt="registrarPerdido" style={{ width: '50px' }} />
                                <Paragraph>
                                    Registrar clientes perdidos
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-servicios/mostrar-clientesPerdidos">
                            <Card title="Clientes">
                                <img src="/assets/mostrarPerdidos.png" alt="mostrarPerdidos" style={{ width: '50px' }} />
                                <Paragraph>
                                    Mostrar clientes perdidos
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HomePage;