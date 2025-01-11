import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';

const ModalAperturaCaja = ({ confirmacion, nombre }) => {
    // Se inicializa el formulario con Form.useForm() para gestionar los valores y la validación del formulario.
    const [form] = Form.useForm();

    // Estado que controla la visibilidad de un modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Estado que controla la visibilidad de un modal de confirmación
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    // Estado para almacenar el monto inicial
    const [montoInicial, setMontoInicial] = useState(0);

    // useEffect que se ejecuta cuando el componente se monta. Verifica si el id de la caja está en sessionStorage y muestra un modal si no está presente.
    useEffect(() => {
        const idcaja = sessionStorage.getItem('id');
        // Si no se encuentra un id en sessionStorage, se muestra el modal
        if (idcaja === null) {
            showModal();
        }
        // Si el nombre no está vacío, se almacena en sessionStorage
        if (nombre != "") {
            sessionStorage.setItem('nombre', nombre);
        }
    }, []);

    // Función que muestra el modal
    const showModal = () => {
        setIsModalVisible(true); // Cambia el estado para mostrar el modal
    };

    // Función que maneja la acción cuando se confirma en el primer modal
    const handleOk = () => {
        form.validateFields()  // Valida los campos del formulario
            .then((values) => {
                setMontoInicial(values.montoInicial);  // Almacena el monto inicial del formulario
                setIsConfirmModalVisible(true);  // Muestra el modal de confirmación
            })
            .catch((info) => {
                message.error('Por favor complete el formulario correctamente.');  // Muestra un mensaje de error si el formulario no es válido
            });
    };

    // Función que maneja la acción cuando se confirma en el modal de confirmación
    const handleConfirmOk = async () => {
        setIsConfirmModalVisible(false);  // Cierra el modal de confirmación
        setIsModalVisible(false);  // Cierra el modal original

        const tiempoActual = obtenerFechaHoraActual();  // Obtiene la fecha y hora actual

        try {
            // Intenta agregar un nuevo documento en la colección "HistorialAperturaCaja"
            const docRef = await addDoc(collection(db, "HistorialAperturaCaja"), {
                Estado: true,
                Fecha: tiempoActual.fecha,  // Fecha actual
                Hora: tiempoActual.hora,    // Hora actual
                NombreEmpleado: sessionStorage.getItem('nombre'),  // Nombre del empleado desde sessionStorage
                MontoInicialCaja: parseInt(montoInicial),  // Monto inicial de la caja
                MontoActualCaja: parseInt(montoInicial),   // Monto actual de la caja
                MontoFinalCaja: parseInt(montoInicial),    // Monto final de la caja
                TotalGanancias: 0,           // Total de ganancias inicial
                TotalCambio: 0,              // Total de cambio inicial
                TotalIngresoCaja: 0,        // Total de ingresos de la caja
                TotalPagado: 0,             // Total pagado inicialmente
                TotalRetiroCaja: 0,         // Total de retiro de la caja
                TotalVentas: 0              // Total de ventas inicial
            });
            confirmacion("si");  // Llama a la función confirmacion con el estado "si"
            message.success('Caja abierta exitosamente.');  // Muestra un mensaje de éxito
        } catch (e) {
            console.error("Error adding document: ", e);  // Maneja el error si la operación falla
        }
    };

    // Función que maneja la acción cuando se cancela el modal de confirmación
    const handleConfirmCancel = () => {
        setIsConfirmModalVisible(false);  // Cierra el modal de confirmación
    };

    // Función que obtiene la fecha y hora actuales en el formato adecuado
    const obtenerFechaHoraActual = () => {
        const ahora = new Date();  // Crea un nuevo objeto Date con la fecha y hora actuales

        // Extrae y formatea la fecha y hora
        const dia = ahora.getDate().toString().padStart(2, '0');
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const año = ahora.getFullYear();
        const hora = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');

        const tiempo = {
            fecha: `${año}-${mes}-${dia}`,  // Formato YYYY-MM-DD
            hora: `${hora}:${minutos}:${segundos}`  // Formato HH:MM:SS
        };

        return tiempo;  // Devuelve el objeto con la fecha y hora
    };

    return (
        <>
            <Modal
                title="Apertura de caja"
                open={isModalVisible}
                closable={false}
                onCancel={() => { }}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        Confirmar
                    </Button>,
                ]}
            >
                <Form form={form} layout="horizontal">
                    <Form.Item
                        name="montoInicial"
                        label="Monto de caja inicial"
                        rules={[{ required: true, message: 'Por favor ingrese el monto inicial' }]}
                    >
                        <Input prefix='Bs. ' type="number" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirmación"
                open={isConfirmModalVisible}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
            >
                <p>Está inicializando la caja con un monto de {montoInicial} Bs. ¿Está seguro de continuar?</p>
            </Modal>
        </>
    );
};

export default ModalAperturaCaja;
