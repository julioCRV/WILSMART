import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';

const ModalAperturaCaja = ({ confirmacion, nombre }) => {
    const [form] = Form.useForm();  // Inicializa el formulario con Ant Design Form
    const [isModalVisible, setIsModalVisible] = useState(false);  // Estado para controlar la visibilidad del primer modal
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);  // Estado para controlar la visibilidad del modal de confirmación
    const [montoInicial, setMontoInicial] = useState(0);  // Estado para almacenar el monto inicial de la caja
    const [dataCaja, setDataCaja] = useState([]);  // Estado para almacenar la información de la caja

    //Obtención de datos de caja desde firestore al montar el componente
    useEffect(() => {
        const idCaja = sessionStorage.getItem('id');  // Obtiene el ID de la caja desde sessionStorage
        if (idCaja != null) {  // Si el ID de la caja existe en sessionStorage
            // Función asíncrona para obtener los datos de la caja desde Firestore
            const fetchData2 = async () => {
                const docRef = doc(db, "HistorialAperturaCaja", idCaja);  // Referencia al documento de Firestore de HistorialAperturaCaja
                const docSnap = await getDoc(docRef);  // Obtiene el documento de Firestore

                if (docSnap.exists()) {  // Si el documento existe
                    const data = { ...docSnap.data(), id: docSnap.id };  // Extrae los datos y agrega el ID
                    setDataCaja(data);  // Establece los datos de la caja en el estado
                } else {
                    console.log("No such document!");  // Muestra un mensaje si el documento no existe
                }
            };
            fetchData2();  // Llama a la función para obtener los datos de la caja
        }
    }, []);  // El efecto se ejecuta una sola vez cuando el componente se monta

    // Función que maneja la validación del formulario y muestra el modal de confirmación si es válido
    const handleOk = () => {
        form.validateFields()  // Valida los campos del formulario
            .then((values) => {
                setMontoInicial(values.montoInicial);  // Establece el monto inicial de la caja
                setIsConfirmModalVisible(true);  // Muestra el modal de confirmación
            })
            .catch((info) => {
                message.error('Por favor complete el formulario correctamente.');  // Muestra un mensaje de error si el formulario no es válido
            });
    };

    // Función que maneja la confirmación de apertura de caja y agrega un documento en Firestore
    const handleConfirmOk = async () => {
        setIsConfirmModalVisible(false);  // Cierra el modal de confirmación
        setIsModalVisible(false);  // Cierra el modal inicial
        const tiempoActual = obtenerFechaHoraActual();  // Obtiene la fecha y hora actual

        try {
            // Intenta agregar un nuevo documento en la colección "HistorialAperturaCaja" en Firestore
            const docRef = await addDoc(collection(db, "HistorialAperturaCaja"), {
                Estado: true,
                Fecha: tiempoActual.fecha,  // Establece la fecha actual
                Hora: tiempoActual.hora,  // Establece la hora actual
                NombreEmpleado: nombre || 'administrador',  // Usa el nombre del empleado o 'administrador' por defecto
                MontoInicialCaja: parseInt(montoInicial),  // Establece el monto inicial de la caja
                MontoActualCaja: parseInt(montoInicial),  // Establece el monto actual de la caja
                MontoFinalCaja: parseInt(montoInicial),  // Establece el monto final de la caja
                TotalGanancias: 0,  // Inicializa el total de ganancias
                TotalCambio: 0,  // Inicializa el total de cambio
                TotalIngresoCaja: 0,  // Inicializa el total de ingreso en la caja
                TotalPagado: 0,  // Inicializa el total pagado
                TotalRetiroCaja: 0,  // Inicializa el total retirado de la caja
                TotalVentas: 0  // Inicializa el total de ventas
            });
            confirmacion("si");  // Ejecuta una función de confirmación
            message.success('Caja abierta exitosamente.');  // Muestra un mensaje de éxito
            estadoAbrirCaja("si");  // Actualiza el estado de la apertura de la caja
        } catch (e) {
            console.error("Error adding document: ", e);  // Muestra un error en caso de fallo
        }
    };

    // Función que cierra el modal de confirmación si se cancela
    const handleConfirmCancel = () => {
        setIsConfirmModalVisible(false);  // Cierra el modal de confirmación si se cancela
    };

    // Función que obtiene la fecha y hora actual en un formato específico
    const obtenerFechaHoraActual = () => {
        const ahora = new Date();  // Obtiene la fecha y hora actual

        // Formatea la fecha y hora en el formato requerido
        const dia = ahora.getDate().toString().padStart(2, '0');
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const año = ahora.getFullYear();
        const hora = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');

        const tiempo = {
            fecha: `${año}-${mes}-${dia}`,  // Formato de la fecha (yyyy-mm-dd)
            hora: `${hora}:${minutos}:${segundos}`  // Formato de la hora (hh:mm:ss)
        };

        return tiempo;  // Devuelve la fecha y hora actual
    };

    // Función que determina el estado de apertura de la caja según las condiciones de confirmación
    const estadoAbrirCaja = (confirma) => {
        if (confirma === "si") {
            return true;  // Si se confirma, devuelve verdadero
        } else {
            // Si no se confirma, verifica si hay datos en dataCaja
            if (Object.keys(dataCaja).length > 0) {
                return true;  // Si hay datos, devuelve verdadero
            } else {
                return false;  // Si no hay datos, devuelve falso
            }
        }
    }

    // Función que muestra el modal para la apertura de caja
    const accionApertura = () => {
        setIsModalVisible(true);  // Muestra el modal de apertura de caja
    }

    return (
        <>
            <Button onClick={accionApertura} disabled={estadoAbrirCaja("")} type='primary'>Abrir caja</Button>
            <Modal
                title="Apertura de caja"
                open={isModalVisible}
                onCancel={() => { setIsModalVisible(false) }}
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
                visible={isConfirmModalVisible}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
            >
                <p>Está inicializando la caja con un monto de {montoInicial} Bs. ¿Está seguro de continuar?</p>
            </Modal>
        </>
    );
};

export default ModalAperturaCaja;
