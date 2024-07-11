// src/InicarSesion.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../FireBase/fireBase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
const { Meta } = Card;
import { Form, Input, Button, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../IniciarSesion.css';

function InicarSesion({ login }) {
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);

  const onFinish = (values) => {
    // Simulación de verificación de credenciales
    const { username, password } = {
      ...values,
      username: values.username.includes('@') ? values.username : `${values.username}@gmail.com`,
    };
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // console.log(userCredential.user);
        // console.log("Puede ingresar");
        if(userCredential.user.email === "administrador@gmail.com"){
          login({ sistemaAsignado: userCredential.user.email });
          sessionStorage.setItem('saveRol', userCredential.user.email);
          navigate('/sistema-administración');
          message.success('Inicio de sesión exitoso, ¡bienvenido!');
          setShowError(false);
        }else{
          message.info("No cuenta con acceso a este sistema.")
        }
     
      })
      .catch((error) => {
        setShowError(true);
        // console.error(error);
      });
  };

  const backHome = () => {
    navigate('/')
  }

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 1500); // 5000 milisegundos = 5 segundos

      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
  }, [showError]);

  return (
    <div className='parent-login'>
      <div class="div1-logo">
        <Button onClick={backHome} shape="circle" icon={<ArrowLeftOutlined />} size="large" aria-label="back" />
        <img src="/assets/logoW1.jpg" alt="Imagen de bienvenida" style={{ width: '40px' }} />
      </div>

      <div class="div2-login">
        <h1>Iniciar sesión</h1>
        <h2 style={{ marginTop: '-30px' }}>Hola, bienvenido</h2>

        <Form
          style={{ marginBottom: 50 }}
          name="login"
          onFinish={onFinish}
        >

          <Form.Item
            name="username"
            className='input'
            rules={[{ required: true, message: 'Por favor ingrese su nombre de usuario' }]}
          >
            <Input prefix={<UserOutlined className="filled-icon" />} placeholder="Nombre de usuario" />
          </Form.Item>

          <Form.Item
            name="password"
            className='input'
            rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
          >
            <Input.Password prefix={<LockOutlined className="filled-icon" />} placeholder="Contraseña" />
          </Form.Item>

          {showError && <Alert style={{ width: 300 }} message="Credenciales incorrectas" type="error" showIcon />}

          <Form.Item>
            <button style={{ marginTop: 20, width: 150 }} type="primary" htmlType="submit" block>Ingresar</button>
            {/* <Button type="primary" htmlType="submit" block on>
              Ingresar  
            </Button> */}
          </Form.Item>

        </Form>

      </div>

      <div class="div3-card">
        <Card
          hoverable
          className='cardLogin'
        >
          <h2>Sistema de administración</h2>
          <img src="/assets/logoAdministracion.png" alt="Administración" style={{ maxWidth: '70%', height: 'auto', marginBottom: '20px' }} />
          <Meta
            description="Controla y organiza tus procesos administrativos con nuestro sistema especializado."
          />
        </Card>
      </div>

    </div>
  );
}

export default InicarSesion;
