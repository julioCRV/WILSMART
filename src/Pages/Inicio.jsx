import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';
const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <img src="/assets/logoWilSmart.jpg" alt="Imagen de bienvenida" style={{ width: '80px' }} />
      <Title level={4}>
        ¡Bienvenido a WilSmart! <br/> Tu plataforma personalizada para impulsar la gestión de nuestra tienda y ofrecer el mejor servicio <br/> a nuestros clientes.
      </Title>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

        <Link to="/sistema-ventas">
          <Card title="Sistema de Ventas" style={{ width: 300, marginLeft: '120px', backgroundColor: '#f0f0f0' }}>
            <img src="/assets/logoVentas.png" alt="Ventas" style={{ width: '250px' }} />
            <Paragraph>
              Gestiona tus ventas de manera eficiente con nuestro sistema de ventas.
            </Paragraph>
          </Card>
        </Link>


        <Link to="/sistema-administración">
          <Card title="Sistema de Administración" style={{ width: 300, backgroundColor: '#f0f0f0' }}>
            <img src="/assets/logoAdministracion.png" alt="Administración" style={{ width: '250px' }} />
            <Paragraph>
              Controla y organiza tus procesos administrativos con nuestro sistema especializado.
            </Paragraph>
          </Card>
        </Link>

        <Link to="/sistema-servicios">
          <Card title="Sistema de Servicios" style={{ width: 300, marginRight: '120px', backgroundColor: '#f0f0f0' }}>
            <img src="/assets/logoServicios.png" alt="Servicios" style={{ width: '200px' }} />
            <Paragraph>
              Ofrece servicios de alta calidad a tus clientes utilizando nuestro sistema de servicios.
            </Paragraph>
          </Card>
        </Link>

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
