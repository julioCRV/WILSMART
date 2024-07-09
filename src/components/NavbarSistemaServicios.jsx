import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SignatureOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = ({ logout }) => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    const items = [
        {
            label: 'Inicio',
            key: 'inicio',
            icon: <HomeOutlined />,
            children: [
                {
                    label: <Link to="/sistema-servicios">Inicio</Link>,
                    key: '/sistema-servicios',
                },
                {
                    label: <Link to="/">Pagina principal</Link>,
                    key: 'inicio-general',
                },
            ],
        },
        {
            label: 'Repuestos',
            key: 'repuestos',
            icon: <SignatureOutlined />,
            children: [
                {
                    label: <Link to="/sistema-servicios/registro-repuesto">Registrar repuesto</Link>,
                    key: '/sistema-servicios/registro-repuesto',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-repuestos">Mostrar repuestos</Link>,
                    key: '/sistema-servicios/mostrar-repuestos',
                },
            ],
        },
        {
            label: 'Clientes',
            key: 'clientes',
            icon: <TeamOutlined />,
            children: [
                {
                    label: <Link to="/sistema-servicios/registrar-ticket">Registrar ticket de atención</Link>,
                    key: '/sistema-servicios/registrar-ticket',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-tickets">Mostrar tickets de atención</Link>,
                    key: '/sistema-servicios/mostrar-tickets',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-registrarClientes">Registrar cliente</Link>,
                    key: '/sistema-servicios/mostrar-registrarClientes',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-clientes">Mostrar clientes</Link>,
                    key: '/sistema-servicios/mostrar-clientes',
                },
                {
                    label: <Link to="/sistema-servicios/registrar-clientePerdido">Registrar cliente perdido</Link>,
                    key: '/sistema-servicios/registrar-clientePerdido',
                },
                {
                    label: <Link to="/sistema-servicios/mostrar-clientesPerdidos">Mostrar clientes perdidos</Link>,
                    key: '/sistema-servicios/mostrar-clientesPerdidos',
                },
            ],
        },
        {
            label: <Link to="/">Cerrar sesión</Link>,
            key: 'cerrar',
            icon: <LogoutOutlined />,
            style: { margin: isMobile ? '0' : '0 63%' },
            onClick: () => { salir() },
        },
    ];

    return (
        <>
            <h2 style={{ top: 0, width: '100%' }}>Sistema de servicios</h2>
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
