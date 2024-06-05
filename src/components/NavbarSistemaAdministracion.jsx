import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SolutionOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <>
            <h2 style={{ top: 0, width: '100%', color: '#black' }}>Sistema de administración</h2>
            <Menu mode="horizontal" style={{ top: 50, width: '100%',   border: '1px solid #000' }}>

                <Menu.Item key="inicio" icon={<HomeOutlined />}>
                    <Link to="/">Inicio</Link>
                </Menu.Item>

                <Menu.Item key="personal" icon={<SolutionOutlined />}>
                    <Link to="/sistema-administración/mostrar-empleado">Personal</Link>
                </Menu.Item>

                <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
                    <Link to="/sistema-administración/mostrar-dashboard">Dashboard</Link>
                </Menu.Item>

            </Menu>
        </>
    );
};

export default NavigationBar;
