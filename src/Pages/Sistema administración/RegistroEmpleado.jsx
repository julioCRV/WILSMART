import React, { useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './RegistroEmpleado.css';

const RegistroEmpleado = () => {
  // Se extrae la opción del componente Select de Ant Design para su uso en listas de selección
  const { Option } = Select;
  // Estado para controlar si la imagen ha sido subida correctamente
  const [imageUploaded, setImageUploaded] = useState(false);
  // Hook de React Router para navegar entre las diferentes rutas de la aplicación
  const navigate = useNavigate();


  // Definición de la función para verificar las imágenes cargadas
  const verificarImagen = {
    // Función que se ejecuta antes de cargar la imagen
    beforeUpload: (file) => {

      // Se obtiene la extensión del archivo y se verifica si es jpg o png
      let extension = file.name.split('.');
      extension = extension[extension.length - 1].toLowerCase();

      // Verifica que la extensión sea válida (jpg o png)
      if (extension != 'jpg' && extension != 'png') {
        message.error('Solo se permite archivos jpg y png.');
        return true; // Si no es válido, se retorna true para evitar la carga
      }
      // Verifica que el tamaño del archivo no exceda los 6MB
      else if (file.size > 6000000) {
        message.error('El tamaño de la imagen no puede exceder 6MB');
      }
      // Verifica que el tamaño del archivo no sea menor a 1 KB
      else if (file.size < 1000) {
        message.error('El tamaño de la imagen no puede ser menor a 1 KB');
      }
      // Si todo es válido, se marca la imagen como subida correctamente
      else {
        setImageUploaded(true);
        message.success(`${file.name} subido correctamente.`);
        return false; // Retorna false para permitir la carga
      }
      return true; // Si alguna condición falla, se retorna true para evitar la carga
    },

    // Función que se ejecuta cuando la imagen es eliminada
    onRemove: () => {
      setImageUploaded(false); // Resetea el estado de la imagen subida
      message.warning('Imagen eliminada.');
    },
  };

  // Función que se ejecuta al enviar el formulario
  const onFinish = async (values) => {
    const hide = message.loading('Registrando empleado...', 0);

    // Se obtiene la imagen cargada desde el formulario
    const imagen = values.foto[0].originFileObj;

    try {
      // Se sube la imagen a Firebase Cloud Storage
      const storageRef = ref(storage, `imagenes/empleados/${imagen.name}`);
      await uploadBytes(storageRef, imagen);

      // Se obtiene la URL de la imagen subida
      const url = await getDownloadURL(storageRef);

      // Se guarda la información del empleado en Firebase Firestore
      const docRef = await addDoc(collection(db, "ListaEmpleados"), {
        Nombre: values.nombreCompleto,
        FechaNacimiento: formatearFecha(values.fechaNacimiento.toDate()),
        CI: values.ci,
        Genero: values.genero,
        EstadoCivil: values.estadoCivil,
        NumeroTeléfono: values.telefono,
        FotoEmpleado: url,
        CorreoElectrónico: values.email,
        PuestoOcargo: values.puesto,
        Salario: values.salario,
        DirecciónDeDomicilio: values.direccion,
      });

      // Se muestra el mensaje de éxito
      hide();
      ModalExito();
    } catch (error) {
      hide();
      console.error("Error adding document: ", error); // En caso de error, se imprime en consola
    }
  };

  // Función para formatear la fecha en el formato deseado (año/mes/día)
  function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
    const año = fecha.getFullYear();

    return `${año}/${mes}/${dia}`;
  }

  // Modal de éxito que se muestra tras un registro exitoso
  const ModalExito = () => {
    Modal.success({
      title: 'Registro de Empleado',
      content: 'Los datos del empleado se han guardado correctamente.',
      onOk: () => { navigate('/sistema-administración/mostrar-empleados'); } // Redirige a la vista de empleados
    });
  }

  // Función para regresar a la página de administración de empleados
  const backHome = () => {
    navigate('/sistema-administración');
  }

  return (
    <div >
      <h2 className="form-title">Registro de empleado</h2>

      <Form
        name="registro_empleado"
        layout="horizontal"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 22 }}
        onFinish={onFinish}
      >
        <div className='parent2'>
          <div className="div11">
            <Form.Item
              name="nombreCompleto"
              label="Nombre Completo"
              rules={[{ required: true, message: 'Por favor ingrese su nombre completo' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              rules={[{ required: true, message: 'Por favor seleccione su fecha de nacimiento' }]}
            >
              <DatePicker className='full-width' />
            </Form.Item>

            <Form.Item
              name="ci"
              label="CI"
              rules={[{ required: true, message: 'Por favor ingrese su CI' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="genero"
              label="Género"
              rules={[{ required: true, message: 'Por favor seleccione su género' }]}
            >
              <Select placeholder="Seleccione su género">
                <Option value="Femenino">Femenino</Option>
                <Option value="Masculino">Masculino</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="estadoCivil"
              label="Estado Civil"
              rules={[{ required: true, message: 'Por favor ingrese su estado civil' }]}
            >
              <Select placeholder="Seleccione su estado">
                <Option value="Casado">Casado</Option>
                <Option value="Soltero">Soltero</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="telefono"
              label="Número de Teléfono"
              rules={[{ required: true, message: 'Por favor ingrese su número de teléfono' }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="div22">
            <Form.Item
              name="foto"
              label="Foto de Empleado"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              rules={[{ required: true, message: 'Por favor suba una foto' }]}
            >
              <Upload  {...verificarImagen} maxCount={1} accept='image/*'>
                <Button style={{ marginRight: '255px' }} icon={<UploadOutlined />}>Examinar</Button>
                {imageUploaded}
              </Upload>
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                { type: 'email', message: 'El correo no es válido' },
                { required: true, message: 'Por favor ingrese su correo electrónico' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="puesto"
              label="Puesto o Cargo"
              rules={[{ required: true, message: 'Por favor ingrese su puesto o cargo' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="salario"
              label="Salario"
              rules={[{ required: true, message: 'Por favor ingrese su salario' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="direccion"
              label="Dirección de Domicilio"
              rules={[{ required: true, message: 'Por favor ingrese su dirección de domicilio' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>


          <div className='div33'>
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

export default RegistroEmpleado;
