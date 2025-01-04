import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Select, Modal, message } from 'antd';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './RegistrarClienteNuevo.css';

const RegistrarCliente = () => {
    // Desestructuración de Option de Select (de Ant Design) y creación de la variable para la navegación.
    const { Option } = Select;
    const navigate = useNavigate();

    // Función que se ejecuta cuando el formulario se envía correctamente.
    const onFinish = async (values) => {
        // Muestra un mensaje de carga mientras se registra el cliente.
        const hide = message.loading('Registrando cliente...', 0);

        try {
            // Se agrega un nuevo documento a la colección "ListaClientes" con los valores del formulario.
            const docRef = await addDoc(collection(db, "ListaClientes"), {
                CodCliente: values.codCliente,
                NombreCliente: values.nombreCliente,
                CI: values.ci,
                TelefonoCelular: values.telefono,
                Correo: values.correo,
                Estado: values.estado,
                Domicilio: values.domicilio,

                NombreDispositivo: values.nombreDispositivo,
                Modelo: values.modelo,
                Marca: values.marca,
                NumeroSerie: values.numeroSerie,
                FechaRecepcion: formatearFecha(values.fechaRecepcion.toDate()), // Se formatea la fecha antes de guardarla.
                DescripcionProblema: values.descripcionProblema,
                NotasAdicionales: values.notasAdicionales,
                OtrosDatos: values.otrosDatosRelevantes,
                Diagnostico: values.diagnostico,

                PendienteRepuestos: values.pendienteRepuestos,
                PendienteReparar: values.pendienteReparar,
                PendienteEntrega: values.pendienteEntrega,
                PendientePagar: values.pendientePagar,
                PendienteOtro: values.pendienteOtro,

                IdCliente: values.codCliente // Se asegura que el codCliente también esté en IdCliente.
            });
            hide(); // Se oculta el mensaje de carga.
            ModalExito(); // Muestra el modal de éxito después de guardar los datos.
        } catch (error) {
            console.error("Error adding document: ", error); // Manejo de errores si la operación falla.
        }
    };

    // Función que se ejecuta si el formulario no se envía correctamente.
    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.'); // Muestra un mensaje de error.
    };

    // Función para formatear la fecha a formato "YYYY-MM-DD".
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString); // Se convierte el string de fecha en objeto Date.

        const dia = fecha.getDate().toString().padStart(2, '0'); // Se obtiene el día y se asegura que tenga 2 dígitos.
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Se obtiene el mes (sumando 1 porque los meses empiezan desde 0).
        const año = fecha.getFullYear(); // Se obtiene el año.

        return `${año}-${mes}-${dia}`; // Se devuelve la fecha en formato "YYYY-MM-DD".
    }

    // Función que muestra un modal de éxito cuando los datos se guardan correctamente.
    const ModalExito = () => {
        Modal.success({
            title: 'Registro de cliente', // Título del modal.
            content: 'Los datos del cliente se han guardado correctamente.', // Contenido del modal.
            onOk: () => { navigate('/sistema-servicios/mostrar-clientes'); } // Redirige al usuario a otra vista después de cerrar el modal.
        });
    }

    // Función para volver a la lista de tickets cuando se presiona el botón de retroceso.
    const backList = () => {
        navigate('/sistema-servicios/mostrar-tickets'); // Redirige a la lista de tickets.
    }

    // Valores iniciales del formulario.
    const initialValues = {
        correo: ' ', // Inicializa los campos del formulario con valores vacíos.
        estado: 'Activo', // Por defecto, el estado del cliente es 'Activo'.

        otrosDatosRelevantes: ' ', // Valor por defecto para otros datos relevantes.
        diagnostico: ' ', // Valor por defecto para diagnóstico.
        notasAdicionales: ' ', // Valor por defecto para notas adicionales.

        pendienteRepuestos: false, // Inicializa los campos de pendientes en falso.
        pendienteReparar: false,
        pendienteEntrega: false,
        pendientePagar: false,
        pendienteOtro: false,
    };

    return (
        <div >
            <h2 className="form-title">Registrar cliente</h2>

            <Form
                name="editar_producto"
                layout="horizontal"
                initialValues={initialValues}
                labelCol={{
                    xs: { span: 24 },  // En pantallas pequeñas (ocupa toda la fila)
                    sm: { span: 10 },   // En pantallas medianas (8 columnas para etiquetas)
                    md: { span: 24 },   // En pantallas grandes (ocupa toda la fila para etiquetas)
                    lg: { span: 24 },   // En pantallas extra grandes (ocupa toda la fila para etiquetas)
                    xl: { span: 10 },   // En pantallas extra grandes (8 columnas para etiquetas)
                }}

                wrapperCol={{
                    xs: { span: 24 },  // En pantallas pequeñas (ocupa toda la fila para campos)
                    sm: { span: 14 },  // En pantallas medianas (10 columnas para campos)
                    md: { span: 24 },  // En pantallas grandes (ocupa toda la fila para campos)
                    lg: { span: 24 },  // En pantallas extra grandes (ocupa toda la fila para campos)
                    xl: { span: 14 },  // En pantallas extra grandes (10 columnas para campos)
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <div className='parentRCN'>
                    <div className='divRCN1'>
                        <h3>Información del cliente</h3>
                    </div>

                    <div className='divRCN23'></div>
                    <div className="divRCN2">
                        <Form.Item
                            name="codCliente"
                            label="Código"
                            rules={[{ required: true, message: 'Por favor ingrese un código' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="nombreCliente"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor ingrese el nombre del cliente' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="ci"
                            label="C.I."
                            rules={[{ required: true, message: 'Por favor ingrese el C.I.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="telefono"
                            label="Teléfono/Celular"
                            rules={[{ required: true, message: 'Por favor ingrese el teléfono o celular' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="divRCN3">

                        <Form.Item
                            name="correo"
                            label="Correo"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
                        >
                            <Select>
                                <Option value="Activo">Activo</Option>
                                <Option value="Inactivo">Inactivo</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="domicilio"
                            label="Domicilio"
                            rules={[{ required: true, message: 'Por favor ingrese el domicilio' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </div>

                    <div className='divRCN4'>
                        <h3>Detalles del dispositivo a reparar</h3>
                    </div>
                    <div className='divRCN56'></div>
                    <div className='divRCN5'>
                        <Form.Item
                            name="nombreDispositivo"
                            label="Nombre de dispositivo"
                            rules={[{ required: true, message: 'Por favor ingrese el nombre del dispositivo' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="modelo"
                            label="Modelo"
                            rules={[{ required: true, message: 'Por favor ingrese el modelo' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="marca"
                            label="Marca"
                            rules={[{ required: true, message: 'Por favor ingrese la marca' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="numeroSerie"
                            label="Número de serie"
                            rules={[{ required: true, message: 'Por favor ingrese el número de serie' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="fechaRecepcion"
                            label="Fecha de recepción"
                            rules={[{ required: true, message: 'Por favor ingrese la fecha de recepción' }]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>


                        <Form.Item
                            name="descripcionProblema"
                            label="Descripción del problema"
                            rules={[{ required: true, message: 'Por favor ingrese la descripción del problema' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </div>
                    <div className='divRCN6'>
                        <Form.Item
                            name="notasAdicionales"
                            label="Notas adicionales"
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        <Form.Item
                            name="otrosDatosRelevantes"
                            label="Otros datos relevantes"
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        <Form.Item
                            name="diagnostico"
                            label="Diagnóstico"
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </div>
                    <div className='divRCN7'>
                        <h3>Estado de orden de servicio</h3>
                    </div>
                    <div className='divRCN89'></div>
                    <div className='divRCN8'>
                        <Form.Item label="Pendiente repuestos" name="pendienteRepuestos" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>

                        <Form.Item label="Pendiente reparar" name="pendienteReparar" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>

                        <Form.Item label="Pendiente entrega" name="pendienteEntrega" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                    </div>
                    <div className='divRCN9'>

                        <Form.Item label="Pendiente pagar" name="pendientePagar" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>

                        <Form.Item label="Pendiente otro" name="pendienteOtro" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                    </div>

                    <div className='divRCN12'>
                        <div className="button-container">
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="default" htmlType="button" onClick={backList}>
                                    Cancelar
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="primary" htmlType="submit">
                                    Registrar
                                </Button>
                            </Form.Item>
                        </div>
                    </div>

                </div>
            </Form >
        </div >
    );
};

export default RegistrarCliente;
