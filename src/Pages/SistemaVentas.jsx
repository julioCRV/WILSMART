import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SolutionOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import InicioVentas from './InicioVentas';

const NavigationBar = () => {
    return (
        <>
            <h2 style={{ position: 'absolute', top: 0, width: '100%' }}>Sistema de ventas</h2>
            <Menu mode="horizontal" style={{ position: 'absolute', top: 50, width: '100%' }}>

                <Menu.Item key="home" icon={<HomeOutlined />}>
                    <Link to="/">Inicio</Link>
                </Menu.Item>

                <Menu.Item key="finances" icon={<SolutionOutlined />}>
                    <Link to="/finances">Inventario</Link>
                </Menu.Item>

                <Menu.Item key="health" icon={<BarChartOutlined />}>
                    <Link to="/health">Reportes</Link>
                </Menu.Item>

            </Menu>

            <InicioVentas />
        </>
    );
};

export default NavigationBar;
