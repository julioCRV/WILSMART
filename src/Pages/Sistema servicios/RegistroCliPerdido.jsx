import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import { setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './RegistrarOrdenServicio.css';

const RegistrarOrdenServicio = ({ record, disabled, confirmacion }) => {
    // Declaración de estado para controlar la visibilidad del modal y el formulario.
    const [isModalVisible, setIsModalVisible] = useState(false); // Controla si el modal está visible.
    const [form] = Form.useForm(); // Controla el formulario de Ant Design.

    // Función para mostrar el modal y resetear los campos del formulario.
    const showModal = () => {
        form.resetFields(); // Resetear los campos del formulario antes de mostrar el modal.
        setIsModalVisible(true); // Mostrar el modal.
    };

    // Función para manejar el cierre del modal.
    const handleCancel = () => {
        setIsModalVisible(false); // Cierra el modal.
    };

    // Función para manejar la confirmación del formulario (se ejecuta al hacer clic en "Ok").
    const handleOk = () => {
        form.submit(); // Enviar el formulario.
    };

    // Función que se ejecuta cuando el formulario se envía correctamente.
    const onFinish = async (values) => {
        try {
            // Actualizar o agregar datos en "ListaClientesPerdidos".
            const docRef = doc(db, "ListaClientesPerdidos", record.id);
            await setDoc(docRef, {
                CodCliente: record.CodCliente, // Código del cliente.
                NombreCliente: values.nombreCliente, // Nombre del cliente.
                NombreDispositivo: record.NombreDispositivo, // Nombre del dispositivo.
                Fecha: formatearFecha(values.fecha.toDate()), // Fecha formateada.
                Motivo: values.motivo, // Motivo de cliente perdido.
            });

            // Actualizar el estado del cliente en "ListaClientes" a "Inactivo".
            const docRef2 = doc(db, "ListaClientes", record.id);
            try {
                await updateDoc(docRef2, {
                    Estado: "Inactivo", // Actualizar el estado a "Inactivo".
                });
                confirmacion("Si"); // Función de confirmación (probablemente muestra un mensaje).
                ModalExito(); // Llamar a la función para mostrar el modal de éxito.
            } catch (e) {
                console.error("Error updating document: ", e); // Manejo de errores.
            }
        } catch (error) {
            console.error("Error adding document: ", error); // Manejo de errores.
        }
    };

    // Función que se ejecuta cuando el formulario no se envía correctamente.
    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.'); // Mostrar un mensaje de error.
    };

    // Función para formatear las fechas en formato 'YYYY-MM-DD'.
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString); // Convertir el string de fecha en un objeto Date.

        const dia = fecha.getDate().toString().padStart(2, '0'); // Formatear el día.
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Formatear el mes (sumamos 1 porque en JavaScript los meses son base 0).
        const año = fecha.getFullYear(); // Obtener el año.

        return `${año}-${mes}-${dia}`; // Devolver la fecha en formato 'YYYY-MM-DD'.
    }

    // Función para mostrar un modal de éxito después de guardar los datos del cliente perdido.
    const ModalExito = () => {
        Modal.success({
            title: 'Registro de cliente perdido', // Título del modal.
            content: 'Los datos del cliente perdido se han guardado correctamente.', // Contenido del modal.
            onOk: () => { handleCancel(); } // Al hacer clic en "Ok", se cierra el modal.
        });
    };

    // Valores iniciales del formulario con los datos del cliente.
    const initialValues = {
        nombreCliente: record.NombreCliente, // Establecer el valor inicial del campo nombreCliente con el valor de 'record'.
    };

    return (
        <div>
            <Button onClick={showModal} disabled={disabled}>
                Registrar
            </Button>
            <Modal
                title="Registro de cliente perdido"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Registrar
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialValues}
                >
                    <div className='parentOS'>
                        <div className='divOS1'>
                            <Form.Item
                                name="nombreCliente"
                                label="Nombre"
                                rules={[{ required: true, message: 'Por favor ingrese un nombre' }]}
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="fecha"
                                label="Fecha"
                                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" y />
                            </Form.Item>


                            <Form.Item
                                name="motivo"
                                label="Motivo"
                                rules={[{ required: true, message: 'Por favor ingrese un motivo de la perdidad del cliente' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default RegistrarOrdenServicio;
