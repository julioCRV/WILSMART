import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Space, message } from 'antd';
import { auth, db } from '../../FireBase/fireBase';
import { doc, updateDoc} from "firebase/firestore";
const { Option } = Select;

const ModalPagoCambioDinero = () => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        form.resetFields();
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };


    //------------------ REGISTRAR  CREDENCIALES---------------------------
    const handleRegister = () => {
        form.validateFields()
            .then(values => {
                // Lógica para manejar el registro
                actualizarCredenciales(values);
                setVisible(false);
                actualizar("Si");
            })
            .catch(info => {
                // console.log('Validation Failed:', info);
            });
    };

    const actualizarCredenciales = async (values) => {
        try {
            const docRef = doc(db, "ListaCredenciales", record.id);
            await updateDoc(docRef, {
                SistemaAsignado: values.sistemaAsignado
            });
            message.success('Credenciales registradas exitosamente.');
            // console.log("Document updated with ID: ", record.id);
        } catch (e) {
            console.error("Error updating document: ", e);
            message.error('Error al registrar las credenciales.');

        }
    };

    const initialValues = { }
    return (
        <>
            <Button type="primary"  onClick={showModal}>
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

                    {/* <Form.Item
                        name="contraseña"
                        label="Contraseña"
                        rules={[{ required: true, message: 'Por favor ingrese su contraseña' },
                        { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                        ]}

                    >
                        <Input.Password />
                    </Form.Item> */}
                </Form>
            </Modal>
        </>
    );
};

export default ModalPagoCambioDinero;
