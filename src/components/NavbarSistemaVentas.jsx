import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../src/FireBase/fireBase';
import { HomeOutlined, InboxOutlined, ReconciliationOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'

const NavigationBar = ({ logout }) => {
    const { SubMenu } = Menu;
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
            logout({ rol: "none" });
            // console.error("Error processing request: ", e);
        }
    };

    const items = [
        {
            label: 'Inicio',
            key: 'inicio',
            icon: <HomeOutlined />,
            children: [
                {
                    label: <Link to="/sistema-ventas">Inicio</Link>,
                    key: '/sistema-ventas',
                },
                {
                    label: <Link to="/">Pagina principal</Link>,
                    key: 'inicio-general',
                },
            ],
        },
        {
            label: 'Inventario',
            key: 'inventario',
            icon: <InboxOutlined />,
            children: [
                {
                    label: <Link to="/sistema-ventas/registrar-producto">Registrar producto</Link>,
                    key: '/sistema-ventas/registrar-producto',
                },
                {
                    label: <Link to="/sistema-ventas/mostrar-productos">Mostrar productos</Link>,
                    key: '/sistema-ventas/mostrar-productos',
                },
                {
                    label: <Link to="/sistema-ventas/incrementar-productos">Incrementar productos</Link>,
                    key: '/sistema-ventas/incrementar-productos',
                },
                {
                    label: <Link to="/sistema-ventas/realizar-venta">Realizar venta</Link>,
                    key: '/sistema-ventas/realizar-venta',
                },
            ],
        },
        {
            label: 'Reportes',
            key: 'Reportes',
            icon: <ReconciliationOutlined />,
            children: [
                {
                    label: <Link to="/sistema-ventas/mostrar-reportes">Reportes de venta</Link>,
                    key: '/sistema-ventas/mostrar-reportes',
                },
                {
                    label: <Link to="/sistema-ventas/estado-caja">Estado de caja</Link>,
                    key: '/sistema-ventas/estado-caja',
                },
            ],
        },
        {
            label: 'Cerrar sesión',
            key: 'cerrar',
            icon: <LogoutOutlined />,
            style: { margin: isMobile ? '0' : '0 63%' },
            onClick: () => { salir() },
        },
    ];
    

    return (
        <>
            <h2 style={{ top: 0, width: '100%', color: '#black' }}>Sistema de ventas</h2>
            <Menu
                mode={isMobile ? "inline" : "horizontal"}
                selectedKeys={[selectedKey]}
                style={{ top: 50, width: '100%', border: '1px solid #000' }}
                items={items}
            />
        </>
    );
};

export default NavigationBar;
