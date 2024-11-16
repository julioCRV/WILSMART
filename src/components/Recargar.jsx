import React, { useEffect } from 'react'; // Importa React y el hook useEffect
import { message } from 'antd'; // Importa el componente 'message' de Ant Design, utilizado para mostrar mensajes

// Componente EjemploMessageLoading que muestra un mensaje de carga
const EjemploMessageLoading = () => {
  useEffect(() => {
    // Muestra un mensaje de carga indefinido durante un segundo
    const hideLoadingMessage = message.loading('Cargando...', 1); // El '1' indica que se mantendrá visible durante 1 segundo

    return () => {
      // Cuando el componente se desmonta, se oculta el mensaje de carga
      hideLoadingMessage(); // Llama a la función 'hideLoadingMessage' para ocultar el mensaje de carga
    };
  }, []); // El array vacío [] asegura que el efecto solo se ejecute una vez al montar el componente

  return null; // Este componente no renderiza nada en la interfaz, solo gestiona el mensaje de carga
};

export default EjemploMessageLoading; // Exporta el componente para usarlo en otros archivos
