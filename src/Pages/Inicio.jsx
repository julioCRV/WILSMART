import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
import './Inicio.css'

// Componente funcional que representa la página de inicio de la plataforma
const PaginaInicio = () => {
  return (
    <div>
      {/* Imagen del logo principal con un estilo básico */}
      <img src="/assets/logoW1.jpg" alt="Imagen de bienvenida" style={{ width: '100px' }} />
      
      {/* Título de bienvenida que describe la utilidad de la plataforma */}
      <Title level={4}>
        ¡Bienvenido a WilSmart! <br /> 
        Tu plataforma personalizada para impulsar la gestión de nuestra tienda 
        y ofrecer el mejor servicio <br /> a nuestros clientes.
      </Title>

      {/* Contenedor que organiza las opciones principales de la página */}
      <div className='cardDisenio'>
        {/* Distribución en filas y columnas usando el sistema de grillas de Ant Design */}
        <Row gutter={16}>
          
          {/* Primera opción: Sistema de Ventas */}
          <Col md={8}>
            <Link to="/iniciar-sesión/ventas">
              {/* Tarjeta con título e imagen representativa */}
              <Card title="Sistema de Ventas">
                <img src="/assets/logoVentas.png" alt="Ventas" style={{ maxWidth: '50%', height: 'auto' }} />
                {/* Descripción del sistema */}
                <Paragraph>
                  Gestiona tus compras y ventas de manera eficiente con nuestro sistema de ventas.
                </Paragraph>
              </Card>
            </Link>
          </Col>

          {/* Segunda opción: Sistema de Administración */}
          <Col md={8}>
            <Link to="/iniciar-sesión/administración">
              <Card title="Sistema de Administración">
                <img src="/assets/logoAdministracion.png" alt="Administración" style={{ maxWidth: '50%', height: 'auto' }} />
                <Paragraph>
                  Controla y organiza tus procesos administrativos con nuestro sistema especializado.
                </Paragraph>
              </Card>
            </Link>
          </Col>

          {/* Tercera opción: Sistema de Servicios */}
          <Col xs={24} sm={24} md={8}>
            <Link to="/iniciar-sesión/servicios">
              <Card title="Sistema de Servicios">
                <img src="/assets/logoServicios.png" alt="Servicios" style={{ maxWidth: '40%', height: 'auto' }} />
                <Paragraph>
                  Ofrece servicios de alta calidad a tus clientes utilizando nuestro sistema de servicios.
                </Paragraph>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PaginaInicio;
