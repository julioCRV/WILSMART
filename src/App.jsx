import { Button } from 'antd';
import './App.css'
import { Navigate, Routes, Route } from "react-router-dom";

//rutas
import Inicio from './Pages/Inicio';

import NavbarSisVentas from './components/NavbarSistemaVentas';
import InicioSisVentas from './components/InicioVentas';
import RegistrarProducto from './Pages/Sistema ventas/RegistrarProducto';
import EditarProducto from './Pages/Sistema ventas/EditarProducto'
import MostrarProductos from './Pages/Sistema ventas/MostrarProductos';
import RealizarVenta from './Pages/Sistema ventas/RealizarVenta';
import ReporteVentas from './Pages/Sistema ventas/ReporteVentas';

import NavbarSisAdministracion from './components/NavbarSistemaAdministracion';
import InicioSisAdministracion from './components/InicioAdministracion';
import RegistroEmpleado from './Pages/Sistema administración/RegistroEmpleado';
import EditarEmpleado from './Pages/Sistema administración/EditarEmpleado';
import MostrarEmpleado from './Pages/Sistema administración/MostrarPersonal';
import MostrarDashboard from './Pages/Sistema administración/MostrarDashboard';

import NavbarSisServicios from './components/NavbarSistemaServicios';
import InicioSisServicios from './components/InicioServicios';

// P R U E B A 
import Prueba6 from './papelerajsjsjjs/prueba6'
import Prueba7 from './papelerajsjsjjs/pruebaResponsive'
import Prueba from './papelerajsjsjjs/prueba2'
import Prueba3 from './papelerajsjsjjs/prueba3'
import Prueba4 from './papelerajsjsjjs/prueba4'
import Prueba5 from './papelerajsjsjjs/prueba5'

function App() {

  return (
    <div className='App'>
       {/* <Prueba/> */}
      {/* <Prueba3/> */}
      {/*<Prueba4 id="7gsP6wg9iYVsE9UWjm5h" />
      <Prueba5/> */}

      {/* <Prueba6 /> */}
      
      {/* <Prueba7/> */}
      <Routes>
        <Route path='/' element={<Inicio />}></Route>

        <Route path='/sistema-ventas/*' element={<SistemaVentas />}></Route>

        <Route path='/sistema-administración/*' element={<SistemaAdministracion />}></Route>

        <Route path='/sistema-servicios' element={<SistemaServicios />}></Route>

        <Route path='*' element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </div>
  );
}

function SistemaVentas() {
  return (
    <div>
      <NavbarSisVentas />
      <Routes>
        <Route path='/' element={<InicioSisVentas />} />
        <Route path='/registrar-producto' element={<RegistrarProducto />}></Route>
        <Route path='/editar-producto' element={<EditarProducto />}></Route>
        <Route path='/mostrar-producto' element={<MostrarProductos />}></Route>
        <Route path='/realizar-venta' element={<RealizarVenta />}></Route>
        <Route path='/mostrar-reportes' element={<ReporteVentas />}></Route>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function SistemaAdministracion() {
  return (
    <div>
      <NavbarSisAdministracion />
      <Routes>
        <Route path='/' element={<InicioSisAdministracion />} />
        <Route path='/registro-empleado' element={<RegistroEmpleado />}></Route>
        <Route path='/mostrar-empleado' element={<MostrarEmpleado />}></Route>
        <Route path='/editar-empleado' element={<EditarEmpleado />}></Route>
        <Route path='/mostrar-dashboard' element={<MostrarDashboard />}></Route>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function SistemaServicios() {
  return (
    <div>
      <NavbarSisServicios />
      <Routes>
        <Route path='/' element={<InicioSisServicios />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}


export default App
