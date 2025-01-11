import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SignatureOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = ({ logout }) => {
    // Hook que proporciona el objeto location, que contiene información sobre la ruta actual
    const location = useLocation(); // Permite acceder a la ubicación actual de la aplicación
    // Estado para almacenar la clave del ítem seleccionado en el menú
    const [selectedKey, setSelectedKey] = useState(''); // La clave se usa para saber qué elemento del menú está seleccionado
    // Estado para manejar el tamaño de la pantalla y detectar si es un dispositivo móvil
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Establece el estado inicial a 'true' si la pantalla es de tamaño móvil (ancho <= 768px)

    // useEffect para actualizar el estado de la clave seleccionada basada en la ruta actual
    useEffect(() => {
        // Decodifica la URL actual y establece la clave seleccionada
        setSelectedKey(location.pathname);
    }, [location]); // Este efecto se ejecuta cada vez que cambia la ubicación

    // Función para cerrar sesión y realizar el logout
    const salir = () => {
        logout({ rol: "none" }); // Llama a la función logout, pasando "none" como rol
    };

    const items = [
        // Primer ítem del menú - "Inicio"
        {
            label: <Link to="/sistema-servicios">Inicio</Link>, // Enlace directo al elemento
            key: '/sistema-servicios', // Clave única
            icon: <HomeOutlined />, // Ícono asociado con este ítem
        },
        // Segundo ítem del menú - "Repuestos"
        {
            label: 'Repuestos',
            key: 'repuestos',
            icon: <SignatureOutlined />, // Ícono para este ítem
            children: [ // Submenú con opciones de repuestos
                {
                    label: <Link to="/sistema-servicios/registro-repuesto">Registrar repuesto</Link>, // Subenlace para registrar un repuesto
                    key: '/sistema-servicios/registro-repuesto',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-repuestos">Mostrar repuestos</Link>, // Subenlace para mostrar repuestos registrados
                    key: '/sistema-servicios/mostrar-repuestos',
                },
            ],
        },
        // Tercer ítem del menú - "Clientes"
        {
            label: 'Clientes',
            key: 'clientes',
            icon: <TeamOutlined />, // Ícono para este ítem
            children: [ // Submenú con varias opciones relacionadas a clientes
                {
                    label: <Link to="/sistema-servicios/mostrar-tickets">Mostrar tickets de atención</Link>, // Subenlace para ver tickets de clientes
                    key: '/sistema-servicios/mostrar-tickets',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-registrarClientes">Registrar cliente</Link>, // Subenlace para registrar un cliente
                    key: '/sistema-servicios/mostrar-registrarClientes',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-clientes">Mostrar clientes</Link>, // Subenlace para ver clientes registrados
                    key: '/sistema-servicios/mostrar-clientes',
                },
                {
                    label: <Link to="/sistema-servicios/registrar-clientePerdido">Registrar cliente perdido</Link>, // Subenlace para registrar un cliente perdido
                    key: '/sistema-servicios/registrar-clientePerdido',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-clientesPerdidos">Mostrar clientes perdidos</Link>, // Subenlace para ver los clientes perdidos
                    key: '/sistema-servicios/mostrar-clientesPerdidos',
                },
            ],
        },
        // Último ítem del menú - "Cerrar sesión"
        {
            label: <Link to="/">Cerrar sesión</Link>, // Subenlace para cerrar sesión
            key: 'cerrar',  // Clave única para este ítem
            icon: <LogoutOutlined />, // Ícono para este ítem
            style: {
                marginLeft: isMobile ? '0' : 'auto', // Condicional: marginLeft 'auto' solo si no es móvil
            },
            onClick: () => { salir() }, // Función que se ejecuta al hacer clic para salir
        },
    ];

    return (
        <>
            <h2 style={{ top: 0, width: '100%' }}>Sistema de servicios</h2>
            <div style={{ width: isMobile ? '90%' : '100%', margin: '0 auto' }}>
                <Menu
                    mode={isMobile ? "inline" : "horizontal"}
                    selectedKeys={[selectedKey]}
                    style={{ top: 50, width: '100%', border: '1px solid #000' }}
                    items={items}
                />
            </div>
        </>
    );
};

export default NavigationBar;
