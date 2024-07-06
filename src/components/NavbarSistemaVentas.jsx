import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../src/FireBase/fireBase';
import { HomeOutlined, InboxOutlined, ReconciliationOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = ({ logout }) => {
    const { SubMenu } = Menu;
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('');

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location]);

    const salir = async () => {
        const idCaja = sessionStorage.getItem('id');
        try {
            // Actualizar documento en la colección "HistorialAperturaCaja"
            const docRefHistorial = doc(db, "HistorialAperturaCaja", idCaja);
            await updateDoc(docRefHistorial, {
                Estado: false
            });
            // message.success('Cierre de caja realizado exitosamente.');
            // sessionStorage.removeItem('id');
            // reloadCurrentRoute();
            logout({ rol: "none" });
        } catch (e) {
            console.error("Error processing request: ", e);
        }
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

                <SubMenu key="Reportes" icon={<ReconciliationOutlined />} title="Reportes">
                    <Menu.Item key="/sistema-ventas/mostrar-reportes" >
                        <Link to="/sistema-ventas/mostrar-reportes">Reportes de venta</Link>
                    </Menu.Item>
                    <Menu.Item key="/sistema-ventas/estado-caja" >
                        <Link to="/sistema-ventas/estado-caja">Estado de caja</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key="cerrar" icon={<LogoutOutlined />} style={{ margin: '0 63%' }} onClick={salir}>
                    {/* <Link to="/">Cerrar sesión</Link> */}
                    Cerrar sesión
                </Menu.Item>
            </Menu>
        </>
    );
};

export default NavigationBar;
