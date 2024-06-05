import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import './RegistroEmpleado.css';

const { Option } = Select;

const EditarEmpleado = () => {
    const location = useLocation();
    const DataEmpleado = location.state && location.state.objetoProp;
    const [imageUploaded, setImageUploaded] = useState(false);
    const navigate = useNavigate();

    // console.log(DataEmpleado.fechaNacimiento);
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
        console.log('Received values of form: ', values);
        // console.log(values.imagen);

        const imagen = values.foto[0].originFileObj;
        // try {
        //     // Sube la imagen a Cloud Storage
        //     const storageRef = ref(storage, `imagenes/${imagen.name}`);
        //     await uploadBytes(storageRef, imagen);

        //     // Obtiene la URL de descarga de la imagen
        //     const url = await getDownloadURL(storageRef);

        //     const docRef = await addDoc(collection(db, "ListaEmpleados"), {
        //         Nombre: values.nombreCompleto,
        //         FechaNacimiento: formatearFecha(values.fechaNacimiento.toDate()),
        //         CI: values.ci,
        //         Genero: values.genero,
        //         EstadoCivil: values.estadoCivil,
        //         NumeroTeléfono: values.telefono,
        //         FotoEmpleado: url,
        //         CorreoElectrónico: values.email,
        //         PuestoOcargo: values.puesto,
        //         Salario: values.salario,
        //         DirecciónDeDomicilio: values.direccion
        //     });
        //     console.log("Document written with ID: ", docRef.id);
        //     ModalExito();
        // } catch (error) {
        //     console.error("Error adding document: ", error);
        // }

        const docRef = doc(db, "ListaEmpleados", DataEmpleado.id);
        try {

            // Declarar url con un valor inicial
            let url = '';

            if (imagen.name === 'imagenEmpleado.jpg') {
                // Si el nombre de la imagen es 'imagenEmpleado.jpg', obtén la URL del DataEmpleado
                url = DataEmpleado.FotoEmpleado;
            } else {
                // Sube la imagen a Cloud Storage
                const storageRef = ref(storage, `imagenes/${imagen.name}`);
                await uploadBytes(storageRef, imagen);

                // Obtiene la URL de descarga de la imagen
                url = await getDownloadURL(storageRef);
            }

            // Aquí puedes utilizar la variable url con el valor correspondiente


            await updateDoc(docRef, {
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
                DirecciónDeDomicilio: values.direccion
            });
            console.log("Document updated");
            ModalExito();
        } catch (e) {
            console.error("Error updating document: ", e);
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
            title: 'Actualizar Datos del Empleado',
            content: 'Los datos del empleado se han actualizado correctamente.',
            onOk: () => { navigate('/sistema-administración'); } // Cambia '/otra-ruta' por la ruta a la que quieres redirigir
        });
    }

    const initialValues = {
        nombreCompleto: DataEmpleado.Nombre,
        fechaNacimiento: moment(DataEmpleado.FechaNacimiento, 'YYYY-MM-DD'),
        ci: DataEmpleado.CI,
        genero: DataEmpleado.Genero,
        estadoCivil: DataEmpleado.EstadoCivil,
        telefono: DataEmpleado.NumeroTeléfono,
        foto: [
            {
                uid: 'rc-upload-1717606230863-15',
                name: 'imagenEmpleado.jpg',
                lastModified: 1717602102812,
                lastModifiedDate: new Date('Wed Jun 05 2024 11:41:42 GMT-0400 (hora de Bolivia)'),
                originFileObj: new File([''], 'imagenEmpleado.jpg', { type: 'image/jpeg' }),
                percent: 0,
                size: 4642,
                type: 'image/jpeg',
                url: DataEmpleado.FotoEmpleado
            }
        ],
        email: DataEmpleado.CorreoElectrónico,
        puesto: DataEmpleado.PuestoOcargo,
        salario: DataEmpleado.Salario,
        direccion: DataEmpleado.DirecciónDeDomicilio,
    };

    return (
        <div >
            <h2 className="form-title">Editar de empleado</h2>

            <Form
                name="editar_empleado"
                layout="horizontal"
                initialValues={initialValues}
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
                            <Input />
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
                            <Input />
                        </Form.Item>
                    </div>


                    <div className='div33'>
                        <div className="button-container">
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="primary" htmlType="submit">
                                    Actualizar
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="default" htmlType="button">
                                    Cancelar
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
