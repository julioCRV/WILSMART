import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
import './Inicio.css'

// Componente funcional que representa la página de inicio del administrador
const PaginaInicioAdiministrador = () => {
  return (
    <div>
      {/* Imagen del logo principal para mantener la identidad visual */}
      <img src="/assets/logoW1.jpg" alt="Imagen de bienvenida" style={{ width: '100px' }} />
      
      {/* Título principal de bienvenida, describiendo el propósito de la plataforma */}
      <Title level={4}>
        ¡Bienvenido a WilSmart! <br />
        Tu plataforma personalizada para impulsar la gestión de nuestra tienda 
        y ofrecer el mejor servicio <br /> a nuestros clientes.
      </Title>

      {/* Contenedor de las tarjetas principales con estilo personalizado */}
      <div className='cardDisenio'>
        <Row gutter={16}>
          
          {/* Primera tarjeta: Sistema de Ventas */}
          <Col md={8}>
            <Link to="/sistema-ventas">
              <Card title="Sistema de ventas">
                <img src="/assets/logoVentas.png" alt="Ventas" style={{ maxWidth: '50%', height: 'auto' }} />
                <Paragraph>
                  Gestiona tus compras y ventas de manera eficiente con nuestro sistema de ventas.
                </Paragraph>
              </Card>
            </Link>
          </Col>

          {/* Segunda tarjeta: Sistema de Administración */}
          <Col md={8}>
            <Link to="/sistema-administración">
              <Card title="Sistema de administración">
                <img src="/assets/logoAdministracion.png" alt="Administración" style={{ maxWidth: '50%', height: 'auto' }} />
                <Paragraph>
                  Controla y organiza tus procesos administrativos con nuestro sistema especializado.
                </Paragraph>
              </Card>
            </Link>
          </Col>

          {/* Tercera tarjeta: Sistema de Servicios */}
          <Col xs={24} sm={24} md={8}>
            <Link to="/sistema-servicios">
              <Card title="Sistema de servicios">
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

export default PaginaInicioAdiministrador;
