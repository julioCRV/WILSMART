import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistrarProducto.css';

const { Option } = Select;

const EditarProducto = () => {
    const location = useLocation();
    const dataProducto = location.state && location.state.objetoProp;
    const [imageUploaded, setImageUploaded] = useState(false);
    const navigate = useNavigate();

    // console.log(dataProducto.fechaNacimiento);
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
        //console.log('Received values of form: ', values);
        // console.log(values.imagen);

        const imagen = values.imagen[0].originFileObj;
        // try {
        //     // Sube la imagen a Cloud Storage
        //     const storageRef = ref(storage, `imagenes/${imagen.name}`);
        //     await uploadBytes(storageRef, imagen);

        //     // Obtiene la URL de descarga de la imagen
        //     const url = await getDownloadURL(storageRef);

        //     const docRef = await addDoc(collection(db, "ListaProductos"), {
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

        const docRef = doc(db, "ListaProductos", dataProducto.id);
        try {

            // Declarar url con un valor inicial
            let url = '';

            if (imagen.name === 'imagenProducto.jpg') {
                // Si el nombre de la imagen es 'imagenEmpleado.jpg', obtén la URL del dataProducto
                url = dataProducto.Imagen;
            } else {
                // Sube la imagen a Cloud Storage
                const storageRef = ref(storage, `imagenes/productos/${imagen.name}`);
                await uploadBytes(storageRef, imagen);

                // Obtiene la URL de descarga de la imagen
                url = await getDownloadURL(storageRef);
            }

            // Aquí puedes utilizar la variable url con el valor correspondiente
            await updateDoc(docRef, {
                Cantidad: values.cantidad,
                Categoria: values.categoria,
                Fecha: formatearFecha(values.fecha.toDate()),
                Precio: values.precio,
                Imagen: url,
                Marca: values.marca,
                Descripcion: values.descripcion,
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
            title: 'Actualizar datos del producto',
            content: 'Los datos del producto se han actualizado correctamente.',
            onOk: () => { navigate('/sistema-ventas/mostrar-productos'); }
        });
    }

    const backList = () => {
        navigate('/sistema-ventas/mostrar-productos');
    }

    const initialValues = {
        nombreProducto: dataProducto.NombreProducto,
        cantidad: dataProducto.Cantidad,
        categoria: dataProducto.Categoria,
        fecha: dayjs(dataProducto.Fecha),
        precio: dataProducto.Precio,
        imagen: [
            {
                uid: 'rc-upload-1717606230863-15',
                name: 'imagenProducto.jpg',
                lastModified: 1717602102812,
                lastModifiedDate: new Date('Wed Jun 05 2024 11:41:42 GMT-0400 (hora de Bolivia)'),
                originFileObj: new File([''], 'imagenProducto.jpg', { type: 'image/jpeg' }),
                percent: 0,
                size: 4642,
                type: 'image/jpeg',
                url: dataProducto.Imagen
            }
        ],
        marca: dataProducto.Marca,
        descripcion: dataProducto.Descripcion
    };

    return (
        <div >
            <h2 className="form-title">Editar producto</h2>

            <Form
                name="editar_producto"
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
                            name="fecha"
                            label="Fecha"
                            rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}
                        >
                            <DatePicker className='full-width' />
                        </Form.Item>


                        <Form.Item
                            name="precio"
                            label="Precio"
                            rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>

                    <div className="div22">
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


                    <div className='div33'>
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

export default EditarProducto;
