import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
import './Inicios.css'

const HomePage = () => {
    // Se desestructura el componente Typography para usar Title y Paragraph
    const { Title, Paragraph } = Typography;

    return (
        <div style={{ textAlign: 'center' }}>
            {/* Título de nivel 4, centrado */}
            <Title level={4}>
                WilSmart
            </Title>

            {/* Contenedor para los "Ecards" */}
            <div className='EcardVentas'>
                {/* Grid para organizar las tarjetas (Cards) en filas y columnas */}
                <Row gutter={16}>
                    {/* Columna para la primera tarjeta: Registro de empleado */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Enlace para navegar a la página de registro de empleados */}
                        <Link to="/sistema-administración/registro-empleado">
                            {/* Tarjeta con título Personal */}
                            <Card title="Personal">
                                {/* Imagen dentro de la tarjeta */}
                                <img src="/assets/registroEmpleados.jpg" alt="Ventas" style={{ height: '50px' }} />
                                {/* Descripción bajo la imagen */}
                                <Paragraph>
                                    Registrar empleado
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>

                    {/* Columna para la segunda tarjeta: Mostrar empleados */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Enlace para navegar a la página de mostrar empleados */}
                        <Link to="/sistema-administración/mostrar-empleados">
                            {/* Tarjeta con título Personal */}
                            <Card title="Personal">
                                {/* Imagen dentro de la tarjeta */}
                                <img src="/assets/listaEmpleados.png" alt="Administración" style={{ height: '50px' }} />
                                {/* Descripción bajo la imagen */}
                                <Paragraph>
                                    Mostrar empleados
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>

                    {/* Columna para la tercera tarjeta: Generar credenciales */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Enlace para navegar a la página de generar credenciales */}
                        <Link to="/sistema-administración/generar-credenciales">
                            {/* Tarjeta con título Personal */}
                            <Card title="Personal">
                                {/* Imagen dentro de la tarjeta */}
                                <img src="/assets/credenciales.png" alt="Administración" style={{ height: '50px' }} />
                                {/* Descripción bajo la imagen */}
                                <Paragraph>
                                    Generar credenciales
                                </Paragraph>
                            </Card>
                        </Link>
                    </Col>

                    {/* Columna para la cuarta tarjeta: Mostrar dashboard */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {/* Enlace para navegar a la página del dashboard */}
                        <Link to="/sistema-administración/mostrar-dashboard">
                            {/* Tarjeta con título Dashboard */}
                            <Card title="Dashboard">
                                {/* Imagen dentro de la tarjeta */}
                                <img src="/assets/dashboard.png" alt="Servicios" style={{ height: '50px' }} />
                                {/* Descripción bajo la imagen */}
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
