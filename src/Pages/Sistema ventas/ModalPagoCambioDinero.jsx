import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { db } from '../../FireBase/fireBase';
import { doc, updateDoc } from "firebase/firestore";
const { Option } = Select;

const ModalPagoCambioDinero = () => {
    // Define el estado para controlar la visibilidad del modal
    const [visible, setVisible] = useState(false);  // 'visible' controla si el modal está visible o no
    // Crea una instancia del formulario usando el hook 'useForm' de Ant Design
    const [form] = Form.useForm();  // 'form' contiene las propiedades y métodos del formulario

    // Función para mostrar el modal y reiniciar los campos del formulario
    const showModal = () => {
        form.resetFields();  // Resetea los campos del formulario a sus valores iniciales
        setVisible(true);  // Muestra el modal
    };

    // Función para cerrar el modal sin guardar cambios
    const handleCancel = () => {
        setVisible(false);  // Cierra el modal
    };

    // Función que maneja el registro de credenciales después de validar el formulario
    const handleRegister = () => {
        form.validateFields()  // Valida los campos del formulario
            .then(values => {
                // Lógica para manejar el registro de las credenciales
                actualizarCredenciales(values);  // Llama a la función para actualizar las credenciales
                setVisible(false);  // Cierra el modal
                actualizar("Si");  // Llama a la función 'actualizar' con el valor "Si"
            })
            .catch(info => {
                console.log('Validación fallida:', info);  // Muestra un mensaje si la validación falla
            });
    };

    // Función para actualizar las credenciales en Firestore
    const actualizarCredenciales = async (values) => {
        try {
            const docRef = doc(db, "ListaCredenciales", record.id);  // Obtiene la referencia del documento de Firestore
            await updateDoc(docRef, {
                SistemaAsignado: values.sistemaAsignado  // Actualiza el campo 'SistemaAsignado' con el valor del formulario
            });
            message.success('Credenciales registradas exitosamente.');  // Muestra un mensaje de éxito
        } catch (e) {
            console.error("Error updating document: ", e);  // Muestra un error en consola si la actualización falla
            message.error('Error al registrar las credenciales.');  // Muestra un mensaje de error
        }
    };

    const initialValues = {}  // Valores iniciales para el formulario (vacío en este caso)

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Registrar
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

export default ModalPagoCambioDinero;
