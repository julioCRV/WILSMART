import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
import './Inicio.css'

const HomePage = () => {
  return (
    <div >
      <img src="/assets/logoW1.jpg" alt="Imagen de bienvenida" style={{ width: '100px' }} />
      <Title level={4}>
        ¡Bienvenido a WilSmart! <br /> Tu plataforma personalizada para impulsar la gestión de nuestra tienda y ofrecer el mejor servicio <br /> a nuestros clientes.
      </Title>

      <div className='cardDisenio'>
        <Row gutter={16}>
          <Col md={8}>
            <Link to="/sistema-ventas">
              {/* <Link to="/iniciar-sesion/ventas"> */}
              <Card title="Sistema de ventas" >
                <img src="/assets/logoVentas.png" alt="Ventas" style={{ maxWidth: '80%', height: 'auto' }} />
                <Paragraph>
                  Gestiona tus compras y ventas de manera eficiente con nuestro sistema de ventas.
                </Paragraph>
              </Card>
            </Link>
          </Col>

          <Col md={8}>
            <Link to="/sistema-administración">
              {/* <Link to="/iniciar-sesion/administración"> */}
              <Card title="Sistema de administración" >
                <img src="/assets/logoAdministracion.png" alt="Administración" style={{ maxWidth: '80%', height: 'auto' }} />
                <Paragraph>
                  Controla y organiza tus procesos administrativos con nuestro sistema especializado.
                </Paragraph>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Link to="/sistema-servicios">
              {/* <Link to="/iniciar-sesion/servicios"> */}
              <Card title="Sistema de servicios" >
                <img src="/assets/logoServicios.png" alt="Servicios" style={{ maxWidth: '70%', height: 'auto' }} />
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

export default HomePage;


{/* import { Link } from 'react-router-dom';

// ...

<Link to="/ruta-de-ventas">
  <Card title="Sistema de Ventas" style={{ width: 300, margin: '15px', backgroundColor: '#f0f0f0' }}>
    {/* Contenido de la card de Ventas */}
//   </Card>
// </Link>

// ... */}

