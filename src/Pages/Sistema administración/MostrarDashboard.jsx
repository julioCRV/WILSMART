import { Layout, Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import ButtonGenerador from './GeneradorCVS';
import MostrarVentas from './DashboardVentas';
import MostrarServicios from './DashboardServicios'
import './MostrarDashboard.css';
import './Vistas.css';

const { Header, Content, Footer } = Layout;

const MostrarDashboard = () => {
  const [activeTab, setActiveTab] = useState('Ventas');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px', marginTop: '10px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2>Dashboard</h2>
            <ButtonGenerador />
          </div>
        </Breadcrumb>
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
