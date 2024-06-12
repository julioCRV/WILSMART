import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SolutionOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './NavbarSistemaAdministracion.css'

const NavigationBar = () => {
    const { SubMenu } = Menu;

    return (
        <>
            <h2 style={{ top: 0, width: '100%', color: '#black' }}>Sistema de administración</h2>
            <Menu mode="horizontal" defaultSelectedKeys={['inicio-actual']} style={{ top: 50, width: '100%', border: '1px solid #000' }}>

                <SubMenu key="inicio" icon={<HomeOutlined />} title="Inicio">
                    <Menu.Item key="inicio-actual">
                        <Link to="/Sistema-administración/">Inicio</Link>
                    </Menu.Item>
                    <Menu.Item key="inicio-general">
                        <Link to="/">Pagina principal</Link>
                    </Menu.Item>
                </SubMenu>

                <SubMenu key="personal" icon={<SolutionOutlined />} title="Personal">
                    <Menu.Item key="registrar" >
                        <Link to="/sistema-administración/registro-empleado">Registrar empleado</Link>
                    </Menu.Item>
                    <Menu.Item key="mostrar" >
                        <Link to="/sistema-administración/mostrar-empleado">Mostrar empleados</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
                    <Link to="/sistema-administración/mostrar-dashboard">Dashboard</Link>
                </Menu.Item>

                <Menu.Item key="cerrar" icon={<LogoutOutlined />} style={{ margin: '0 63%' }}>
                    <Link to="/">Cerrar sesión</Link>
                </Menu.Item>

            </Menu>

        </>
    );
};

export default NavigationBar;
