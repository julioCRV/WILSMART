import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, message } from 'antd';
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db } from '../../FireBase/fireBase';

const ModalAperturaCaja = ({ confirmacion, nombre }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [montoInicial, setMontoInicial] = useState(0);
    const [dataCaja, setDataCaja] = useState([]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                setMontoInicial(values.montoInicial);
                setIsConfirmModalVisible(true);
            })
            .catch((info) => {
                message.error('Por favor complete el formulario correctamente.');
            });
    };

    const handleConfirmOk = async () => {
        setIsConfirmModalVisible(false);
        setIsModalVisible(false);
        const tiempoActual = obtenerFechaHoraActual();

        try {
            const docRef = await addDoc(collection(db, "HistorialAperturaCaja"), {
                Estado: true,
                Fecha: tiempoActual.fecha,
                Hora: tiempoActual.hora,
                NombreEmpleado: nombre,
                MontoInicialCaja: parseInt(montoInicial),
                MontoActualCaja: parseInt(montoInicial),
                MontoFinalCaja: parseInt(montoInicial),
                TotalGanancias: 0,
                TotalCambio: 0,
                TotalIngresoCaja: 0,
                TotalPagado: 0,
                TotalRetiroCaja: 0,
                TotalVentas: 0
            });
            // console.log("Document written with ID: ", docRef.id);
            confirmacion("si")
            message.success('Caja abierta exitosamente.');
            estadoAbrirCaja("si");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const handleConfirmCancel = () => {
        setIsConfirmModalVisible(false);
    };

    const obtenerFechaHoraActual = () => {
        const ahora = new Date();

        const dia = ahora.getDate().toString().padStart(2, '0');
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const año = ahora.getFullYear();
        const hora = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');

        const tiempo = {
            fecha: `${año}-${mes}-${dia}`,
            hora: `${hora}:${minutos}:${segundos}`
        };

        return tiempo;
    };

    const estadoAbrirCaja = (confirma) => {
        if (confirma === "si") {
            return true;
        } else {
            if (Object.keys(dataCaja).length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    const accionApertura = () => {
        setIsModalVisible(true);
    }

    useEffect(() => {
        const idCaja = sessionStorage.getItem('id');
        if (idCaja != null) {
            const fetchData2 = async () => {
                const docRef = doc(db, "HistorialAperturaCaja", idCaja);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = { ...docSnap.data(), id: docSnap.id };
                    setDataCaja(data)
                } else {
                    console.log("No such document!");
                }
            };
            fetchData2();
        }
    }, []);

    const reloadCurrentRoute = () => {
        navigate('/sistema-ventas/recargar');
        setTimeout(() => {
          navigate('/sistema-ventas/estado-caja');
        }, 50);
      };

    return (
        <>
            <Button onClick={accionApertura} disabled={estadoAbrirCaja("")} type='primary'>Abrir caja</Button>
            <Modal
                title="Apertura de caja"
                open={isModalVisible}
                // onOk={handleOk}
                // closable={false}
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
                    {/* <Form.Item
                        name="fecha"
                        label="Fecha"
                        rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item> */}
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
