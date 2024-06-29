import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, InboxOutlined, ReconciliationOutlined, LogoutOutlined } from '@ant-design/icons';
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
            <h2 style={{ top: 0, width: '100%', color: '#black' }}>Sistema de ventas</h2>
            <Menu mode="horizontal" selectedKeys={[selectedKey]} style={{ top: 50, width: '100%', border: '1px solid #000' }}>

                <SubMenu key="inicio" icon={<HomeOutlined />} title="Inicio">
                    <Menu.Item key="/sistema-ventas">
                        <Link to="/sistema-ventas">Inicio</Link>
                    </Menu.Item>
                    <Menu.Item key="inicio-general">
                        <Link to="/">Pagina principal</Link>
                    </Menu.Item>
                </SubMenu>

                <SubMenu key="inventario" icon={<InboxOutlined />} title="Inventario">
                    <Menu.Item key="/sistema-ventas/registrar-producto" >
                        <Link to="/sistema-ventas/registrar-producto">Registrar producto</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-ventas/mostrar-productos" >
                        <Link to="/sistema-ventas/mostrar-productos">Mostrar productos</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-ventas/incrementar-productos" >
                        <Link to="/sistema-ventas/incrementar-productos">Incrementar productos</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-ventas/realizar-venta" >
                        <Link to="/sistema-ventas/realizar-venta">Realizar venta</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key="/sistema-ventas/mostrar-reportes" icon={<ReconciliationOutlined />}>
                    <Link to="/sistema-ventas/mostrar-reportes">Reportes</Link>
                </Menu.Item>

                <Menu.Item key="cerrar" icon={<LogoutOutlined />} style={{ margin: '0 63%' }} onClick={salir}>
                    {/* <Link to="/">Cerrar sesión</Link> */}
                    Cerrar sesión
                </Menu.Item>
            </Menu>
        </>
    );
};

export default NavigationBar;
