import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SignatureOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = ({ logout }) => {
    const { SubMenu } = Menu;
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('');

    useEffect(() => {
        setSelectedKey(location.pathname);
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
            <h2 style={{ top: 0, width: '100%' }}>Sistema de servicios</h2>
            <Menu mode="horizontal" selectedKeys={[selectedKey]} style={{ top: 50, width: '100%', border: '1px solid #000' }}>

                <SubMenu key="inicio" icon={<HomeOutlined />} title="Inicio">
                    <Menu.Item key="/sistema-servicios">
                        <Link to="/sistema-servicios">Inicio</Link>
                    </Menu.Item>
                    <Menu.Item key="inicio-general">
                        <Link to="/">Pagina principal</Link>
                    </Menu.Item>
                </SubMenu>

                <SubMenu key="repuestos" icon={<SignatureOutlined />} title="Repuestos">
                    <Menu.Item key="/sistema-servicios/registro-repuesto" >
                        <Link to="/sistema-servicios/registro-repuesto">Registrar repuesto</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-servicios/mostrar-repuestos" >
                        <Link to="/sistema-servicios/mostrar-repuestos">Mostrar repuestos</Link>
                    </Menu.Item>
                </SubMenu>

                <SubMenu key="clientes" icon={<TeamOutlined />} title="Clientes">
                    <Menu.Item key="/sistema-servicios/registrar-ticket" >
                        <Link to="/sistema-servicios/registrar-ticket">Registrar ticket de atención</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-servicios/mostrar-registrarClientes" >
                        <Link to="/sistema-servicios/mostrar-registrarClientes">Registrar cliente</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-servicios/registrar-clientePerdido" >
                        <Link to="/sistema-servicios/registrar-clientePerdido">Registrar cliente perdido</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-servicios/mostrar-tickets" >
                        <Link to="/sistema-servicios/mostrar-tickets">Mostrar tickets de atención</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-servicios/mostrar-clientes" >
                        <Link to="/sistema-servicios/mostrar-clientes">Mostrar clientes</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-servicios/mostrar-clientesPerdidos" >
                        <Link to="/sistema-servicios/mostrar-clientesPerdidos">Mostrar clientes perdidos</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key="cerrar" icon={<LogoutOutlined />} style={{ margin: '0 63%' }} onClick={salir}>
                    <Link to="/">Cerrar sesión</Link>
                </Menu.Item>
            </Menu>
        </>
    );
};

export default NavigationBar;
