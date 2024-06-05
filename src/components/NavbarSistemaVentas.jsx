import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, InboxOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <>
            <h2 style={{ top: 0, width: '100%' , color: '#black'}}>Sistema de ventas</h2>
            <Menu mode="horizontal" style={{ top: 50, width: '100%',   border: '1px solid #000' }}>

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
