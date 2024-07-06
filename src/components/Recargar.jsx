import React, { useEffect } from 'react';
import { message } from 'antd';

const EjemploMessageLoading = () => {
  useEffect(() => {
    const hideLoadingMessage = message.loading('Cargando...',1); // Muestra un mensaje de carga indefinidamente

    return () => {
      hideLoadingMessage(); // Oculta el mensaje de carga al desmontar el componente
    };
  }, []);

  return null; // No renderizamos ningún contenido adicional en este componente
};

export default EjemploMessageLoading;
