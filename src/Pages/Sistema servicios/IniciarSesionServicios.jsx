// src/InicarSesion.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../FireBase/fireBase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
const { Meta } = Card;
import { Form, Input, Button, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../IniciarSesion.css';

function InicarSesion({ login }) {
  const navigate = useNavigate();
  const [dataFirebase, setDataFirebase] = useState([]);
  const [showError, setShowError] = useState(false);

  const onFinish = (values) => {
    // Simulación de verificación de credenciales
    const { username, password } = {
      ...values,
      username: values.username.includes('@') ? values.username : `${values.username}@gmail.com`,
    };

    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const dataCredencialUnica = dataFirebase.filter((item) =>
          item.Correo.trim().toLowerCase() === userCredential.user.email.trim().toLowerCase()
        );
        if (dataCredencialUnica.length > 0) {
          if (dataCredencialUnica[0].SistemaAsignado === "Ninguno" || dataCredencialUnica[0].SistemaAsignado === "Sistema de ventas") {
            message.info("No cuenta con credenciales para este sistema.");
          } else {
            login({ rol: userCredential.user.email, sistemaAsignado: dataCredencialUnica[0].SistemaAsignado });
            sessionStorage.setItem('saveRol', dataCredencialUnica[0].SistemaAsignado);
            navigate('/sistema-servicios');
            message.success(`Inicio de sesión exitoso, ¡bienvenido ${dataCredencialUnica[0].Nombre}!`);
            setShowError(false);
          }
        } else {
          message.info("No cuenta con credenciales para este sistema.");
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

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ListaCredenciales"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      // console.log(dataList);
      setDataFirebase(dataList);
    };
    fetchData();
  }, []);

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
          <h2>Sistema de servicios</h2>
          <img src="/assets/logoServicios.png" alt="Servicios" style={{ maxWidth: '60%', height: 'auto', marginBottom: '20px' }} />
          <Meta
            description="Ofrece servicios de alta calidad a tus clientes utilizando nuestro sistema de servicios."
          />
        </Card>
      </div>

    </div>
  );
}

export default InicarSesion;
