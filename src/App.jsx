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

//  R U T A S    D E    V  E  N  T  A  S
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

//  R U T A S    D E    A  D  M  I  N  I  S  T  R  A  C  I  Ó  N 
import NavbarSisAdministracion from './components/NavbarSistemaAdministracion';
import InicioSisAdministracion from './components/InicioAdministracion';
import RegistroEmpleado from './Pages/Sistema administración/RegistroEmpleado';
import EditarEmpleado from './Pages/Sistema administración/EditarEmpleado';
import MostrarEmpleado from './Pages/Sistema administración/MostrarPersonal';
import MostrarDashboard from './Pages/Sistema administración/ComponentesDashboard/MostrarDashboard';
import GenerarCredenciales from './Pages/Sistema administración/GenerarCredenciales';

//  R U T A S    D E    S  E  R  V  I  C  I  O  S
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
import MostrarRegistrarClientes from './Pages/Sistema servicios/RegistrarClienteNuevo';

function App() {
  // Estado `rol`: Guarda el rol del usuario. Se inicializa con el valor de 'saveRol' almacenado en sessionStorage (si existe).
  const [rol, setRol] = useState(sessionStorage.getItem('saveRol'));
  // Estado `nombre`: Almacena el nombre del usuario. Inicialmente se deja vacío hasta que el usuario inicie sesión.
  const [nombre, setNombre] = useState("");
  // Estado `respuest`: Guarda el estado de respuesta (o confirmación) del usuario en ciertas acciones.
  // Puede utilizarse para activar o modificar funcionalidades en el componente según la respuesta.
  const [respuest, setRespuesta] = useState("");
  // Estado `mostrarRutas`: Controla la visibilidad de ciertas rutas o componentes.
  // Por defecto es `false` y se establece en `true` cuando se cumplen condiciones específicas.
  const [mostrarRutas, setMostrarRutas] = useState(false);

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - 
  // --> Cargar rol desde sessionStorage al montar el componente
  useEffect(() => {
    // Al iniciar, se obtiene el rol guardado en el sessionStorage bajo la clave 'saveRol'
    // y se actualiza el estado `rol` del componente.
    setRol(sessionStorage.getItem('saveRol'));
  }, [rol]);

  // --> Obtener y filtrar documentos en función de la respuesta
  useEffect(() => {
    // Este efecto se activa cuando la variable `respuest` cambia.
    if (respuest === "si") {
      // Si `respuest` es "si", muestra rutas adicionales activando `setMostrarRutas`.
      setMostrarRutas(true);

      // Función asincrónica para obtener los datos de la colección 'HistorialAperturaCaja'.
      const fetchData = async () => {
        // Obtiene todos los documentos de la colección
        const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
        // Convierte los documentos en un arreglo de objetos con datos e ID.
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        // Filtra la lista para obtener solo los documentos con Estado === true.
        const listSeleccionada = dataList.filter((item) => item.Estado === true);
        // Guarda el ID del primer elemento en `sessionStorage` con la clave 'id'.
        sessionStorage.setItem('id', listSeleccionada[0].id);
      };

      // Llama a la función `fetchData` para cargar los datos.
      fetchData();
    }

    // Resetea la variable `respuest` para evitar reactivaciones no deseadas del efecto.
    setRespuesta("");
  }, [respuest]);

  // ---> Verificar existencia de ID de caja para mostrar rutas
  useEffect(() => {
    // Obtiene el ID guardado en `sessionStorage` bajo la clave 'id'.
    const idCaja = sessionStorage.getItem('id');

    if (idCaja != null) {
      // Si el ID existe, activa la visualización de rutas adicionales.
      setMostrarRutas(true);
    } else {
      // Si no hay un ID, revisa si hay un nombre guardado en `sessionStorage`.
      const nombre = sessionStorage.getItem('nombre');
      if (nombre != null) {
        // En caso de que exista un nombre, puede usarse para mostrar rutas
        // (la línea está comentada pero es una opción futura).
        // setMostrarRutas(true);
      }
    }
  }, []);
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  // #region + + + + + + + + + + + + + [ Métodos de manejo de sesión y confirmación de usuario ] + + + + + + + + + + + + + + + + + + + +
  // Método `handleLogin`: Configura el rol y el nombre del usuario al iniciar sesión
  const handleLogin = (userData) => {
    // Almacena en el estado `rol` el sistema asignado al usuario
    setRol(userData.sistemaAsignado);
    // Almacena en el estado `nombre` el nombre del usuario
    setNombre(userData.Nombre);
  };

  // Método `handleLogout`: Limpia el estado y elimina los datos de la sesión al cerrar sesión
  const handleLogout = () => {
    // Elimina el rol del usuario del estado
    setRol(null);
    // Remueve datos específicos de `sessionStorage` relacionados con el usuario
    sessionStorage.removeItem('saveRol'); // Elimina el rol guardado en `sessionStorage`
    sessionStorage.removeItem('id'); // Elimina el ID guardado en `sessionStorage`
    sessionStorage.removeItem('nombre'); // Elimina el nombre guardado en `sessionStorage`
  };

  // Método `confirmacion`: Actualiza el estado `respuest` con el estado proporcionado
  const confirmacion = (estado) => {
    // Cambia el valor de `respuest` según el estado recibido
    setRespuesta(estado);
  };

  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 


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
                {/* <Route path='/sistema-ventas/*' element={<SistemaVentas logout={handleLogout} />}></Route> */}
                <Route path='/sistema-administración/*' element={<SistemaAdministracion logout={handleLogout} />}></Route>
                {/* <Route path='/sistema-servicios/*' element={<SistemaServicios logout={handleLogout} />}></Route> */}
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
                      <Route path='/' element={<SistemaVentas />}></Route>
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
                        <Route path='/' element={<SistemaServicios />}></Route>
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

// Componente `SistemaVentas`
// Este componente representa el sistema de ventas de la aplicación.
// Muestra el navbar específico para ventas y define rutas para las diferentes vistas de ventas.
function SistemaVentas({ logout }) {

  // `handleLogout`: Maneja el cierre de sesión para el sistema de ventas.
  // Llama a la función `logout` pasada como prop, pasando el rol del usuario como parámetro.
  const handleLogout = (userData) => {
    logout(userData.rol);
  };

  return (
    <div>
      {/* NavbarSisVentas: Navbar específico para el sistema de ventas, recibe la función `handleLogout` para cerrar sesión */}
      <NavbarSisVentas logout={handleLogout} />

      {/* Definición de rutas específicas para el sistema de ventas */}
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

        {/* Ruta comodín: Redirige cualquier ruta desconocida a la página de inicio */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// Componente `SistemaAdministracion`
// Este componente representa el sistema de administración de la aplicación.
// Muestra el navbar específico para administración y define rutas para las vistas de administración.
function SistemaAdministracion({ logout }) {

  // `handleLogout`: Maneja el cierre de sesión para el sistema de administración.
  const handleLogout = (userData) => {
    logout(userData.rol);
  };

  return (
    <div>
      {/* NavbarSisAdministracion: Navbar específico para el sistema de administración */}
      <NavbarSisAdministracion logout={handleLogout} />

      {/* Definición de rutas específicas para el sistema de administración */}
      <Routes>
        <Route path='/' element={<InicioSisAdministracion />} />
        <Route path='/registro-empleado' element={<RegistroEmpleado />}></Route>
        <Route path='/mostrar-empleados' element={<MostrarEmpleado />}></Route>
        <Route path='/editar-empleado' element={<EditarEmpleado />}></Route>
        <Route path='/mostrar-dashboard' element={<MostrarDashboard />}></Route>
        <Route path='/generar-credenciales' element={<GenerarCredenciales />}></Route>

        {/* Ruta comodín: Redirige cualquier ruta desconocida a la página de inicio */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// Componente `SistemaServicios`
// Este componente representa el sistema de servicios de la aplicación.
// Muestra el navbar específico para servicios y define rutas para las vistas de servicios.
function SistemaServicios({ logout }) {

  // `handleLogout`: Maneja el cierre de sesión para el sistema de servicios.
  const handleLogout = (userData) => {
    logout(userData.rol);
  };

  return (
    <div>
      {/* NavbarSisServicios: Navbar específico para el sistema de servicios */}
      <NavbarSisServicios logout={handleLogout} />

      {/* Definición de rutas específicas para el sistema de servicios */}
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

        {/* Ruta comodín: Redirige cualquier ruta desconocida a la página de inicio */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App
