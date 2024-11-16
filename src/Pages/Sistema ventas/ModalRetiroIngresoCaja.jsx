import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';

const ModalRetiroIngresoCaja = ({ confirmacion, dataCaja }) => {
    // Se crean dos instancias de formularios usando el hook 'useForm' de Ant Design
    const [formR] = Form.useForm();  // 'formR' para el formulario relacionado con 'R'
    const [formI] = Form.useForm();  // 'formI' para el formulario relacionado con 'I'
    // Define el estado para controlar la visibilidad de los modales
    const [isModalVisibleR, setIsModalVisibleR] = useState(false);  // Controla la visibilidad del modal 'R'
    const [isModalVisibleI, setIsModalVisibleI] = useState(false);  // Controla la visibilidad del modal 'I'
    // Define el estado para controlar la visibilidad de los modales de confirmación
    const [isConfirmModalVisibleR, setIsConfirmModalVisibleR] = useState(false);  // Modal de confirmación para 'R'
    const [isConfirmModalVisibleI, setIsConfirmModalVisibleI] = useState(false);  // Modal de confirmación para 'I'
    // Define el estado para manejar el monto y la descripción
    const [monto, setMonto] = useState(0);  // Monto a registrar o modificar
    const [descripcionForm, setDescripcionForm] = useState("");  // Descripción del formulario

    // Función para mostrar el modal de retiro de caja
    const mostrarModalRetiroCaja = () => {
        formR.resetFields();  // Resetea los campos del formulario 'R'
        setIsModalVisibleR(true);  // Muestra el modal de retiro de caja
    };

    // Función para mostrar el modal de ingreso de caja
    const mostrarModalIngresoCaja = () => {
        formI.resetFields();  // Resetea los campos del formulario 'I'
        setIsModalVisibleI(true);  // Muestra el modal de ingreso de caja
    };

    // Función para manejar el clic en el botón "OK" del modal de retiro de caja
    const handleOkR = () => {
        formR.validateFields()  // Valida los campos del formulario 'R'
            .then((values) => {
                // Si la validación es exitosa, establece los valores del monto y la descripción
                setMonto(values.monto);
                setDescripcionForm(values.descripcion);
                setIsConfirmModalVisibleR(true);  // Muestra el modal de confirmación para el retiro
            })
            .catch((info) => {
                message.error('Por favor complete el formulario correctamente.');  // Muestra un mensaje de error si el formulario no es válido
            });
    };

    // Función para manejar el clic en el botón "OK" del modal de ingreso de caja
    const handleOkI = () => {
        formI.validateFields()  // Valida los campos del formulario 'I'
            .then((values) => {
                // Si la validación es exitosa, establece los valores del monto y la descripción
                setMonto(values.monto);
                setDescripcionForm(values.descripcion);
                setIsConfirmModalVisibleI(true);  // Muestra el modal de confirmación para el ingreso
            })
            .catch((info) => {
                message.error('Por favor complete el formulario correctamente.');  // Muestra un mensaje de error si el formulario no es válido
            });
    };

    // Función para confirmar el retiro de dinero de la caja
    const handleConfirmOkR = async () => {
        setIsConfirmModalVisibleR(false);  // Cierra el modal de confirmación de retiro
        setIsModalVisibleR(false);  // Cierra el modal de retiro
        const tiempoActual = obtenerFechaHoraActual();  // Obtiene la fecha y hora actuales
        const idCliente = sessionStorage.getItem('id');  // Obtiene el ID del cliente desde sessionStorage

        try {
            // Agregar documento a la colección "ListaCambiosCaja" para registrar el retiro
            const docRef = await addDoc(collection(db, "ListaCambiosCaja"), {
                Fecha: tiempoActual.fecha,  // Fecha actual
                Hora: tiempoActual.hora,  // Hora actual
                NombreEmpleado: dataCaja.NombreEmpleado,  // Nombre del empleado que realizó el retiro
                IdEmpleado: idCliente,  // ID del empleado
                MontoCaja: dataCaja.MontoActualCaja,  // Monto actual en la caja
                MontoRetiro: parseInt(monto),  // Monto retirado
                MontoIngreso: 0,  // Monto ingresado (cero en este caso porque es un retiro)
                Descripcion: descripcionForm  // Descripción del retiro
            });
            message.success('Retiro de dinero de caja realizado exitosamente.');  // Mensaje de éxito al registrar el retiro

            // Actualizar documento en la colección "HistorialAperturaCaja" con el nuevo estado de la caja
            const docRefHistorial = doc(db, "HistorialAperturaCaja", idCliente);
            await updateDoc(docRefHistorial, {
                TotalRetiroCaja: dataCaja.TotalRetiroCaja + parseInt(monto),  // Sumar el monto retirado al total de retiros
                MontoActualCaja: dataCaja.MontoActualCaja - parseInt(monto)  // Restar el monto retirado al monto actual en la caja
            });
            confirmacion("sisi");  // Llama a la función de confirmación
        } catch (e) {
            console.error("Error processing request: ", e);  // Muestra un error en caso de que algo falle
        }
    };

    // Función para cancelar la confirmación del retiro
    const handleConfirmCancelR = () => {
        setIsConfirmModalVisibleR(false);  // Cierra el modal de confirmación de retiro si se cancela
    };

    // Función para confirmar el ingreso de dinero a la caja
    const handleConfirmOkI = async () => {
        setIsConfirmModalVisibleI(false);  // Cierra el modal de confirmación de ingreso
        setIsModalVisibleI(false);  // Cierra el modal de ingreso
        const tiempoActual = obtenerFechaHoraActual();  // Obtiene la fecha y hora actuales
        const idCliente = sessionStorage.getItem('id');  // Obtiene el ID del cliente desde sessionStorage

        try {
            // Agregar documento a la colección "ListaCambiosCaja" para registrar el ingreso
            const docRef = await addDoc(collection(db, "ListaCambiosCaja"), {
                Fecha: tiempoActual.fecha,  // Fecha actual
                Hora: tiempoActual.hora,  // Hora actual
                NombreEmpleado: dataCaja.NombreEmpleado,  // Nombre del empleado que realizó el ingreso
                IdEmpleado: idCliente,  // ID del empleado
                MontoCaja: dataCaja.MontoActualCaja,  // Monto actual en la caja
                MontoRetiro: 0,  // Monto retirado (cero en este caso porque es un ingreso)
                MontoIngreso: parseInt(monto),  // Monto ingresado
                Descripcion: descripcionForm  // Descripción del ingreso
            });
            message.success('Ingreso de dinero a caja realizado exitosamente.');  // Mensaje de éxito al registrar el ingreso

            // Actualizar documento en la colección "HistorialAperturaCaja" con el nuevo estado de la caja
            const docRefHistorial = doc(db, "HistorialAperturaCaja", idCliente);
            await updateDoc(docRefHistorial, {
                TotalIngresoCaja: dataCaja.TotalIngresoCaja + parseInt(monto),  // Sumar el monto ingresado al total de ingresos
                MontoActualCaja: dataCaja.MontoActualCaja + parseInt(monto),  // Sumar el monto ingresado al monto actual en la caja
            });
            confirmacion("sisi");  // Llama a la función de confirmación
        } catch (e) {
            console.error("Error processing request: ", e);  // Muestra un error en caso de que algo falle
        }
    };

    // Función para cancelar la confirmación del ingreso
    const handleConfirmCancelI = () => {
        setIsConfirmModalVisibleI(false);  // Cierra el modal de confirmación de ingreso si se cancela
    };

    // Función para obtener la fecha y hora actuales
    const obtenerFechaHoraActual = () => {
        const ahora = new Date();  // Crea un objeto Date con la fecha y hora actuales

        // Formatea la fecha y la hora en los formatos deseados
        const dia = ahora.getDate().toString().padStart(2, '0');
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const año = ahora.getFullYear();
        const hora = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');

        const tiempo = {
            fecha: `${año}-${mes}-${dia}`,  // Fecha en formato yyyy-mm-dd
            hora: `${hora}:${minutos}:${segundos}`  // Hora en formato hh:mm:ss
        };

        return tiempo;  // Devuelve la fecha y hora formateadas
    };

    // Función para verificar si hay un ID de caja en sessionStorage
    const verificarId = () => {
        const idcaja = sessionStorage.getItem('id');  // Obtiene el ID de la caja desde sessionStorage
        if (idcaja != null) {  // Si existe un ID de caja
            return false;  // Devuelve falso, indicando que ya hay un ID de caja
        } else {
            return true;  // Si no existe un ID, devuelve verdadero
        }
    };

    return (
        <>
            <Space>
                <Button disabled={verificarId()} type='primary' onClick={mostrarModalRetiroCaja}>Retirar dinero</Button>
                <Button disabled={verificarId()} type='primary' onClick={mostrarModalIngresoCaja}>Ingresar dinero</Button>
            </Space>


            {/* R E T I R O */}
            <Modal
                title="Retiro de caja"
                width={400}
                open={isModalVisibleR}
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
