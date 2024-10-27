import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
import './Inicios.css'
const { Title, Paragraph } = Typography;

const HomePage = () => {
    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <Title level={4}>
                    WilSmart
                </Title>
            </div>
            <div className='EcardVentas'>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-ventas/registrar-producto">
                            <Card title="Inventario" >
                                <img src="/assets/agregarProducto.png" alt="Ventas" style={{ width: '50px' }} />
                                <Paragraph>
                                    Registrar producto
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-ventas/mostrar-productos">
                            <Card title="Inventario" >
                                <img src="/assets/mostrarProducto.png" alt="Administración" style={{ width: '50px' }} />
                                <Paragraph>
                                    Mostrar productos
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-ventas/incrementar-productos">
                            <Card title="Inventario" >
                                <img src="/assets/incrementarProductos.png" alt="Administración" style={{ width: '50px' }} />
                                <Paragraph>
                                    Incrementar productos
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-ventas/realizar-venta">
                            <Card title="Inventario" >
                                <img src="/assets/realizarVenta.png" alt="Administración" style={{ width: '50px' }} />
                                <Paragraph>
                                    Realizar venta
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-ventas/mostrar-reportes">
                            <Card title="Reportes" >
                                <img src="/assets/reporteVenta.png" alt="Servicios" style={{ width: '50px' }} />
                                <Paragraph>
                                    Reporte de ventas
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>
                    <Col  xs={24} sm={12} md={8} lg={6}>
                        <Link to="/sistema-ventas/estado-caja">
                            <Card title="Reportes" >
                                <img src="/assets/estadoCaja.png" alt="Administración" style={{ width: '50px' }} />
                                <Paragraph>
                                    Estado de caja
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>

                </Row>
            </div>
        </>
    );
};

export default HomePage;


{/* import { Link } from 'react-router-dom';

// ...

<Link to="/ruta-de-ventas">
  <Card title="Sistema de Ventas" style={{ width: 300, margin: '15px', backgroundColor: '#f0f0f0' }}>
    {/* Contenido de la card de Ventas */}
//   </Card>
// </Link>

// ... */}
