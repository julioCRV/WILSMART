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

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
  // useEffect que controla el estado 'showError' y oculta el error después de un tiempo
  useEffect(() => {
    // Verifica si el estado 'showError' es verdadero (si se debe mostrar el error)
    if (showError) {
      // Establece un temporizador para ocultar el error después de 1500 milisegundos (1.5 segundos)
      const timer = setTimeout(() => {
        setShowError(false); // Oculta el error al cambiar 'showError' a false
      }, 1500); // 1500 milisegundos = 1.5 segundos

      // Retorna una función de limpieza que se ejecuta cuando el componente se desmonta
      return () => clearTimeout(timer); // Limpia el temporizador para evitar efectos secundarios
    }
  }, [showError]); // El efecto se ejecuta cada vez que 'showError' cambia
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
  // Función 'onFinish' que maneja el envío del formulario
  const onFinish = (values) => {
    // Se asegura de que el nombre de usuario tenga el formato adecuado con un dominio de correo
    const { username, password } = {
      ...values,
      username: values.username.includes('@') ? values.username : `${values.username}@gmail.com`, // Si el usuario no incluye '@', se añade automáticamente '@gmail.com'
    };

    // Intenta autenticar al usuario con email y contraseña
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Si el email del usuario es "administrador@gmail.com", se procede con el login
        if (userCredential.user.email === "administrador@gmail.com") {
          login({ sistemaAsignado: userCredential.user.email }); // Llama a la función de login con el email del usuario
          sessionStorage.setItem('saveRol', userCredential.user.email); // Guarda el rol del usuario en el sessionStorage
          navigate('/sistema-administración'); // Redirige al sistema de administración
          message.success('Inicio de sesión exitoso, ¡bienvenido!'); // Muestra mensaje de éxito
          setShowError(false); // Oculta cualquier mensaje de error
        } else {
          // Si el email no es el del administrador, muestra un mensaje informando que no tiene acceso
          message.info("No cuenta con acceso a este sistema.");
        }

      })
      .catch((error) => {
        // Si ocurre un error durante la autenticación, muestra un mensaje de error
        setShowError(true);
        console.error(error); // Registra el error en la consola para depuración
      });
  };

  // Función 'backHome' para redirigir al usuario a la página de inicio
  const backHome = () => {
    navigate('/'); // Redirige al home
  }
  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

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
