import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HomePage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Title level={4}>
                WilSmart
            </Title>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/sistema-administración/registro-empleado">
                    <Card title="Personal" style={{ width: 300, marginLeft: '120px', backgroundColor: '#f0f0f0' }}>
                    <img src="/assets/registroEmpleados.jpg" alt="Ventas" style={{ width: '100px' }} />

                        <Paragraph>
                            Registro de empleados
                        </Paragraph>
                    </Card>
                </Link>


                <Link to="/sistema-administración/mostrar-empleado">
                <Card title="Personal" style={{ width: 300, backgroundColor: '#f0f0f0' }}>
                    <img src="/assets/listaEmpleados.png" alt="Administración" style={{ width: '100px' }} />
                    <Paragraph>
                        Mostrar empleados
                    </Paragraph>
                </Card>
                </Link>

                <Link to="/sistema-administración/mostrar-dashboard">
                <Card title="Dashboard" style={{ width: 300, marginRight: '120px', backgroundColor: '#f0f0f0' }}>
                    <img src="/assets/dashboard.png" alt="Servicios" style={{ width: '100px' }} />
                    <Paragraph>
                        Mostrar dashboard
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
