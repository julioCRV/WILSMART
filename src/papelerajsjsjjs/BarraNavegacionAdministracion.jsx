import React from 'react';
import { Menu, Image } from 'antd';
import { HomeOutlined, EuroOutlined, HeartOutlined, CalculatorOutlined, BarsOutlined, MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <Menu mode="horizontal">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Inicio</Link>
      </Menu.Item>
      <Menu.Item key="finances" icon={<EuroOutlined />}>
        <Link to="/finances">Finanzas</Link>
      </Menu.Item>
      <Menu.Item key="health" icon={<HeartOutlined />}>
        <Link to="/health">Salud</Link>
      </Menu.Item>
      <Menu.Item key="math" icon={<CalculatorOutlined />}>
        <Link to="/math">Matemáticas</Link>
      </Menu.Item>
      <Menu.Item key="other" icon={<BarsOutlined />}>
        <Link to="/other">Otros</Link>
      </Menu.Item>
    </Menu>
  );
};

export default NavigationBar;
