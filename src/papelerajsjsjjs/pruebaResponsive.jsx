import React from 'react';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Button, Input, Form, message } from 'antd';

const EliminarCuenta = () => {
    const [form] = Form.useForm();

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
                        })
                        .catch((error) => {
                            message.error("Error al eliminar la cuenta: " + error.message);
                        });
                })
                .catch((error) => {
                    message.error("Error al re-autenticar al usuario: " + error.message);
                });
        } else {
            message.error("No hay ningún usuario autenticado.");
        }
    };

    return (
        <Form form={form} onFinish={handleDeleteAccount} layout="vertical">
            <Form.Item
                name="email"
                label="Correo Electrónico"
                rules={[{ required: true, message: 'Por favor ingrese su correo electrónico' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Contraseña"
                rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Eliminar Cuenta
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EliminarCuenta;
