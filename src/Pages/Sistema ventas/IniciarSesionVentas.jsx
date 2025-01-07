// src/InicarSesion.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../FireBase/fireBase';
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
const { Meta } = Card;
import { Form, Input, Button, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../IniciarSesion.css';

function InicarSesion({ login }) {
  // Se importa el hook useNavigate de react-router-dom para poder navegar entre las páginas.
  const navigate = useNavigate();
  // Estado que almacena los datos obtenidos desde Firebase
  const [dataFirebase, setDataFirebase] = useState([]);
  // Estado para controlar la visualización de un error en el inicio de sesión
  const [showError, setShowError] = useState(false);


  // Hook useEffect para manejar la visualización de errores temporales
  useEffect(() => {
    if (showError) {
      // Configura un temporizador para ocultar el error después de 1.5 segundos (1500 ms)
      const timer = setTimeout(() => {
        setShowError(false); // Cambia el estado de "showError" a falso
      }, 1500);

      // Retorna una función de limpieza para limpiar el temporizador si el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [showError]); // Este efecto se ejecuta cada vez que "showError" cambia

  // Hook useEffect para obtener datos de la colección "ListaCredenciales" en Firestore
  useEffect(() => {
    const fetchData = async () => {
      // Obtiene todos los documentos de la colección "ListaCredenciales"
      const querySnapshot = await getDocs(collection(db, "ListaCredenciales"));

      // Mapea los datos obtenidos para incluir el ID del documento y los guarda en un arreglo
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(), // Agrega los datos del documento
        id: doc.id // Agrega el ID del documento
      }));

      // Actualiza el estado con los datos obtenidos
      setDataFirebase(dataList);
    };

    fetchData(); // Llama a la función para obtener los datos al cargar el componente
  }, []); // Este efecto se ejecuta una sola vez al montar el componente


  // Función que maneja el evento al enviar el formulario de inicio de sesión
  const onFinish = (values) => {
    // Simulación de verificación de credenciales, asegurando que el usuario tenga un correo electrónico válido
    const { username, password } = {
      ...values,
      username: values.username.includes('@') ? values.username : `${values.username}@gmail.com`, // Añade "@gmail.com" si no está presente
    };

    // Intento de inicio de sesión con Firebase Authentication
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Filtra los datos de credenciales para verificar si el usuario tiene permisos para acceder al sistema
        const dataCredencialUnica = dataFirebase.filter((item) =>
          item.Correo.trim().toLowerCase() === userCredential.user.email.trim().toLowerCase()
        );

        // Verifica si el usuario tiene asignado el sistema y si tiene acceso
        if (dataCredencialUnica.length > 0) {
          // Si el usuario no tiene permisos para el sistema, muestra un mensaje
          if (dataCredencialUnica[0].SistemaAsignado === "Ninguno" || dataCredencialUnica[0].SistemaAsignado === "Sistema de servicios") {
            message.info("No cuenta con credenciales para este sistema.");
          } else {
            // Si tiene permisos, guarda la información en el contexto y navega al sistema de ventas
            login({ rol: userCredential.user.email, sistemaAsignado: dataCredencialUnica[0].SistemaAsignado, Nombre: dataCredencialUnica[0].Nombre });
            sessionStorage.setItem('saveRol', dataCredencialUnica[0].SistemaAsignado); // Guarda el rol del usuario
            navigate('/sistema-ventas'); // Navega al sistema de ventas
            message.success(`Inicio de sesión exitoso, ¡bienvenido ${dataCredencialUnica[0].Nombre}!`); // Muestra un mensaje de éxito
            setShowError(false); // Reinicia el estado de error
          }
        } else {
          message.info("No cuenta con credenciales para este sistema."); // Mensaje si no se encuentra la credencial
        }
      })
      .catch((error) => {
        // Si ocurre un error al intentar iniciar sesión, muestra el error
        setShowError(true);
        console.error(error);
      });
  };

  // Función para redirigir al usuario a la página principal
  const backHome = () => {
    navigate('/') // Redirige a la página principal
  }

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
          <h2>Sistema de ventas</h2>
          <img src="/assets/logoVentas.png" alt="Ventas" style={{ maxWidth: '70%', height: 'auto', marginBottom: '20px' }} />
          <Meta
            description="Gestiona tus compras y ventas de manera eficiente con nuestro sistema de ventas."
          />
        </Card>
      </div>

    </div>
  );
}

export default InicarSesion;
