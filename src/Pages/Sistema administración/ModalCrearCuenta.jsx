import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { auth, db } from '../../FireBase/fireBase';
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

const ModalCrearCuenta = ({ record, desabilitar, actualizar }) => {
    // Declaración de los estados para controlar la visibilidad del modal y el formulario
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm(); // Inicializa el formulario
    const initialValues = { correo: record.CorreoElectrónico, nombreEmpleado: record.Nombre }; // Establece los valores iniciales para el formulario

    // Función para mostrar el modal y resetear los campos del formulario
    const showModal = () => {
        form.resetFields(); // Resetea los campos del formulario
        setVisible(true); // Muestra el modal
    };

    // Función para cancelar la acción y cerrar el modal
    const handleCancel = () => {
        setVisible(false); // Oculta el modal
    };

    // ------------------ REGISTRAR CREDENCIALES ---------------------------

    // Función para manejar el registro de credenciales
    const handleRegister = () => {
        // Valida los campos del formulario antes de proceder con el registro
        form.validateFields()
            .then(values => {
                // Si la validación es exitosa, registra las credenciales
                registrarCredenciales(values);
                setVisible(false); // Cierra el modal
                actualizar("Si"); // Actualiza la lista o vista según el caso
                message.success("¡Cuenta creada exitosamente!"); // Muestra un mensaje de éxito
            })
            .catch(info => {
                console.log('Validation Failed:', info); // Si la validación falla, muestra un mensaje de error
            });
    };

    // Función para crear un usuario con Firebase Auth
    const signUp = (values) => {
        // Crea un nuevo usuario con el correo y la contraseña proporcionados
        createUserWithEmailAndPassword(auth, values.correo, values.contraseña)
            .then((userCredential) => {
                console.log(userCredential.user); // Muestra los detalles del usuario creado
            })
            .catch((error) => {
                console.error(error); // Muestra un error si la creación del usuario falla
            });
    };

    // Función para registrar las credenciales en Firestore
    const registrarCredenciales = async (values) => {
        try {
            const docRef = doc(db, "ListaCredenciales", record.id); // Obtiene el documento de credenciales por el ID del registro
            await setDoc(docRef, {
                Nombre: record.Nombre, // Guarda el nombre del empleado
                Correo: record.CorreoElectrónico, // Guarda el correo electrónico del empleado
                EstadoCuenta: "Activo", // Establece el estado de la cuenta como activo
                SistemaAsignado: "Ninguno", // Inicializa el sistema asignado como "Ninguno"
            });
            signUp(values); // Llama a la función para crear el usuario con Firebase Auth
        } catch (e) {
            console.error("Error adding document: ", e); // Muestra un error si falla al agregar el documento en Firestore
        }
    };


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
