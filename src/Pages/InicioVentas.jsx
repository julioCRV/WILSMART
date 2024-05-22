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
{/* 
                <Link to="/sistema-ventas"> */}
                    <Card title="Inventario" style={{ width: 250, marginLeft: '50px', backgroundColor: '#f0f0f0' }}>
                        <img src="/src/assets/img.png" alt="Ventas" style={{ width: '100px' }} />
                        <Paragraph>
                            Registro de productos
                        </Paragraph>
                    </Card>
                {/* </Link> */}


                {/* <Link to="/sistema-administración"> */}
                    <Card title="Inventario" style={{ width: 250, backgroundColor: '#f0f0f0' }}>
                        <img src="/src/assets/img.png" alt="Administración" style={{ width: '100px' }} />
                        <Paragraph>
                            Mostrar productos
                        </Paragraph>
                    </Card>
                {/* </Link> */}

                {/* <Link to="/sistema-administración"> */}
                <Card title="Inventario" style={{ width: 250, backgroundColor: '#f0f0f0' }}>
                        <img src="/src/assets/img.png" alt="Administración" style={{ width: '100px' }} />
                        <Paragraph>
                            Realizar venta
                        </Paragraph>
                    </Card>
                {/* </Link> */}

                {/* <Link to="/sistema-servicios"> */}
                    <Card title="Reportes" style={{ width: 250, marginRight: '50px', backgroundColor: '#f0f0f0' }}>
                        <img src="./src/assets/img.png" alt="Servicios" style={{ width: '100px' }} />
                        <Paragraph>
                            Reporte de ventas
                        </Paragraph>
                    </Card>
                {/* </Link> */}

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
