import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SignatureOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <>
            <h2 style={{ position: 'absolute', top: 0, width: '100%' }}>Sistema de servicios</h2>
            <Menu mode="horizontal" style={{ position: 'absolute', top: 50, width: '100%' }}>

                <Menu.Item key="inicio" icon={<HomeOutlined />}>
                    <Link to="/">Inicio</Link>
                </Menu.Item>

                <Menu.Item key="repuestos" icon={<SignatureOutlined />}>
                    <Link to="/">Repuestos</Link>
                </Menu.Item>

                <Menu.Item key="clientes" icon={<TeamOutlined />}>
                    <Link to="/">Clientes</Link>
                </Menu.Item>

            </Menu>
        </>
    );
};

export default NavigationBar;
