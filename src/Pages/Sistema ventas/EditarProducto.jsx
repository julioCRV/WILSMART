import React, { useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistrarProducto.css';

const EditarProducto = () => {
    // Importación de opciones de Select
    const { Option } = Select;
    // Manejo de la ubicación y navegación
    const location = useLocation();
    const dataProducto = location.state && location.state.objetoProp;
    const [imageUploaded, setImageUploaded] = useState(false); // Estado para rastrear si se subió la imagen
    const navigate = useNavigate(); // Para manejar la navegación

    // Verificaciones para la imagen antes de subirla
    const verificarImagen = {
        beforeUpload: (file) => {
            let extension = file.name.split('.'); // Divide el nombre del archivo para obtener la extensión
            extension = extension[extension.length - 1].toLowerCase(); // Obtén la extensión en minúsculas

            // Verificación de extensión
            if (extension !== 'jpg' && extension !== 'png') {
                message.error('Solo se permite archivos jpg y png.');
                return true;
            }
            // Verificación de tamaño máximo
            else if (file.size > 6000000) {
                message.error('El tamaño de la imagen no puede exceder 6MB');
            }
            // Verificación de tamaño mínimo
            else if (file.size < 1000) {
                message.error('El tamaño de la imagen no puede ser menor a 1 KB');
            }
            // Si pasa todas las verificaciones
            else {
                setImageUploaded(true); // Marca la imagen como subida
                message.success(`${file.name} subido correctamente.`);
                return false;
            }
            return true; // Cancela la subida si alguna verificación falla
        },
        onRemove: () => {
            // Lógica para manejar la eliminación de la imagen
            setImageUploaded(false); // Resetea el estado de la imagen
            message.warning('Imagen eliminada.');
        },
    };

    // Manejo del envío del formulario
    const onFinish = async (values) => {
        const imagen = values.imagen[0].originFileObj; // Obtén la imagen del formulario
        const docRef = doc(db, "ListaProductos", dataProducto.id); // Referencia al documento en la base de datos

        try {
            let url = ''; // Inicializa la variable URL

            if (imagen.name === 'imagenProducto.jpg') {
                // Si la imagen tiene un nombre predeterminado, usa la URL del dataProducto
                url = dataProducto.Imagen;
            } else {
                // Sube la imagen al almacenamiento en la nube
                const storageRef = ref(storage, `imagenes/productos/${imagen.name}`);
                await uploadBytes(storageRef, imagen);

                // Obtén la URL de descarga
                url = await getDownloadURL(storageRef);
            }

            // Actualiza el documento con los nuevos valores
            await updateDoc(docRef, {
                NombreProducto: values.nombreProducto,
                Cantidad: values.cantidad,
                Categoria: values.categoria,
                Fecha: formatearFecha(values.fecha.toDate()),
                Precio: values.precio,
                PrecioCompra: values.precioCompra,
                Imagen: url, // URL actualizada o mantenida
                Marca: values.marca,
                Descripcion: values.descripcion,
            });

            // Mostrar modal de éxito
            ModalExito();
        } catch (e) {
            console.error("Error al actualizar el documento: ", e);
        }
    };

    // Función para formatear fechas
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        const dia = fecha.getDate().toString().padStart(2, '0'); // Día con ceros a la izquierda
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes con ceros a la izquierda
        const año = fecha.getFullYear(); // Año completo

        return `${año}/${mes}/${dia}`; // Retorna en formato 'aaaa/mm/dd'
    }

    // Modal de éxito
    const ModalExito = () => {
        Modal.success({
            title: 'Actualizar datos del producto',
            content: 'Los datos del producto se han actualizado correctamente.',
            onOk: () => {
                navigate('/sistema-ventas/mostrar-productos'); // Navega de vuelta a la lista de productos
            },
        });
    };

    // Navegar de regreso a la lista de productos
    const backList = () => {
        navigate('/sistema-ventas/mostrar-productos'); // Redirecciona a la página de productos
    };

    // Valores iniciales del formulario, basados en los datos recibidos
    const initialValues = {
        nombreProducto: dataProducto.NombreProducto, // Nombre del producto
        cantidad: dataProducto.Cantidad, // Cantidad disponible
        categoria: dataProducto.Categoria, // Categoría del producto
        fecha: dayjs(dataProducto.Fecha), // Fecha, convertida a formato `dayjs`
        precio: dataProducto.Precio, // Precio del producto
        precioCompra: dataProducto.PrecioCompra, // Precio de compra
        imagen: [
            {
                uid: 'rc-upload-1717606230863-15', // Identificador único del archivo
                name: 'imagenProducto.jpg', // Nombre predeterminado de la imagen
                lastModified: 1717602102812, // Marca de tiempo de última modificación
                lastModifiedDate: new Date('Wed Jun 05 2024 11:41:42 GMT-0400 (hora de Bolivia)'), // Fecha de última modificación
                originFileObj: new File([''], 'imagenProducto.jpg', { type: 'image/jpeg' }), // Objeto del archivo original
                percent: 0, // Progreso de subida (0 ya que es predeterminado)
                size: 4642, // Tamaño del archivo en bytes
                type: 'image/jpeg', // Tipo MIME del archivo
                url: dataProducto.Imagen, // URL actual de la imagen
            },
        ],
        marca: dataProducto.Marca, // Marca del producto
        descripcion: dataProducto.Descripcion, // Descripción del producto
    };

    return (
        <div >
            <h2 className="form-title">Editar producto</h2>

            <Form
                name="editar_producto"
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
