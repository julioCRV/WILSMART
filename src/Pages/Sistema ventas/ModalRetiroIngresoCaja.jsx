import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, message, Space } from 'antd';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';

const ModalRetiroIngresoCaja = ({ confirmacion, dataCaja }) => {
    const [formR] = Form.useForm();
    const [formI] = Form.useForm();
    const [isModalVisibleR, setIsModalVisibleR] = useState(false);
    const [isModalVisibleI, setIsModalVisibleI] = useState(false);
    const [isConfirmModalVisibleR, setIsConfirmModalVisibleR] = useState(false);
    const [isConfirmModalVisibleI, setIsConfirmModalVisibleI] = useState(false);
    const [monto, setMonto] = useState(0);
    const [descripcionForm, setDescripcionForm] = useState("");

    const mostrarModalRetiroCaja = () => {
        formR.resetFields();
        setIsModalVisibleR(true);
    };


    const mostrarModalIngresoCaja = () => {
        formI.resetFields();
        setIsModalVisibleI(true);
    };

    const handleOkR = () => {
        formR.validateFields()
            .then((values) => {
                setMonto(values.monto);
                setDescripcionForm(values.descripcion);
                setIsConfirmModalVisibleR(true);
            })
            .catch((info) => {
                message.error('Por favor complete el formulario correctamente.');
            });
    };

    const handleOkI = () => {
        formI.validateFields()
            .then((values) => {
                setMonto(values.monto);
                setDescripcionForm(values.descripcion);
                setIsConfirmModalVisibleI(true);
            })
            .catch((info) => {
                message.error('Por favor complete el formulario correctamente.');
            });
    };

    const handleConfirmOkR = async () => {
        setIsConfirmModalVisibleR(false);
        setIsModalVisibleR(false);
        const tiempoActual = obtenerFechaHoraActual();
        const idCliente = sessionStorage.getItem('id');

        try {
            // Agregar documento a la colección "ListaCambiosCaja"
            const docRef = await addDoc(collection(db, "ListaCambiosCaja"), {
                Fecha: tiempoActual.fecha,
                Hora: tiempoActual.hora,
                NombreEmpleado: dataCaja.NombreEmpleado,
                IdEmpleado: idCliente,
                MontoCaja: dataCaja.MontoActualCaja,
                MontoRetiro: parseInt(monto),
                MontoIngreso: 0,
                Descripcion: descripcionForm
            });
            // console.log("Document written with ID: ", docRef.id);
            message.success('Retiro de dinero de caja realizado exitosamente.');

            // Actualizar documento en la colección "HistorialAperturaCaja"
            const docRefHistorial = doc(db, "HistorialAperturaCaja", idCliente);
            await updateDoc(docRefHistorial, {
                TotalRetiroCaja: dataCaja.TotalRetiroCaja + parseInt(monto),
                MontoActualCaja: dataCaja.MontoActualCaja - parseInt(monto)
            });
            confirmacion("sisi")
        } catch (e) {
            console.error("Error processing request: ", e);
        }
    };

    const handleConfirmCancelR = () => {
        setIsConfirmModalVisibleR(false);
    };

    const handleConfirmOkI = async () => {
        setIsConfirmModalVisibleI(false);
        setIsModalVisibleI(false);
        const tiempoActual = obtenerFechaHoraActual();
        const idCliente = sessionStorage.getItem('id');

        try {
            // Agregar documento a la colección "ListaCambiosCaja"
            const docRef = await addDoc(collection(db, "ListaCambiosCaja"), {
                Fecha: tiempoActual.fecha,
                Hora: tiempoActual.hora,
                NombreEmpleado: dataCaja.NombreEmpleado,
                IdEmpleado: idCliente,
                MontoCaja: dataCaja.MontoActualCaja,
                MontoRetiro: 0,
                MontoIngreso: parseInt(monto),
                Descripcion: descripcionForm
            });
            // console.log("Document written with ID: ", docRef.id);
            message.success('Ingreso de dinero a caja realizado exitosamente.');

            // Actualizar documento en la colección "HistorialAperturaCaja"
            const docRefHistorial = doc(db, "HistorialAperturaCaja", idCliente);
            await updateDoc(docRefHistorial, {
                TotalIngresoCaja: dataCaja.TotalIngresoCaja + parseInt(monto),
                MontoActualCaja: dataCaja.MontoActualCaja + parseInt(monto),
            });
            confirmacion("sisi")
        } catch (e) {
            console.error("Error processing request: ", e);
        }
    };

    const handleConfirmCancelI = () => {
        setIsConfirmModalVisibleI(false);
    };

    // useEffect(() => {
    //     verificarId();
    // }, []);

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

    const verificarId = () => {
        const idcaja = sessionStorage.getItem('id');
        if(idcaja!=null){
            return false;
        }else{
            return true;
        }
    }
    
    return (
        <>
            <Space>
                <Button disabled={verificarId()} type='primary' onClick={mostrarModalRetiroCaja}>Retira dinero</Button>
                <Button disabled={verificarId()} type='primary' onClick={mostrarModalIngresoCaja}>Ingresar dinero</Button>
            </Space>


            {/* R E T I R O */}
            <Modal
                title="Retiro de caja"
                width={400}
                open={isModalVisibleR}
                // onOk={handleOk}
                onCancel={() => { setIsModalVisibleR(false) }}
                footer={[
                    <Button key="okR" type="primary" onClick={handleOkR}>
                        Confirmar
                    </Button>,
                ]}
            >
                <p><strong>Dinero en caja: </strong> {dataCaja.MontoActualCaja}</p>
                <Form form={formR} layout="horizontal">
                    <Form.Item
                        name="monto"
                        label="Monto"
                        rules={[
                            { required: true, message: 'Por favor ingrese el dinero a retirar de caja' },
                            {
                                validator: (_, value) =>
                                    value <= dataCaja.MontoActualCaja
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('El monto a retirar no esta disponible en caja.'))
                            }
                        ]}
                    >
                        <Input prefix='Bs. ' type="number" />
                    </Form.Item>
                    <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                </Form>
            </Modal>

            {/* I N G R E S O */}
            <Modal
                title="Ingreso a caja"
                width={400}
                open={isModalVisibleI}
                // onOk={handleOk}
                // closable={() =>{setIsModalVisibleI(false)}}
                onCancel={() => { setIsModalVisibleI(false) }}
                footer={[
                    <Button key="okI" type="primary" onClick={handleOkI}>
                        Confirmar
                    </Button>,
                ]}
            >
                <p><strong>Dinero en caja: </strong> {dataCaja.MontoActualCaja}</p>
                <Form form={formI} layout="horizontal">
                    <Form.Item
                        name="monto"
                        label="Monto"
                        rules={[{ required: true, message: 'Por favor ingrese el dinero a ingresar en caja' }]}
                    >
                        <Input prefix='Bs. ' type="number" />
                    </Form.Item>
                    <Form.Item
                        name="descripcion"
                        label="Descripción"
                        rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Confirmación"
                open={isConfirmModalVisibleR}
                onOk={handleConfirmOkR}
                onCancel={handleConfirmCancelR}
            >
                <p>Está retirando de caja un monto de {monto} Bs. ¿Está seguro de continuar?</p>
            </Modal>

            <Modal
                title="Confirmación"
                open={isConfirmModalVisibleI}
                onOk={handleConfirmOkI}
                onCancel={handleConfirmCancelI}
            >
                <p>Está ingresando a caja un monto de {monto} Bs. ¿Está seguro de continuar?</p>
            </Modal>
        </>
    );
};

export default ModalRetiroIngresoCaja;
