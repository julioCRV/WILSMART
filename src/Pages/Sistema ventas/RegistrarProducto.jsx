import React, { useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './RegistrarProducto.css';

const RegistrarProducto = () => {
  // Desestructuración del componente Option del Select de Ant Design para usarlo en la lista de opciones del componente Select.
  const { Option } = Select;
  // Estado para controlar si la imagen se ha subido correctamente o no.
  // Inicialmente, el estado es false, lo que indica que aún no se ha subido ninguna imagen.
  const [imageUploaded, setImageUploaded] = useState(false);
  // Hook de React Router para la navegación entre páginas.
  // `useNavigate` proporciona una función que permite realizar redirecciones de una página a otra.
  const navigate = useNavigate();


  // Función para verificar las imágenes antes de subirlas
  const verificarImagen = {
    // Lógica para verificar el archivo antes de la carga
    beforeUpload: (file) => {
      let extension = file.name.split('.'); // Obtiene la extensión del archivo
      extension = extension[extension.length - 1].toLowerCase(); // Convierte la extensión a minúsculas

      // Verifica si la extensión es diferente a 'jpg' o 'png'
      if (extension != 'jpg' && extension != 'png') {
        message.error('Solo se permite archivos jpg y png.'); // Muestra un mensaje de error
        return true; // Bloquea la carga del archivo
      } else if (file.size > 6000000) { // Verifica que el tamaño no sea mayor a 6MB
        message.error('El tamaño de la imagen no puede exceder 6MB');
      } else if (file.size < 1000) { // Verifica que el tamaño no sea menor a 1 KB
        message.error('El tamaño de la imagen no puede ser menor a 1 KB');
      } else {
        setImageUploaded(true); // Establece que la imagen se ha subido correctamente
        message.success(`${file.name} subido correctamente.`); // Muestra mensaje de éxito
        return false; // Permite la carga del archivo
      }
      return true; // Bloquea la carga si alguna de las condiciones no se cumple
    },

    // Lógica para manejar la eliminación de la imagen
    onRemove: () => {
      setImageUploaded(false); // Establece que no se ha subido una imagen
      message.warning('Imagen eliminada.'); // Muestra mensaje de advertencia
    },
  };

  // Función que maneja la finalización del formulario
  const onFinish = async (values) => {
    console.log('Received values of form: ', values); // Muestra los valores recibidos del formulario en consola

    const imagen = values.imagen[0].originFileObj; // Obtiene el archivo de la imagen

    try {
      const hide = message.loading('Registrando producto...', 0); // Muestra un mensaje de carga

      // Sube la imagen al almacenamiento en la nube
      const storageRef = ref(storage, `imagenes/productos/${imagen.name}`);
      await uploadBytes(storageRef, imagen);

      // Obtiene la URL de la imagen subida
      const url = await getDownloadURL(storageRef);

      // Registra los datos del producto en Firestore
      const docRef = await addDoc(collection(db, "ListaProductos"), {
        NombreProducto: values.nombreProducto,
        Cantidad: values.cantidad,
        Categoria: values.categoria,
        Fecha: formatearFecha(values.fecha.toDate()), // Convierte la fecha a un formato específico
        Precio: values.precio,
        PrecioCompra: values.precioCompra,
        Imagen: url, // URL de la imagen subida
        Marca: values.marca,
        Descripcion: values.descripcion,
      });

      hide(); // Oculta el mensaje de carga
      ModalExito(); // Muestra el modal de éxito
    } catch (error) {
      hide(); // Si ocurre un error, oculta el mensaje de carga
      console.error("Error adding document: ", error); // Muestra el error en consola
    }
  };

  // Función que maneja el fallo del formulario
  const onFinishFailed = () => {
    message.error('Por favor complete el formulario correctamente.'); // Muestra mensaje de error si el formulario no se completa correctamente
  };

  // Función para formatear la fecha a un formato específico
  function formatearFecha(fechaString) {
    const fecha = new Date(fechaString); // Convierte la fecha string a un objeto Date

    const dia = fecha.getDate().toString().padStart(2, '0'); // Obtiene el día, con formato de dos dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtiene el mes (sumando 1 porque los meses en JS empiezan desde 0)
    const año = fecha.getFullYear(); // Obtiene el año

    return `${año}/${mes}/${dia}`; // Retorna la fecha formateada en el formato "YYYY/MM/DD"
  }

  // Función que muestra un modal de éxito cuando el registro se realiza correctamente
  const ModalExito = () => {
    Modal.success({
      title: 'Registro de Empleado',
      content: 'Los datos del empleado se han guardado correctamente.', // Mensaje del modal
      onOk: () => { navigate('/sistema-ventas/mostrar-productos'); } // Al hacer clic en "OK", navega a la página de productos
    });
  }

  // Función para regresar a la página principal del sistema
  const backHome = () => {
    navigate('/sistema-ventas'); // Navega a la página principal de ventas
  }

  return (
    <div >
      <h2 className="form-title">Registro de Producto</h2>

      <Form
        name="registro_empleado"
        layout="horizontal"
        labelCol={{
          xs: { span: 24 },  // En pantallas pequeñas (ocupa toda la fila)
          sm: { span: 10 },   // En pantallas medianas (8 columnas para etiquetas)
          md: { span: 24 },   // En pantallas grandes (ocupa toda la fila para etiquetas)
          lg: { span: 24 },   // En pantallas extra grandes (ocupa toda la fila para etiquetas)
          xl: { span: 10 },   // En pantallas extra grandes (8 columnas para etiquetas)
        }}

        wrapperCol={{
          xs: { span: 24 },  // En pantallas pequeñas (ocupa toda la fila para campos)
          sm: { span: 14 },  // En pantallas medianas (10 columnas para campos)
          md: { span: 24 },  // En pantallas grandes (ocupa toda la fila para campos)
          lg: { span: 24 },  // En pantallas extra grandes (ocupa toda la fila para campos)
          xl: { span: 14 },  // En pantallas extra grandes (10 columnas para campos)
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className='contenedorRegistroE'>
          <div className="divRE11">
            <Form.Item
              name="nombreProducto"
              label="Nombre"
              rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="cantidad"
              label="Cantidad"
              rules={[{ required: true, message: 'Por favor ingrese una cantidad' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="categoria"
              label="Categoria"
              rules={[{ required: true, message: 'Por favor seleccione una categoria' }]}
            >
              <Select placeholder="Seleccione una categoria">
                <Option value="Celulares">Celulares</Option>
                <Option value="Accesorios">Accesorios</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="precioCompra"
              label="Precio de compra"
              rules={[{ required: true, message: 'Por favor ingrese el precio de compra' }]}
            >
              <Input type="number" prefix="Bs." />
            </Form.Item>

            <Form.Item
              name="precio"
              label="Precio de venta"
              rules={[{ required: true, message: 'Por favor ingrese el precio de venta' }]}
            >
              <Input type="number" prefix="Bs." />
            </Form.Item>
          </div>

          <div className="divRE22">
            <Form.Item
              name="imagen"
              label="Imagen"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              rules={[{ required: true, message: 'Por favor suba una imagen' }]}
            >
              <Upload  {...verificarImagen} maxCount={1} accept='image/*'>
                <Button style={{ marginRight: '255px' }} icon={<UploadOutlined />}>Examinar</Button>
                {imageUploaded}
              </Upload>
            </Form.Item>

            <Form.Item
              name="fecha"
              label="Fecha"
              rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}
            >
              <DatePicker className='full-width' />
            </Form.Item>

            <Form.Item
              name="marca"
              label="Marca"
              rules={[{ required: true, message: 'Por favor ingrese una marca' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="descripcion"
              label="Descripción"
              rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>


          <div className='divRE33'>
            <div className="button-container">
              <Form.Item>
                <Button style={{ width: '150px' }} type="default" htmlType="button" onClick={backHome}>
                  Cancelar
                </Button>
              </Form.Item>
              <Form.Item>
                <Button style={{ width: '150px' }} type="primary" htmlType="submit">
                  Registrar
                </Button>
              </Form.Item>
            </div>
          </div>

        </div>
      </Form >
    </div >
  );
};

export default RegistrarProducto;
