import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, InboxOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <>
            <h2 style={{ position: 'absolute', top: 0, width: '100%' }}>Sistema de ventas</h2>
            <Menu mode="horizontal" style={{ position: 'absolute', top: 50, width: '100%' }}>

                <Menu.Item key="inicio" icon={<HomeOutlined />}>
                    <Link to="/">Inicio</Link>
                </Menu.Item>

                <Menu.Item key="inventario" icon={<InboxOutlined />}>
                    <Link to="/sistema-ventas/mostrar-producto">Inventario</Link>
                </Menu.Item>

                <Menu.Item key="reportes" icon={<ReconciliationOutlined />}>
                    <Link to="/sistema-ventas/mostrar-reportes">Reportes</Link>
                </Menu.Item>

            </Menu>
        </>
    );
};

export default NavigationBar;
