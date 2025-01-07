// src/InicarSesion.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../FireBase/fireBase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
const { Meta } = Card;
import { Form, Input, Button, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../IniciarSesion.css';

function InicarSesion({ login }) {
  // Navegación programática a otras rutas
  const navigate = useNavigate();
  // Estado para almacenar los datos de Firebase
  const [dataFirebase, setDataFirebase] = useState([]);
  // Estado para controlar la visibilidad de errores
  const [showError, setShowError] = useState(false);

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
  // useEffect para cargar los datos de la colección "ListaCredenciales" desde Firebase
  useEffect(() => {
    const fetchData = async () => {
      // Obtener los documentos de la colección "ListaCredenciales"
      const querySnapshot = await getDocs(collection(db, "ListaCredenciales"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      // Almacenar los datos obtenidos en el estado
      setDataFirebase(dataList);
    };
    fetchData();
  }, []);

  // useEffect que maneja el temporizador para ocultar el mensaje de error después de un tiempo
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false); // Ocultar el error después de 1.5 segundos
      }, 1500); // 1500 milisegundos = 1.5 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [showError]);
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
  // Función que maneja el envío del formulario para el inicio de sesión
  const onFinish = (values) => {
    // Simulación de verificación de credenciales
    const { username, password } = {
      ...values,
      // Asegura que el nombre de usuario tenga un formato de correo electrónico
      username: values.username.includes('@') ? values.username : `${values.username}@gmail.com`,
    };

    // Intentar iniciar sesión con Firebase Authentication
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Filtrar las credenciales de Firebase basadas en el correo electrónico del usuario autenticado
        const dataCredencialUnica = dataFirebase.filter((item) =>
          item.Correo.trim().toLowerCase() === userCredential.user.email.trim().toLowerCase()
        );
        // Verificar si el usuario tiene credenciales válidas para el sistema
        if (dataCredencialUnica.length > 0) {
          // Comprobar el sistema asignado al usuario
          if (dataCredencialUnica[0].SistemaAsignado === "Ninguno" || dataCredencialUnica[0].SistemaAsignado === "Sistema de ventas") {
            message.info("No cuenta con credenciales para este sistema.");
          } else {
            // Almacenar el sistema asignado en el almacenamiento de sesión y navegar a la siguiente página
            login({ rol: userCredential.user.email, sistemaAsignado: dataCredencialUnica[0].SistemaAsignado });
            sessionStorage.setItem('saveRol', dataCredencialUnica[0].SistemaAsignado);
            navigate('/sistema-servicios');
            message.success(`Inicio de sesión exitoso, ¡bienvenido ${dataCredencialUnica[0].Nombre}!`);
            setShowError(false);
          }
        } else {
          // Si no se encuentran credenciales para el sistema, mostrar mensaje de error
          message.info("No cuenta con credenciales para este sistema.");
        }
      })
      .catch((error) => {
        // Mostrar error si las credenciales son incorrectas
        setShowError(true);
        // console.error(error);
      });
  };

  // Función para regresar a la página de inicio
  const backHome = () => {
    navigate('/');
  };
  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

  return (
    <div className='parent-login'>
      <div className="div1-logo">
        <Button onClick={backHome} shape="circle" icon={<ArrowLeftOutlined />} size="large" aria-label="back" />
        <img src="/assets/logoW1.jpg" alt="Imagen de bienvenida" style={{ width: '40px' }} />
      </div>

      <div className="div2-login">
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
          </Form.Item>

        </Form>

      </div>

      <div className="div3-card">
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
