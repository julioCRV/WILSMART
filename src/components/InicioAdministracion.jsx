import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
import './Inicios.css'
const { Title, Paragraph } = Typography;

const HomePage = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <Title level={4}>
                WilSmart
            </Title>

            <div className='EcardVentas'>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-administración/registro-empleado">
                            <Card title="Personal" >
                                <img src="/assets/registroEmpleados.jpg" alt="Ventas" style={{ height: '50px' }} />
                                <Paragraph>
                                    Registrar empleado
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-administración/mostrar-empleados">
                            <Card title="Personal">
                                <img src="/assets/listaEmpleados.png" alt="Administración" style={{ height: '50px' }} />
                                <Paragraph>
                                    Mostrar empleados
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-administración/generar-credenciales">
                            <Card title="Personal">
                                <img src="/assets/credenciales.png" alt="Administración" style={{ height: '50px' }} />
                                <Paragraph>
                                    Generar credenciales
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-administración/mostrar-dashboard">
                            <Card title="Dashboard" >
                                <img src="/assets/dashboard.png" alt="Servicios" style={{ height: '50px' }} />
                                <Paragraph>
                                    Mostrar dashboard
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


{/* import { Link } from 'react-router-dom';

// ...

<Link to="/ruta-de-ventas">
  <Card title="Sistema de Ventas" style={{ width: 250, margin: '15px', backgroundColor: '#f0f0f0' }}>
    {/* Contenido de la card de Ventas */}
//   </Card>
// </Link>

// ... */}
