import React from 'react';
import { Form, Input, Button, message, DatePicker, Select, Modal } from 'antd';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistrarRepuesto.css';

const { Option } = Select;

const EditarRepuesto = () => {
    // Obtención de la ubicación actual y el objeto de repuesto desde la navegación
    const location = useLocation();
    // Asignación de datos del repuesto desde la ubicación si están disponibles
    const dataRepuesto = location.state && location.state.objetoProp;
    // Navegación programática a otras rutas
    const navigate = useNavigate();

    // Función que maneja el envío del formulario para actualizar el repuesto
    const onFinish = async (values) => {
        // Muestra un mensaje de carga mientras se actualiza el repuesto
        const hide = message.loading('Actualizando repuesto...', 0);
        const docRef = doc(db, "ListaRepuestos", dataRepuesto.id); // Referencia al documento que se desea actualizar
        try {
            // Actualización del documento con los nuevos valores
            await updateDoc(docRef, {
                CodRepuesto: values.codRepuesto,
                NombreRepuesto: values.nombreRepuesto,
                Cantidad: parseInt(values.cantidad),
                Fecha: formatearFecha(values.fecha.toDate()),
                Categoria: values.categoria,
                Proveedor: values.proveedor,
                Estado: values.estado,
                Descripcion: values.descripcion,
                PrecioCompra: values.costo,
                PrecioRepuesto: values.precio,
                UbicacionAlmacen: values.ubicacion,
            });
            hide(); // Ocultar mensaje de carga
            ModalExito(); // Mostrar mensaje de éxito
        } catch (e) {
            hide(); // Ocultar mensaje de carga
            console.error("Error updating document: ", e); // Manejo de errores
        }
    };

    // Función para formatear la fecha en formato YYYY-MM-DD
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear();
        return `${año}-${mes}-${dia}`;
    }

    // Modal de éxito que se muestra después de la actualización exitosa
    const ModalExito = () => {
        Modal.success({
            title: 'Actualizar datos del repuesto',
            content: 'Los datos del repuesto se han actualizado correctamente.',
            onOk: () => {
                navigate('/sistema-servicios/mostrar-repuestos'); // Redirige a la lista de repuestos
            }
        });
    }

    // Función para regresar a la lista de repuestos
    const backList = () => {
        navigate('/sistema-servicios/mostrar-repuestos'); // Redirige a la lista de repuestos
    }

    // Valores iniciales de el formulario de un repuesto
    const initialValues = {
        codRepuesto: dataRepuesto.CodRepuesto,
        nombreRepuesto: dataRepuesto.NombreRepuesto,
        cantidad: dataRepuesto.Cantidad,
        fecha: dayjs(dataRepuesto.Fecha),
        categoria: dataRepuesto.Categoria,
        proveedor: dataRepuesto.Proveedor,

        estado: dataRepuesto.Estado,
        descripcion: dataRepuesto.Descripcion,
        costo: dataRepuesto.PrecioCompra,
        precio: dataRepuesto.PrecioRepuesto,
        ubicacion: dataRepuesto.UbicacionAlmacen,
    };

    return (
        <div >
            <h2 className="form-title">Editar repuesto</h2>

            <Form
                name="editar_producto"
                layout="horizontal"
                initialValues={initialValues}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 22 }}
                onFinish={onFinish}
            >
                <div className='parent2'>
                    <div className="div11">
                        <Form.Item
                            name="codRepuesto"
                            label="Código"
                            rules={[{ required: true, message: 'Por favor ingrese un código' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="nombreRepuesto"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor ingrese el nombre del repuesto' }]}
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
                            name="fecha"
                            label="Fecha de ingreso"
                            rules={[{ required: true, message: 'Por favor seleccione la fecha de ingreso' }]}
                        >
                            <DatePicker className='full-width' />
                        </Form.Item>

                        <Form.Item
                            name="categoria"
                            label="Categoria"
                            rules={[{ required: true, message: 'Por favor seleccione una categoria' }]}
                        >
                            <Select placeholder="Seleccione una categoria">
                                <Option value="Repuestos para celulares">Repuestos para celulares</Option>
                                <Option value="Repuestos para laptops">Repuestos para laptops</Option>
                                <Option value="Repuestos para televisores">Repuestos para televisores</Option>
                                <Option value="Repuestos para pc">Repuestos para pc</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="proveedor"
                            label="Proveedor"
                            rules={[{ required: true, message: 'Por favor ingrese un proveedor' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="div22">

                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{ required: true, message: 'Por favor ingrese un estado' }]}
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

                        <Form.Item
                            name="costo"
                            label="Precio de compra"
                            rules={[{ required: true, message: 'Por favor ingrese el precio de compra' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="precio"
                            label="Precio de repusto"
                            rules={[{ required: true, message: 'Por favor ingrese el precio de venta' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="ubicacion"
                            label="Ubicación en almacen"
                            rules={[{ required: true, message: 'Por favor ingrese la ubicación en almacen' }]}
                        >
                            <Input />
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

export default EditarRepuesto;
