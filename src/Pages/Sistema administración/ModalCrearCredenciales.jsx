import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Space, message } from 'antd';
import { db } from '../../FireBase/fireBase';
import { doc, updateDoc } from "firebase/firestore";
const { Option } = Select;

const ModalCrearCredenciales = ({ record, desabilitar, actualizar }) => {
    // Definición del estado 'visible' para controlar la visibilidad del modal y el estado del formulario.
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm(); // Inicializa el formulario
    const initialValues = { correo: record.CorreoElectrónico, nombreEmpleado: record.Nombre }; // Establece los valores iniciales del formulario con los datos del registro

    // Función que se ejecuta al mostrar el modal
    const showModal = () => {
        form.resetFields(); // Resetea los campos del formulario a sus valores iniciales
        setVisible(true); // Muestra el modal
    };

    // Función para manejar el cierre del modal
    const handleCancel = () => {
        setVisible(false); // Oculta el modal
    };

    // ------------------ REGISTRAR CREDENCIALES ---------------------------

    // Función que maneja el registro de credenciales
    const handleRegister = () => {
        // Valida los campos del formulario antes de realizar el registro
        form.validateFields()
            .then(values => {
                // Si la validación es exitosa, actualiza las credenciales
                actualizarCredenciales(values);
                setVisible(false); // Cierra el modal
                actualizar("Si"); // Actualiza la lista o la vista de alguna manera
            })
            .catch(info => {
                console.log('Validation Failed:', info); // Muestra un mensaje si la validación falla
            });
    };

    // Función para actualizar las credenciales en la base de datos
    const actualizarCredenciales = async (values) => {
        try {
            const docRef = doc(db, "ListaCredenciales", record.id); // Obtiene el documento con el ID correspondiente
            await updateDoc(docRef, {
                SistemaAsignado: values.sistemaAsignado // Actualiza el campo 'SistemaAsignado' con el valor seleccionado
            });
            message.success('Credenciales registradas exitosamente.'); // Muestra mensaje de éxito
        } catch (e) {
            console.error("Error updating document: ", e); // Muestra el error en consola en caso de fallo
            message.error('Error al registrar las credenciales.'); // Muestra mensaje de error
        }
    };

    return (
        <>
            <Button type="default" disabled={desabilitar} onClick={showModal}>
                Dar credenciales
            </Button>
            <Modal
                visible={visible}
                title="Registro de credenciales"
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="register" type="primary" onClick={handleRegister}>
                        Registrar
                    </Button>,
                ]}
            >
                <div style={{ marginTop: "35px" }}></div>
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                    initialValues={initialValues}
                >
                    <Form.Item
                        name="nombreEmpleado"
                        label="Nombre de usuario"
                        rules={[{ required: true, message: 'Por favor su nombre de usuario' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="correo"
                        label="Correo"
                        rules={[{ required: true, message: 'Por favor ingrese su correo' }]}
                    >
                        <Input type="email" disabled />
                    </Form.Item>

                    <Form.Item
                        name="sistemaAsignado"
                        label="Sistema asignado"
                        rules={[{ required: true, message: 'Por favor ingrese un sistema asignado' }]}
                    >
                        <Select placeholder="Seleccione un sistema">
                            <Option value="Sistema de ventas">Sistema de ventas</Option>
                            <Option value="Sistema de servicios">Sistema de servicios</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalCrearCredenciales;
