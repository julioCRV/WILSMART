import { Layout, Breadcrumb } from 'antd';
import React, { useState } from 'react';
import ButtonGenerador from '../GeneradorCVS';
import MostrarVentas from './DashboardVentas';
import MostrarServicios from './DashboardServicios'
import './MostrarDashboard.css';
import './Vistas.css';

const { Content, Footer } = Layout;

const MostrarDashboard = () => {
  // Estado para gestionar la pestaña activa
  const [activeTab, setActiveTab] = useState('Ventas'); // Inicializa la pestaña activa en 'Ventas'

  // Función que maneja el cambio de pestaña al hacer clic
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Establece la nueva pestaña activa
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className="content-container">
        {/* Uso del nuevo enfoque con items */}
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <ButtonGenerador />
        </div>
        <div className="vistas-container">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'Ventas' ? 'active' : ''}`}
              onClick={() => handleTabClick('Ventas')}
            >
              Ventas
            </button>
            <button
              className={`tab-button ${activeTab === 'Sistemas' ? 'active' : ''}`}
              onClick={() => handleTabClick('Sistemas')}
            >
              Servicios
            </button>
          </div>

          {activeTab === 'Ventas' && <MostrarVentas />}
          {activeTab === 'Sistemas' && <MostrarServicios />}
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default MostrarDashboard;
