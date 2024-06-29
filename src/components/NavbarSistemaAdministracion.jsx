import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SolutionOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './NavbarSistemaAdministracion.css'

const NavigationBar = ({ logout }) => {
    const { SubMenu } = Menu;
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('');

    useEffect(() => {
        setSelectedKey(decodeURIComponent(location.pathname));
    }, [location]);

    const salir = () => {
        logout({ rol: "none" });
        // signInWithEmailAndPassword(auth, email, password)
        //   .then((userCredential) => {
        //     // console.log(userCredential.user);
        //     console.log("Puede ingresar");
        //     login({rol: "administrador"})
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
    };

    return (
        <>
            <h2 style={{ top: 0, width: '100%', color: '#black' }}>Sistema de administración</h2>
            <Menu mode="horizontal" selectedKeys={[selectedKey]} style={{ top: 50, width: '100%', border: '1px solid #000' }}>

                <SubMenu key="inicio" icon={<HomeOutlined />} title="Inicio">
                    <Menu.Item key="/sistema-administración">
                        <Link to="/sistema-administración">Inicio</Link>
                    </Menu.Item>
                    <Menu.Item key="inicio-general">
                        <Link to="/">Pagina principal</Link>
                    </Menu.Item>
                </SubMenu>

                <SubMenu key="personal" icon={<SolutionOutlined />} title="Personal">
                    <Menu.Item key="/sistema-administración/registro-empleado" >
                        <Link to="/sistema-administración/registro-empleado">Registrar empleado</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-administración/mostrar-empleados" >
                        <Link to="/sistema-administración/mostrar-empleados">Mostrar empleados</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key="/sistema-administración/mostrar-dashboard" icon={<BarChartOutlined />}>
                    <Link to="/sistema-administración/mostrar-dashboard">Dashboard</Link>
                </Menu.Item>

                <Menu.Item key="cerrar" icon={<LogoutOutlined />} style={{ margin: '0 63%' }} onClick={salir}>
                    <Link to="/">Cerrar sesión</Link>
                </Menu.Item>

            </Menu>

        </>
    );
};

export default NavigationBar;
