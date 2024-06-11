import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, InboxOutlined, ReconciliationOutlined, LogoutOutlined  } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    const { SubMenu } = Menu;
    return (
        <>
            <h2 style={{ top: 0, width: '100%', color: '#black' }}>Sistema de ventas</h2>
            <Menu mode="horizontal" defaultSelectedKeys={['inicio']} style={{ top: 50, width: '100%', border: '1px solid #000' }}>

                <SubMenu key="inicio1" icon={<HomeOutlined />} title="Inicio">
                    <Menu.Item key="inicio">
                        <Link to="/Sistema-ventas">Inicio</Link>
                    </Menu.Item>
                    <Menu.Item key="inicio-general">
                        <Link to="/">Pagina principal</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key="inventario" icon={<InboxOutlined />}>
                    <Link to="/sistema-ventas/mostrar-producto">Inventario</Link>
                </Menu.Item>

                <Menu.Item key="reportes" icon={<ReconciliationOutlined />}>
                    <Link to="/sistema-ventas/mostrar-reportes">Reportes</Link>
                </Menu.Item>

                <Menu.Item key="cerrar" icon={<LogoutOutlined />} style={{ margin: '0 63%' }}>
                    <Link to="/">Cerrar sesión</Link>
                </Menu.Item>
            </Menu>
        </>
    );
};

export default NavigationBar;
