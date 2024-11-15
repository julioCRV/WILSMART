import React from 'react';
import { Form, Input, Button, message, DatePicker, Select, Modal } from 'antd';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './RegistrarRepuesto.css';

const RegistrarRepuesto = () => {
    // Importación de Option desde el componente Select de Ant Design, usado para los selectores.
    const { Option } = Select;

    // Hook de navegación de React Router para redirigir a otras rutas de la aplicación.
    const navigate = useNavigate();

    // Función que maneja el envío del formulario, registrando un nuevo repuesto en la base de datos.
    const onFinish = async (values) => {
        // Muestra un mensaje de carga mientras se realiza el registro.
        const hide = message.loading('Registrando repuesto...', 0);
        try {
            // Intenta agregar un nuevo documento a la colección "ListaRepuestos" en Firestore.
            const docRef = await addDoc(collection(db, "ListaRepuestos"), {
                CodRepuesto: values.codRepuesto,           // Código del repuesto.
                NombreRepuesto: values.nombreRepuesto,     // Nombre del repuesto.
                Cantidad: parseInt(values.cantidad),       // Cantidad de repuestos.
                Fecha: formatearFecha(values.fecha.toDate()), // Fecha formateada.
                Categoria: values.categoria,               // Categoría del repuesto.
                Proveedor: values.proveedor,               // Proveedor del repuesto.
                Estado: values.estado,                     // Estado del repuesto (nuevo, usado, etc.).
                Descripcion: values.descripcion,           // Descripción del repuesto.
                PrecioCompra: values.costo,                // Costo del repuesto.
                PrecioRepuesto: values.precio,             // Precio de venta del repuesto.
                UbicacionAlmacen: values.ubicacion,        // Ubicación del repuesto en el almacén.
            });
            // Llama a la función de éxito para mostrar un mensaje y redirigir.
            ModalExito();
            hide();
        } catch (error) {
            // En caso de error, oculta el mensaje de carga y muestra el error.
            hide();
            console.error("Error adding document: ", error);
        }
    };

    // Función que se llama cuando el formulario no pasa la validación, mostrando un mensaje de error.
    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.');
    };

    // Función que formatea la fecha a un formato estándar (YYYY-MM-DD).
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear();

        return `${año}-${mes}-${dia}`;
    }

    // Función que muestra un modal de éxito al guardar los datos del repuesto en la base de datos.
    const ModalExito = () => {
        Modal.success({
            title: 'Registro de repuesto',
            content: 'Los datos del repuesto se han guardado correctamente.',
            onOk: () => { navigate('/sistema-servicios/mostrar-repuestos'); } // Redirige al listado de repuestos.
        });
    }

    // Función para navegar de vuelta a la página principal del sistema de servicios.
    const backHome = () => {
        navigate('/sistema-servicios');
    }

    return (
        <div >
            <h2 className="form-title">Registrar repuesto</h2>

            <Form
                name="registro_respuesto"
                layout="horizontal"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 22 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
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

export default RegistrarRepuesto;
