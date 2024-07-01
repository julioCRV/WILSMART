import React, { useState, useEffect } from 'react';
import './App.css'
import { Navigate, Routes, Route } from "react-router-dom";

//  R U T A S     P R I N C I P A L E S
import Inicio from './Pages/Inicio';
import InicioAdmi from './Pages/InicioAdministrador'
import IniciarSesionA from './Pages/Sistema administración/IniciarSesionAdministración';
import IniciarSesionV from './Pages/Sistema ventas/IniciarSesionVentas';
import IniciarSesionS from './Pages/Sistema servicios/IniciarSesionServicios';

//  V  E  N  T  A  S
import NavbarSisVentas from './components/NavbarSistemaVentas';
import InicioSisVentas from './components/InicioVentas';
import RegistrarProducto from './Pages/Sistema ventas/RegistrarProducto';
import EditarProducto from './Pages/Sistema ventas/EditarProducto'
import MostrarProductos from './Pages/Sistema ventas/MostrarProductos';
import IncrementarProductos from './Pages/Sistema ventas/IncrementarProductos'
import RealizarVenta from './Pages/Sistema ventas/RealizarVenta';
import ReporteVentas from './Pages/Sistema ventas/ReporteVentas';

//  A  D  M  I  N  I  S  T  R  A  C  I  Ó  N 
import NavbarSisAdministracion from './components/NavbarSistemaAdministracion';
import InicioSisAdministracion from './components/InicioAdministracion';
import RegistroEmpleado from './Pages/Sistema administración/RegistroEmpleado';
import EditarEmpleado from './Pages/Sistema administración/EditarEmpleado';
import MostrarEmpleado from './Pages/Sistema administración/MostrarPersonal';
import MostrarDashboard from './Pages/Sistema administración/MostrarDashboard';
import GenerarCredenciales from './Pages/Sistema administración/GenerarCredenciales';

//  S  E  R  V  I  C  I  O  S
import NavbarSisServicios from './components/NavbarSistemaServicios';
import InicioSisServicios from './components/InicioServicios';
import RegistrarRepuesto from './Pages/Sistema servicios/RegistrarRepuesto';
import EditarRepuesto from './Pages/Sistema servicios/EditarRepuestos';
import MostrarRepuestos from './Pages/Sistema servicios/MostrarRepuestos';
import RegistrarTicketAtencion from './Pages/Sistema servicios/RegistrarTicketAtencion';
import MostrarTicketsAtencion from './Pages/Sistema servicios/MostrarTickets';
import RegistrarCliente from './Pages/Sistema servicios/RegistrarCliente';
import MostrarClientes from './Pages/Sistema servicios/MostrarClientes';
import EditarClientes from './Pages/Sistema servicios/EditarClientes';
import RegistrarClientePerdido from './Pages/Sistema servicios/RegistrarClientePerdido';
import MostrarClientesPerdidos from './Pages/Sistema servicios/MostrarClientesPerdidos';
import MostrarRegistrarClientes from './Pages/Sistema servicios/MostrarRegistrarClientes';

// P R U E B A 
import Prueba6 from './papelerajsjsjjs/prueba6'
import Prueba7 from './papelerajsjsjjs/pruebaResponsive'
import Prueba from './papelerajsjsjjs/prueba'
import Prueba3 from './papelerajsjsjjs/prueba3'
import Prueba4 from './papelerajsjsjjs/prueba4'
import Prueba5 from './papelerajsjsjjs/prueba5'

function App() {
  const [rol, setRol] = useState(sessionStorage.getItem('saveRol'));

  useEffect(() => {
    setRol(sessionStorage.getItem('saveRol'));
  }, [rol]);

  const handleLogin = (userData) => {
    setRol(userData.sistemaAsignado);
    // if (sessionStorage.getItem('saveRol') == null) {
    //   sessionStorage.setItem('saveRol', userData.rol)
    // }
  };

  const handleLogout = (userData) => {
    // console.log(userData);
    // console.log('lo logro señor');
    setRol(null);
    sessionStorage.removeItem('saveRol');
    // if (sessionStorage.getItem('saveRol') == null) {
    //   sessionStorage.setItem('saveRol', userData.rol)
    // }
  };

  return (
    <div className='App'>
      {/* <Prueba /> */}
      {/* <Prueba3/> */}
      {/*<Prueba4 id="7gsP6wg9iYVsE9UWjm5h" />
      <Prueba5/> */}
      {/* <Prueba6 /> */}
      {/* <Prueba7/> */}

      {rol === null ? (
        <>
          <Routes>
            <Route path='/' element={<Inicio />}></Route>
            <Route path="/iniciar-sesión/administración" element={<IniciarSesionA login={handleLogin} />} />
            <Route path="/iniciar-sesión/ventas" element={<IniciarSesionV login={handleLogin} />} />
            <Route path="/iniciar-sesión/servicios" element={<IniciarSesionS login={handleLogin} />} />
            <Route path='*' element={<Navigate to="/"></Navigate>}></Route>
          </Routes>
        </>
      ) : (
        <>
          {rol === 'administrador@gmail.com' ? (
            <>
              <Routes>
                <Route path='/' element={<InicioAdmi />}></Route>
                <Route path='/sistema-ventas/*' element={<SistemaVentas logout={handleLogout} />}></Route>
                <Route path='/sistema-administración/*' element={<SistemaAdministracion logout={handleLogout} />}></Route>
                <Route path='/sistema-servicios/*' element={<SistemaServicios logout={handleLogout} />}></Route>
                <Route path='*' element={<Navigate to="/"></Navigate>}></Route>
              </Routes>
            </>
          ) : (
            <>
              {rol === 'Sistema de ventas' ? (
                <>
                  <Routes>
                    <Route path='/' element={<InicioAdmi />}></Route>
                    <Route path='/sistema-ventas/*' element={<SistemaVentas logout={handleLogout} />}></Route>
                    <Route path='*' element={<Navigate to="/"></Navigate>}></Route>
                  </Routes>
                </>
              ) : (
                <>
                  {rol === 'Sistema de servicios' ? (
                    <>
                      <Routes>
                        <Route path='/' element={<InicioAdmi />}></Route>
                        <Route path='/sistema-servicios' element={<SistemaServicios logout={handleLogout} />}></Route>
                        <Route path='*' element={<Navigate to="/"></Navigate>}></Route>
                      </Routes>
                    </>
                  ) : (
                    <>
                      <Routes>
                        <Route path='/' element={<Inicio />}></Route>
                        <Route path="/iniciar-sesión" element={<IniciarSesionA login={handleLogin} />} />
                        <Route path='*' element={<Navigate to="/iniciar-sesión"></Navigate>}></Route>
                      </Routes>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function SistemaVentas({ logout }) {
  const handleLogout = (userData) => {
    // console.log(userData);
    logout(userData.rol);
    // if (sessionStorage.getItem('saveRol') == null) {
    //   sessionStorage.setItem('saveRol', userData.rol)
    // }
  };

  return (
    <div>
      <NavbarSisVentas logout={handleLogout} />
      <Routes>
        <Route path='/' element={<InicioSisVentas />} />
        <Route path='/registrar-producto' element={<RegistrarProducto />}></Route>
        <Route path='/editar-producto' element={<EditarProducto />}></Route>
        <Route path='/mostrar-productos' element={<MostrarProductos />}></Route>
        <Route path='/incrementar-productos' element={<IncrementarProductos />}></Route>
        <Route path='/realizar-venta' element={<RealizarVenta />}></Route>
        <Route path='/mostrar-reportes' element={<ReporteVentas />}></Route>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function SistemaAdministracion({ logout }) {
  const handleLogout = (userData) => {
    // console.log(userData);
    logout(userData.rol);
    // if (sessionStorage.getItem('saveRol') == null) {
    //   sessionStorage.setItem('saveRol', userData.rol)
    // }
  };
  return (
    <div>
      <NavbarSisAdministracion logout={handleLogout} />
      <Routes>
        <Route path='/' element={<InicioSisAdministracion />} />
        <Route path='/registro-empleado' element={<RegistroEmpleado />}></Route>
        <Route path='/mostrar-empleados' element={<MostrarEmpleado />}></Route>
        <Route path='/editar-empleado' element={<EditarEmpleado />}></Route>
        <Route path='/mostrar-dashboard' element={<MostrarDashboard />}></Route>
        <Route path='/generar-credenciales' element={<GenerarCredenciales />}></Route>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function SistemaServicios({ logout }) {
  const handleLogout = (userData) => {
    // console.log(userData);
    logout(userData.rol);
    // if (sessionStorage.getItem('saveRol') == null) {
    // }
  };
  return (
    <div>
      <NavbarSisServicios logout={handleLogout} />
      <Routes>
        <Route path='/' element={<InicioSisServicios />} />
        <Route path='/registro-repuesto' element={<RegistrarRepuesto />}></Route>
        <Route path='/mostrar-repuestos' element={<MostrarRepuestos />}></Route>
        <Route path='/editar-repuesto' element={<EditarRepuesto />}></Route>
        <Route path='/registrar-ticket' element={<RegistrarTicketAtencion />}></Route>
        <Route path='/mostrar-tickets' element={<MostrarTicketsAtencion />}></Route>
        <Route path='/registrar-cliente' element={<RegistrarCliente />}></Route>
        <Route path='/registrar-cliente' element={<RegistrarCliente />}></Route>
        <Route path='/mostrar-clientes' element={<MostrarClientes />}></Route>
        <Route path='/editar-cliente' element={<EditarClientes />}></Route>
        <Route path='/registrar-clientePerdido' element={<RegistrarClientePerdido />}></Route>
        <Route path='/mostrar-clientesPerdidos' element={<MostrarClientesPerdidos />}></Route>
        <Route path='/mostrar-registrarClientes' element={<MostrarRegistrarClientes />}></Route>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}


export default App
