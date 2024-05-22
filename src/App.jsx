import { Button } from 'antd';
import './App.css'
import { Navigate, Routes, Route } from "react-router-dom";

//rutas
import Inicio from './Pages/Inicio';
import SisVentas from './Pages/SistemaVentas';
import SisAdministracion from './Pages/SistemaAdministracion';
import SisServicios from './Pages/SistemaServicios'

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Inicio />}></Route>
        <Route path='/sistema-ventas' element={<SisVentas />}></Route>
        <Route path='/sistema-administración' element={<SisAdministracion />}></Route>
        <Route path='/sistema-servicios' element={<SisServicios/>}></Route>
        <Route path='*' element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </div>
  );
}

export default App
