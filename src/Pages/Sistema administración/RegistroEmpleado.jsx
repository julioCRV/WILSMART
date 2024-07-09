import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './RegistroEmpleado.css';

const { Option } = Select;

const RegistroEmpleado = () => {

  const [imageUploaded, setImageUploaded] = useState(false);
  const navigate = useNavigate();

  const verificarImagen = {
    beforeUpload: (file) => {

      let extension = file.name.split('.');
      extension = extension[extension.length - 1].toLowerCase();
      if (extension != 'jpg' && extension != 'png') {
        message.error('Solo se permite archivos jpg y png.');
        return true;
      } else if (file.size > 6000000) {
        message.error('El tamaño de la imagen no puede exceder 6MB');
      } else if (file.size < 1000) {
        message.error('El tamaño de la imagen no puede ser menor a 1 KB');
      } else {
        setImageUploaded(true);
        message.success(`${file.name} subido correctamente.`);
        return false;
      }
      return true;
    },
    onRemove: () => {
      // Lógica para manejar la eliminación de la imagen
      setImageUploaded(false);
      message.warning('Imagen eliminada.');
    },
  };

  const onFinish = async (values) => {
    // se guarda en una variable la imagen del array de foto con el objeto del archivo original
    const imagen = values.foto[0].originFileObj;
    try {
      // se sube la imagen a Cloud Storage de firebase para almcenar las imagenes en la ruta designada
      const storageRef = ref(storage, `imagenes/empleados/${imagen.name}`);
      await uploadBytes(storageRef, imagen);
      // se obtiene la URL de la imagen subida para guardar en la lista de empleados
      const url = await getDownloadURL(storageRef);
      // se guarda los datos del empleado en la "ListaEmpleados" de la base de datos con los datos proporcionados
      const docRef = await addDoc(collection(db, "ListaEmpleados"), {
        Nombre: values.nombreCompleto, // Nombre del empleado
        FechaNacimiento: formatearFecha(values.fechaNacimiento.toDate()), // Fecha de nacimiento formateada
        CI: values.ci, // CI del empleado
        Genero: values.genero, // Género del empleado
        EstadoCivil: values.estadoCivil, // Estado civil del empleado
        NumeroTeléfono: values.telefono, // Número de teléfono del empleado
        FotoEmpleado: url, // URL de la foto del empleado
        CorreoElectrónico: values.email, // Correo electrónico del empleado
        PuestoOcargo: values.puesto, // Puesto o cargo del empleado
        Salario: values.salario, // Salario del empleado
        DirecciónDeDomicilio: values.direccion // Dirección de domicilio del empleado
      });
      // se muestro un modal de éxito si el documento se agrega correctamente
      ModalExito();
    } catch (error) {
      // si ocurre un error al agregar el documento, lo imprimo en la consola
      console.error("Error adding document: ", error);
    }
  };


  function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
    const año = fecha.getFullYear();

    return `${año}/${mes}/${dia}`;
  }
  const ModalExito = () => {
    Modal.success({
      title: 'Registro de Empleado',
      content: 'Los datos del empleado se han guardado correctamente.',
      onOk: () => { navigate('/sistema-administración'); } // Cambia '/otra-ruta' por la ruta a la que quieres redirigir
    });
  }

  const backHome = () => {
    navigate('/sistema-administración');
  }

  //   const initialValues = {
  //     nombreCompleto: "Javier López",
  //     ci: "8765432",
  //     genero: "Masculino",
  //     estadoCivil: "Casado",
  //     telefono: "987654321",
  //     email: "javier@example.com",
  //     puesto: "Técnico en Reparación de Celulares",
  //     salario: "4500",
  //     direccion: "Calle de la Reparación, Edificio TechFix, Local 101, Ciudad Digital",
  // };



  return (
    <div >
      <h2 className="form-title">Registro de empleado</h2>

      <Form
        name="registro_empleado"
        layout="horizontal"
        // initialValues={initialValues}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 22 }}
        onFinish={onFinish}
      // className="form-columns"
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
