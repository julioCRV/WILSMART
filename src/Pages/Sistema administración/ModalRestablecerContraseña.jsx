import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = ({ record, desabilitar, actualizar }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFinish = async (values) => {
        const auth = getAuth();
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, values.email);
            message.success('Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico.');
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Error al enviar el correo de restablecimiento de contraseña: ' + error.message);
        }
        setLoading(false);
    };

    const initialValues = {email: record.CorreoElectrónico}
    return (
        <>
            <Button disabled={desabilitar} onClick={showModal}>
                Restablecer contraseña
            </Button>
            <Modal
                title="Restablecer Contraseña"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleFinish} layout="vertical"
                initialValues={initialValues}>
                    <Form.Item
                        name="email"
                        label="Correo Electrónico"
                        rules={[{ required: true, message: 'Por favor ingrese su correo electrónico' }, { type: 'email', message: 'Por favor ingrese un correo electrónico válido' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Enviar Correo de Restablecimiento
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ResetPassword;
