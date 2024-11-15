import React, { useState } from 'react';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { Button, Input, Form, message, Modal } from 'antd';

const EliminarCuenta = ({ record, desabilitar, actualizar }) => {
    // Crea una instancia del formulario utilizando el hook `useForm` de Ant Design
    const [form] = Form.useForm();
    // Crea un estado para controlar la visibilidad del modal. 
    const [isModalVisible, setIsModalVisible] = useState(false);


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    // Función que muestra el modal y resetea los campos del formulario
    const showModal = () => {
        form.resetFields();  // Resetea los campos del formulario a sus valores iniciales
        setIsModalVisible(true);  // Muestra el modal
    };

    // Función que oculta el modal sin hacer ninguna acción
    const handleCancel = () => {
        setIsModalVisible(false);  // Oculta el modal
    };

    // Función que maneja la eliminación de cuenta del usuario autenticado
    const handleDeleteAccount = (values) => {
        const auth = getAuth();  // Obtiene la instancia de autenticación de Firebase
        const user = auth.currentUser;  // Obtiene el usuario actualmente autenticado

        if (user) {  // Verifica si hay un usuario autenticado
            // Crea las credenciales con el correo electrónico y la contraseña proporcionados
            const credential = EmailAuthProvider.credential(values.email, values.password);

            // Reautentica al usuario con las credenciales proporcionadas
            reauthenticateWithCredential(user, credential)
                .then(() => {
                    // Si la reautenticación es exitosa, elimina al usuario
                    deleteUser(user)
                        .then(() => {
                            message.success("Cuenta eliminada exitosamente.");  // Muestra mensaje de éxito
                            eliminarCredenciales(record.id);  // Llama a la función para eliminar las credenciales del usuario en Firestore
                            setIsModalVisible(false);  // Cierra el modal
                            actualizar("Si");  // Llama a la función `actualizar` pasando "Si"
                        })
                        .catch((error) => {
                            message.error("Error al eliminar la cuenta: " + error.message);  // Muestra mensaje de error si falla la eliminación
                        });
                })
                .catch((error) => {
                    message.error("Contraseña incorrecta. Inténtelo de nuevo.");  // Si la reautenticación falla, muestra mensaje de error
                    console.log(error);  // Muestra el error en consola
                });
        } else {
            message.error("No hay ningún usuario autenticado.");  // Si no hay un usuario autenticado, muestra mensaje de error
        }
    };

    // Función para eliminar las credenciales del usuario en Firestore
    const eliminarCredenciales = async (id) => {
        const docRef = doc(db, "ListaCredenciales", id);  // Obtiene la referencia del documento en Firestore
        try {
            await deleteDoc(docRef);  // Elimina el documento de Firestore
        } catch (e) {
            console.error("Error deleting document: ", e);  // Muestra el error en consola si falla la eliminación
        }
    };

    // Valores iniciales del formulario, prellenados con el correo electrónico del registro
    const initialValues = { email: record.CorreoElectrónico };

    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

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
