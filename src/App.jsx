import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from './FireBase/fireBase';
import './App.css'
import { Navigate, Routes, Route } from "react-router-dom";

//  R U T A S     P R I N C I P A L E S
import Inicio from './Pages/Inicio';
import InicioAdmi from './Pages/InicioAdministrador'
import IniciarSesionA from './Pages/Sistema administración/IniciarSesionAdministración';
import IniciarSesionV from './Pages/Sistema ventas/IniciarSesionVentas';
import IniciarSesionS from './Pages/Sistema servicios/IniciarSesionServicios';
import Recargar from './components/Recargar'

//  V  E  N  T  A  S
import NavbarSisVentas from './components/NavbarSistemaVentas';
import InicioSisVentas from './components/InicioVentas';
import RegistrarProducto from './Pages/Sistema ventas/RegistrarProducto';
import EditarProducto from './Pages/Sistema ventas/EditarProducto'
import MostrarProductos from './Pages/Sistema ventas/MostrarProductos';
import IncrementarProductos from './Pages/Sistema ventas/IncrementarProductos'
import RealizarVenta from './Pages/Sistema ventas/RealizarVenta';
import ReporteVentas from './Pages/Sistema ventas/ReporteVentas';
import ModalAperturaCaja from './Pages/Sistema ventas/ModalAperturaCaja';
import EstadoCaja from './Pages/Sistema ventas/EstadoCaja';

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

function App() {
  const [rol, setRol] = useState(sessionStorage.getItem('saveRol'));
  const [nombre, setNombre] = useState("");
  const [respuest, setRespuesta] = useState("")
  const [mostrarRutas, setMostrarRutas] = useState(false);

  useEffect(() => {
    setRol(sessionStorage.getItem('saveRol'));
  }, [rol]);

  const handleLogin = (userData) => {
    setRol(userData.sistemaAsignado);
    setNombre(userData.Nombre);
    // if (sessionStorage.getItem('saveRol') == null) {
    //   sessionStorage.setItem('saveRol', userData.rol)
    // }
  };

  // const handleLoginVentas = (userData) => {
  //   setRol(userData.sistemaAsignado);
  //   setMostrarRutas(true);
  //   // if (sessionStorage.getItem('saveRol') == null) {
  //   //   sessionStorage.setItem('saveRol', userData.rol)
  //   // }
  // };

// console.log(rol);

  const handleLogout = (userData) => {
    // console.log(userData);
    // console.log('lo logro señor');
    setRol(null);
    sessionStorage.removeItem('saveRol');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('nombre')
    // if (sessionStorage.getItem('saveRol') == null) {
    //   sessionStorage.setItem('saveRol', userData.rol)
    // }
  };

  const confirmacion = (estado) => {
    setRespuesta(estado);
  };

  useEffect(() => {
    if (respuest === "si") {
      setMostrarRutas(true);
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        const listSeleccionada = dataList.filter((item) => item.Estado === true);
        sessionStorage.setItem('id', listSeleccionada[0].id);
      };
      fetchData();
    }
    setRespuesta("")
  }, [respuest]);

  useEffect(() => {
    const idCaja = sessionStorage.getItem('id');
    if (idCaja != null) {
      setMostrarRutas(true);
    } else {
      const nombre = sessionStorage.getItem('nombre');
      if (nombre != null) {
        setMostrarRutas(true);
      }
    }
  }, []);

  return (
    <div className='App'>

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
                  <ModalAperturaCaja confirmacion={confirmacion} nombre={nombre} />
                  {mostrarRutas && (
                    <Routes>
                      <Route path='/' element={<InicioAdmi />}></Route>
                      <Route path='/sistema-ventas/*' element={<SistemaVentas logout={handleLogout} />}></Route>
                      <Route path='*' element={<Navigate to="/"></Navigate>}></Route>
                    </Routes>
                  )}
                </>
              ) : (
                <>
                  {rol === 'Sistema de servicios' ? (
                    <>
                      <Routes>
                        <Route path='/' element={<InicioAdmi />}></Route>
                        <Route path='/sistema-servicios/*' element={<SistemaServicios logout={handleLogout} />}></Route>
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
        <Route path='/estado-caja' element={<EstadoCaja />}></Route>
        <Route path='/recargar' element={<Recargar />}></Route>
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
  // console.log("hhhhhhhhhhhhhhhhhhhhhh");
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
