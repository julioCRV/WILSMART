import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SolutionOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './NavbarSistemaAdministracion.css'

const NavigationBar = ({ logout }) => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
                {
                    label: <Link to="/">Pagina principal</Link>,
                    key: 'inicio-general',
                },
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
                    label: <Link to="/sistema-administración/generar-credenciales">Generar credenciales</Link>,
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
            style: { margin: isMobile ? '0' : '0 63%' },
            onClick: () => { salir() }
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
