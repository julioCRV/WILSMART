import React, { useState } from 'react';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { Button, Input, Form, message, Modal } from 'antd';

const EliminarCuenta = ({ record, desabilitar, actualizar }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteAccount = (values) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const credential = EmailAuthProvider.credential(values.email, values.password);

            reauthenticateWithCredential(user, credential)
                .then(() => {
                    deleteUser(user)
                        .then(() => {
                            message.success("Cuenta eliminada exitosamente.");
                            eliminarCredenciales(record.id);
                            setIsModalVisible(false);
                            actualizar("Si");
                        })
                        .catch((error) => {
                            message.error("Error al eliminar la cuenta: " + error.message);
                        });
                })
                .catch((error) => {
                    message.error("Contraseña incorrecta. Inténtelo de nuevo.");
                    console.log(error);
                });
        } else {
            message.error("No hay ningún usuario autenticado.");
        }
    };

    const eliminarCredenciales = async(id) => {
        const docRef = doc(db, "ListaCredenciales", id);
        try {
            await deleteDoc(docRef);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }

    const initialValues = { email: record.CorreoElectrónico };

    return (
        <>
            <Button onClick={showModal} disabled={desabilitar}>
                Eliminar Cuenta
            </Button>
            <Modal
                title="Eliminar Cuenta"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <div style={{ marginTop: "35px" }}></div>
                <Form form={form} onFinish={handleDeleteAccount}
                    layout="horizontal"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 12 }}
                    initialValues={initialValues}
                >
                    <Form.Item
                        name="email"
                        label="Correo Electrónico"
                        rules={[{ required: true, message: 'Por favor ingrese su correo electrónico' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Contraseña"
                        rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item style={{ marginLeft: '70%' }}>
                        <Button type="primary" htmlType="submit">
                            Eliminar Cuenta
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EliminarCuenta;
