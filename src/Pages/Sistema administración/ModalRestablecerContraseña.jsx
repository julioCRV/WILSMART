import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = ({ record, desabilitar, actualizar }) => {
    // Inicialización del formulario y estados para controlar la carga y la visibilidad del modal
    const [form] = Form.useForm(); // Crea el formulario con la API de Ant Design
    const [loading, setLoading] = useState(false); // Estado para controlar si el proceso está en curso
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    // Valores iniciales del formulario, con el correo electrónico del registro
    const initialValues = { email: record.CorreoElectrónico };

    // Función para mostrar el modal
    const showModal = () => {
        setIsModalVisible(true); // Establece el estado del modal a visible
    };

    // Función para cancelar la acción y cerrar el modal
    const handleCancel = () => {
        setIsModalVisible(false); // Establece el estado del modal a invisible
    };

    // Función que se ejecuta cuando se completa el formulario
    const handleFinish = async (values) => {
        const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase
        setLoading(true); // Activa el estado de carga al comenzar el proceso
        try {
            // Envía el correo de restablecimiento de contraseña a la dirección proporcionada
            await sendPasswordResetEmail(auth, values.email);
            message.success('Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico.'); // Muestra mensaje de éxito
            setIsModalVisible(false); // Cierra el modal
            form.resetFields(); // Resetea los campos del formulario
        } catch (error) {
            // Muestra mensaje de error si algo falla
            message.error('Error al enviar el correo de restablecimiento de contraseña: ' + error.message);
        }
        setLoading(false); // Desactiva el estado de carga
    };

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
