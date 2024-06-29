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
                <Link to="/sistema-servicios/registro-repuesto">
                    <Card title="Repuestos" style={{ width: 300, marginLeft: '120px', backgroundColor: '#f0f0f0' }}>
                        <img src="/assets/agregarRepuesto.png" alt="Ventas" style={{ width: '100px' }} />
                        <Paragraph>
                            Registro de repuesto
                        </Paragraph>
                    </Card>
                </Link>


                <Link to="/sistema-servicios/mostrar-repuestos">
                    <Card title="Repuestos" style={{ width: 300, backgroundColor: '#f0f0f0' }}>
                        <img src="/assets/mostrarRepuestos.png" alt="Administración" style={{ width: '100px' }} />
                        <Paragraph>
                            Mostrar repuestos
                        </Paragraph>
                    </Card>
                </Link>

                <Link to="/sistema-servicios/mostrar-clientes">
                    <Card title="Clientes" style={{ width: 300, marginRight: '120px', backgroundColor: '#f0f0f0' }}>
                        <img src="/assets/listarClientes.png" alt="Servicios" style={{ width: '100px' }} />
                        <Paragraph>
                            Listar clientes
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
