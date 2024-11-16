import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SolutionOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './NavbarSistemaAdministracion.css'

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
        setSelectedKey(decodeURIComponent(location.pathname));
    }, [location]); // Este efecto se ejecuta cada vez que cambia la ubicación

    // Función para cerrar sesión y realizar el logout
    const salir = () => {
        logout({ rol: "none" }); // Llama a la función logout, pasando "none" como rol
    };

    // Array de items que representan las opciones del menú
    const items = [
        {
            // Opción para "Inicio" en el menú
            label: 'Inicio', // Título de la opción
            key: 'inicio', // Clave única para esta opción
            icon: <HomeOutlined />, // Icono de inicio
            children: [ // Subopciones dentro de "Inicio"
                {
                    label: <Link to="/sistema-administración">Inicio</Link>, // Enlace para ir al inicio del sistema de administración
                    key: '/sistema-administración', // Clave para la subopción
                },
                {
                    label: <Link to="/">Pagina principal</Link>, // Enlace para ir a la página principal
                    key: 'inicio-general', // Clave para la subopción
                },
            ],
        },
        {
            // Opción para "Personal" en el menú
            label: 'Personal', // Título de la opción
            key: 'personal', // Clave única para esta opción
            icon: <SolutionOutlined />, // Icono para personal
            children: [ // Subopciones dentro de "Personal"
                {
                    label: <Link to="/sistema-administración/registro-empleado">Registrar empleado</Link>, // Enlace para registrar empleados
                    key: '/sistema-administración/registro-empleado', // Clave para la subopción
                },
                {
                    label: <Link to="/sistema-administración/mostrar-empleados">Mostrar empleados</Link>, // Enlace para mostrar empleados
                    key: '/sistema-administración/mostrar-empleados', // Clave para la subopción
                },
                {
                    label: <Link to="/sistema-administración/generar-credenciales">Gestión de cuentas y credenciales</Link>, // Enlace para gestionar cuentas y credenciales
                    key: '/sistema-administración/generar-credenciales', // Clave para la subopción
                },
            ],
        },
        {
            // Opción para "Dashboard" en el menú
            label: <Link to="/sistema-administración/mostrar-dashboard">Dashboard</Link>, // Enlace para ver el dashboard
            key: '/sistema-administración/mostrar-dashboard', // Clave para el dashboard
            icon: <BarChartOutlined />, // Icono para el dashboard
        },
        {
            // Opción para "Cerrar sesión" en el menú
            label: <Link to="/">Cerrar sesión</Link>, // Enlace para cerrar sesión
            key: 'cerrar', // Clave para la opción de cerrar sesión
            icon: <LogoutOutlined />, // Icono para cerrar sesión
            style: { margin: isMobile ? '0' : '0 63%' }, // Estilo condicional según si es móvil o no
            onClick: () => { salir() } // Llama a la función salir cuando se haga clic
        },
    ];

    return (
        <>
            <h2 style={{ top: 0, width: '100%', color: '#black' }}>Sistema de administración</h2>
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
