import React, { useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistroEmpleado.css';

const { Option } = Select;

const EditarEmpleado = () => {
    // Obtiene la ubicación actual, que es útil para obtener parámetros de la URL o el estado.
    const location = useLocation();
    // Extrae el objeto 'objetoProp' del estado pasado a través de la navegación en la URL.
    const DataEmpleado = location.state && location.state.objetoProp;
    // Inicializa un estado que controla si una imagen ha sido subida.
    const [imageUploaded, setImageUploaded] = useState(false);
    // Función que permite navegar a diferentes rutas dentro de la aplicación.
    const navigate = useNavigate();

    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    // Objeto de configuración para la validación de la carga de imágenes
    const verificarImagen = {
        beforeUpload: (file) => {
            // Obtener la extensión del archivo y convertirla a minúsculas
            let extension = file.name.split('.');
            extension = extension[extension.length - 1].toLowerCase();

            // Verifica si la extensión es distinta a 'jpg' o 'png'
            if (extension != 'jpg' && extension != 'png') {
                message.error('Solo se permite archivos jpg y png.');
                return true;  // Bloquea la carga del archivo
            } else if (file.size > 6000000) {
                // Si el archivo es mayor de 6MB
                message.error('El tamaño de la imagen no puede exceder 6MB');
            } else if (file.size < 1000) {
                // Si el archivo es menor de 1KB
                message.error('El tamaño de la imagen no puede ser menor a 1 KB');
            } else {
                // Si todo es correcto, se marca la imagen como subida y se muestra mensaje de éxito
                setImageUploaded(true);
                message.success(`${file.name} subido correctamente.`);
                return false;  // Permite la carga del archivo
            }
            return true;  // Bloquea la carga si alguna condición no se cumple
        },
        onRemove: () => {
            // Lógica para manejar la eliminación de la imagen
            setImageUploaded(false);  // Resetea el estado de imagen cargada
            message.warning('Imagen eliminada.');  // Muestra un mensaje de advertencia
        },
    };

    // Función que se ejecuta al finalizar el formulario
    const onFinish = async (values) => {
        // Obtiene el archivo de imagen desde el formulario
        const imagen = values.foto[0].originFileObj;

        // Obtiene la referencia al documento en Firestore basado en el ID del empleado
        const docRef = doc(db, "ListaEmpleados", DataEmpleado.id);

        try {
            // Inicializa la variable de la URL de la imagen
            let url = '';

            // Si el nombre del archivo es 'imagenEmpleado.jpg', usa la URL existente del empleado
            if (imagen.name === 'imagenEmpleado.jpg') {
                url = DataEmpleado.FotoEmpleado;
            } else {
                // Si el nombre no es 'imagenEmpleado.jpg', sube la imagen a Firebase Storage
                const storageRef = ref(storage, `imagenes/${imagen.name}`);
                await uploadBytes(storageRef, imagen);

                // Obtiene la URL de descarga de la imagen subida
                url = await getDownloadURL(storageRef);
            }

            // Actualiza el documento del empleado en Firestore con los datos del formulario
            await updateDoc(docRef, {
                Nombre: values.nombreCompleto,
                FechaNacimiento: formatearFecha(values.fechaNacimiento.toDate()),
                CI: values.ci,
                Genero: values.genero,
                EstadoCivil: values.estadoCivil,
                NumeroTeléfono: values.telefono,
                FotoEmpleado: url,  // Asigna la URL de la imagen
                CorreoElectrónico: values.email,
                PuestoOcargo: values.puesto,
                Salario: values.salario,
                DirecciónDeDomicilio: values.direccion
            });

            // Muestra un modal de éxito al actualizar los datos
            ModalExito();
        } catch (e) {
            // Si ocurre algún error, lo muestra en la consola
            console.error("Error updating document: ", e);
        }
    };

    // Función para formatear la fecha al formato 'año/mes/día'
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        // Extrae el día, mes y año de la fecha
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses son base 0, sumamos 1
        const año = fecha.getFullYear();

        // Retorna la fecha en formato 'año/mes/día'
        return `${año}/${mes}/${dia}`;
    }

    // Función que muestra un modal de éxito cuando los datos del empleado se actualizan correctamente
    const ModalExito = () => {
        Modal.success({
            title: 'Actualizar datos del empleado',  // Título del modal
            content: 'Los datos del empleado se han actualizado correctamente.',  // Mensaje dentro del modal
            onOk: () => {
                navigate('/sistema-administración/mostrar-empleados');  // Redirige a la ruta de mostrar empleados cuando se presiona "OK"
            }
        });
    }

    // Función que navega hacia la lista de empleados
    const backList = () => {
        navigate('/sistema-administración/mostrar-empleados');  // Redirige a la ruta de mostrar empleados
    }

    // Valores iniciales del formulario, prellenando con los datos del empleado desde `DataEmpleado`
    const initialValues = {
        nombreCompleto: DataEmpleado.Nombre,  // Nombre del empleado
        fechaNacimiento: dayjs(DataEmpleado.FechaNacimiento),  // Fecha de nacimiento del empleado, formateada con dayjs
        ci: DataEmpleado.CI,  // Número de cédula de identidad
        genero: DataEmpleado.Genero,  // Género del empleado
        estadoCivil: DataEmpleado.EstadoCivil,  // Estado civil del empleado
        telefono: DataEmpleado.NumeroTeléfono,  // Teléfono del empleado
        foto: [  // Información de la foto del empleado
            {
                uid: 'rc-upload-1717606230863-15',  // Identificador único para el archivo
                name: 'imagenEmpleado.jpg',  // Nombre del archivo
                lastModified: 1717602102812,  // Última fecha de modificación del archivo (en formato timestamp)
                lastModifiedDate: new Date('Wed Jun 05 2024 11:41:42 GMT-0400 (hora de Bolivia)'),  // Fecha de modificación en formato de fecha legible
                originFileObj: new File([''], 'imagenEmpleado.jpg', { type: 'image/jpeg' }),  // Objeto `File` vacío con nombre 'imagenEmpleado.jpg'
                percent: 0,  // Porcentaje de carga del archivo (inicialmente 0)
                size: 4642,  // Tamaño del archivo en bytes
                type: 'image/jpeg',  // Tipo MIME del archivo
                url: DataEmpleado.FotoEmpleado  // URL de la foto del empleado
            }
        ],
        email: DataEmpleado.CorreoElectrónico,  // Correo electrónico del empleado
        puesto: DataEmpleado.PuestoOcargo,  // Puesto o cargo del empleado
        salario: DataEmpleado.Salario,  // Salario del empleado
        direccion: DataEmpleado.DirecciónDeDomicilio,  // Dirección del empleado
    };

    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    return (
        <div >
            <h2 className="form-title">Editar de empleado</h2>

            <Form
                name="editar_empleado"
                layout="horizontal"
                initialValues={initialValues}
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
            >
                <div className='contenedorRegistroE'>
                    <div className="divRE11">
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

                    <div className="divRE22">
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


                    <div className='divRE33'>
                        <div className="button-container">
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="default" htmlType="button" onClick={backList}>
                                    Cancelar
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="primary" htmlType="submit">
                                    Actualizar
                                </Button>
                            </Form.Item>
                        </div>
                    </div>

                </div>
            </Form >
        </div >
    );
};

export default EditarEmpleado;
