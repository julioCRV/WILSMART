import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Space, message } from 'antd';
import { auth, db } from '../../FireBase/fireBase';
import { collection, getDocs, addDoc, doc, deleteDoc,setDoc} from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { Option } = Select;

const ModalCrearCuenta = ({ record, desabilitar, actualizar }) => {
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
                registrarCredenciales(values);
                setVisible(false);
                actualizar("Si");
                message.success("¡Cuenta creada exitosamente!");
            })
            .catch(info => {
                // console.log('Validation Failed:', info);
            });
    };

    const signUp = (values) => {
        createUserWithEmailAndPassword(auth, values.correo, values.contraseña)
            .then((userCredential) => {
                // console.log(userCredential.user);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const registrarCredenciales = async (values) => {
        try {
            const docRef = doc(db, "ListaCredenciales", record.id);
            await setDoc(docRef, {
                Nombre: record.Nombre,
                Correo: record.CorreoElectrónico,
                EstadoCuenta: "Activo",
                SistemaAsignado: "Ninguno",
            });
            signUp(values);
            // console.log("Document written with ID: ", values.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const initialValues = { correo: record.CorreoElectrónico,  nombreEmpleado: record.Nombre}
    return (
        <>

            <Button type="default" disabled={desabilitar} onClick={showModal}>
                Crear cuenta
            </Button>
            <Modal
                visible={visible}
                title="Registro de cuenta"
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
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item
                        name="correo"
                        label="Correo"
                        rules={[{ required: true, message: 'Por favor ingrese su correo' }]}
                    >
                        <Input type="email" disabled />
                    </Form.Item>

                    {/* <Form.Item
                        name="sistemaAsignado"
                        label="Sistema designado"
                        rules={[{ required: true, message: 'Por favor ingrese su estado civil' }]}
                    >
                        <Select placeholder="Seleccione un sistema">
                            <Option value="sistemaVentas">Sistema de ventas</Option>
                            <Option value="sistemaServicios">Sistema de servicios</Option>
                        </Select>
                    </Form.Item> */}

                    <Form.Item
                        name="contraseña"
                        label="Contraseña"
                        rules={[{ required: true, message: 'Por favor ingrese su contraseña' },
                        { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                        ]}

                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalCrearCuenta;
