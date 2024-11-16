import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../src/FireBase/fireBase';
import { HomeOutlined, InboxOutlined, ReconciliationOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'

const NavigationBar = ({ logout }) => {
    // Obtiene el objeto de ubicación actual de la aplicación (usado para detectar la ruta actual)
    const location = useLocation();
    // Estado que guarda la clave del ítem seleccionado en el menú de navegación, inicializado en una cadena vacía
    const [selectedKey, setSelectedKey] = useState('');
    // Estado que determina si el dispositivo es móvil o no, basado en el ancho de la ventana.
    // Si el ancho es menor o igual a 768px, se considera que es un dispositivo móvil.
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    // Actualiza el ítem seleccionado en el menú cuando cambia la ubicación de la página
    useEffect(() => {
        setSelectedKey(location.pathname); // Establece la clave del ítem del menú basado en la ruta actual
    }, [location]);  // Dependencia: se ejecuta cada vez que cambia la ubicación

    // Función para cerrar sesión y actualizar el estado de la caja en la base de datos
    const salir = async () => {
        const idCaja = sessionStorage.getItem('id');  // Obtiene el id de la caja almacenado en sessionStorage
        try {
            // Actualiza el estado de la caja en la colección "HistorialAperturaCaja"
            const docRefHistorial = doc(db, "HistorialAperturaCaja", idCaja); // Obtiene la referencia al documento
            await updateDoc(docRefHistorial, {
                Estado: false  // Actualiza el estado a 'false' indicando que la caja está cerrada
            });
            logout({ rol: "none" });  // Realiza el logout limpiando el rol de usuario
        } catch (e) {
            // Si ocurre un error, también realiza el logout para evitar que el usuario quede logueado
            logout({ rol: "none" });
        }
    };

    // Menú de navegación con sus respectivos ítems y submenús
    const items = [
        {
            label: 'Inicio',  // Título del ítem de menú
            key: 'inicio',    // Clave única para este ítem
            icon: <HomeOutlined />, // Ícono asociado con este ítem
            children: [ // Submenú con opciones de navegación relacionadas
                {
                    label: <Link to="/sistema-ventas">Inicio</Link>,  // Enlace al submenú "Inicio"
                    key: '/sistema-ventas',  // Clave única para el submenú
                },
                {
                    label: <Link to="/">Pagina principal</Link>,  // Enlace al submenú "Página principal"
                    key: 'inicio-general',  // Clave única para este submenú
                },
            ],
        },
        {
            label: 'Inventario', // Título del ítem de menú "Inventario"
            key: 'inventario',  // Clave única para este ítem
            icon: <InboxOutlined />,  // Ícono asociado con el ítem "Inventario"
            children: [ // Submenú con opciones relacionadas a la gestión de inventarios
                {
                    label: <Link to="/sistema-ventas/registrar-producto">Registrar producto</Link>,  // Enlace para registrar un nuevo producto
                    key: '/sistema-ventas/registrar-producto',  // Clave única para este subenlace
                },
                {
                    label: <Link to="/sistema-ventas/mostrar-productos">Mostrar productos</Link>,  // Enlace para mostrar los productos registrados
                    key: '/sistema-ventas/mostrar-productos',  // Clave única para este subenlace
                },
                {
                    label: <Link to="/sistema-ventas/incrementar-productos">Incrementar productos</Link>,  // Enlace para incrementar el stock de productos
                    key: '/sistema-ventas/incrementar-productos',  // Clave única para este subenlace
                },
                {
                    label: <Link to="/sistema-ventas/realizar-venta">Realizar venta</Link>,  // Enlace para realizar una venta
                    key: '/sistema-ventas/realizar-venta',  // Clave única para este subenlace
                },
            ],
        },
        {
            label: 'Reportes',  // Título del ítem de menú "Reportes"
            key: 'Reportes',   // Clave única para este ítem
            icon: <ReconciliationOutlined />, // Ícono asociado con el ítem "Reportes"
            children: [  // Submenú con opciones relacionadas a los reportes
                {
                    label: <Link to="/sistema-ventas/mostrar-reportes">Reportes de venta</Link>,  // Enlace para ver los reportes de venta
                    key: '/sistema-ventas/mostrar-reportes',  // Clave única para este subenlace
                },
                {
                    label: <Link to="/sistema-ventas/estado-caja">Estado de caja</Link>,  // Enlace para ver el estado de la caja
                    key: '/sistema-ventas/estado-caja',  // Clave única para este subenlace
                },
            ],
        },
        {
            label: 'Cerrar sesión',  // Título del ítem de menú "Cerrar sesión"
            key: 'cerrar',  // Clave única para este ítem
            icon: <LogoutOutlined />, // Ícono para el ítem de cerrar sesión
            style: { margin: isMobile ? '0' : '0 63%' }, // Estilo condicional según si el dispositivo es móvil
            onClick: () => { salir() }, // Acción para cerrar sesión al hacer clic
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
