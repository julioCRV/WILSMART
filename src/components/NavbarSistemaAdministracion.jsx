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

    // Verificación condicional para el estilo en el ítem de "Cerrar sesión"
    const items = [
        {
            label: 'Inicio',
            key: 'inicio',
            icon: <HomeOutlined />,
            children: [
                {
                    label: <Link to="/sistema-administración">Inicio</Link>,
                    key: '/sistema-administración',
                },
                // {
                //     label: <Link to="/">Pagina principal</Link>,
                //     key: 'inicio-general',
                // },
            ],
        },
        {
            label: 'Personal',
            key: 'personal',
            icon: <SolutionOutlined />,
            children: [
                {
                    label: <Link to="/sistema-administración/registro-empleado">Registrar empleado</Link>,
                    key: '/sistema-administración/registro-empleado',
                },
                {
                    label: <Link to="/sistema-administración/mostrar-empleados">Mostrar empleados</Link>,
                    key: '/sistema-administración/mostrar-empleados',
                },
                {
                    label: <Link to="/sistema-administración/generar-credenciales">Gestión de cuentas y credenciales</Link>,
                    key: '/sistema-administración/generar-credenciales',
                },
            ],
        },
        {
            label: <Link to="/sistema-administración/mostrar-dashboard">Dashboard</Link>,
            key: '/sistema-administración/mostrar-dashboard',
            icon: <BarChartOutlined />,
        },
        {
            label: <Link to="/">Cerrar sesión</Link>,
            key: 'cerrar',
            icon: <LogoutOutlined />,
            style: {
                marginLeft: isMobile ? '0' : 'auto', // Condicional: marginLeft 'auto' solo si no es móvil
            },
            onClick: () => { salir() },
        },
    ];



    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#000' }}>Sistema de administración</h2>
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
