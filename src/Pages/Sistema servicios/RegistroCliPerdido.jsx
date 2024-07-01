import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Table, Checkbox, Space } from 'antd';
import { collection, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './RegistrarOrdenServicio.css';

import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import BotonOrdenServicio from './RegistrarOrdenServicio.jsx';
import BotonEditarOrden from './EditarOrdenServicio.jsx'

const { Option } = Select;

const RegistrarOrdenServicio = ({ record, disabled }) => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { confirm } = Modal;

    const [confimarcion, setConfirmacion] = useState("");

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        form.submit();
    };

    const onFinish = async (values) => {
        try {
            const docRef = doc(db, "ListaClientesPerdidos", record.id);
            await setDoc(docRef, {
                CodCliente: record.CodCliente,
                NombreCliente: values.nombreCliente,
                NombreDispositivo: record.NombreDispositivo,
                Fecha: formatearFecha(values.fecha.toDate()),
                Motivo: values.motivo,
            });

            //console.log("Document written with custom ID: ", record.id);

            const docRef2 = doc(db, "ListaClientes", record.id);
            try {
                await updateDoc(docRef2, {
                    Estado: "Inactivo",
                });
                //console.log("Document updated");
                ModalExito();
            } catch (e) {
                console.error("Error updating document: ", e);
            }
        } catch (error) {
            console.error("Error adding document: ", error);
        }


    };

    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.');
    };

    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear();

        return `${año}/${mes}/${dia}`;
    }

    const ModalExito = () => {
        Modal.success({
            title: 'Registro de cliente perdido',
            content: 'Los datos del cliente perdido se han guardado correctamente.',
            onOk: () => { handleCancel() }
        });
    }

    const initialValues = {
        // codCliente: record.CodCliente,
        nombreCliente: record.NombreCliente,
        // ci: record.CI,
        // telefono: record.TelefonoCelular,
        // correo: record.Correo,
        // estado: record.Estado,
        // domicilio: record.Domicilio,

        // nombreDispositivo: record.NombreDispositivo,
        // modelo: record.Modelo,
        // marca: record.Marca,
        // numeroSerie: record.NumeroSerie,
        // fechaRecepcion: dayjs(record.FechaRecepcion),
        // descripcionProblema: record.DescripcionProblema,
        // notasAdicionales: record.NotasAdicionales,
        // otrosDatosRelevantes: record.OtrosDatos,
        // diagnostico: record.Diagnostico,

        // pendienteRepuestos: record.PendienteRepuestos,
        // pendienteReparar: record.PendienteReparar,
        // pendienteEntrega: record.PendienteEntrega,
        // pendientePagar: record.PendientePagar,
        // pendienteOtro: record.PendienteOtro,
    };

    const recibirRespuesta = (mensaje) => {
        setConfirmacion(mensaje);
    };



    // useEffect(() => {
    //     const fetchData = async () => {
    //         const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));
    //         const dataList = querySnapshot.docs.map(doc => ({
    //             ...doc.data(),
    //             id: doc.id
    //         }));
    //         const filteredDataList = dataList.filter(item => item.NombreCliente === record.NombreCliente);

    //         setDataFirebase(filteredDataList);
    //     };
    //     fetchData();
    //     // console.log("control");
    //     setConfirmacion("");
    // }, [confimarcion]);

    return (
        <div>
            <Button onClick={showModal} disabled={disabled}>
                Registrar
            </Button>
            <Modal
                title="Registro de cliente perdido"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Registrar
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialValues}
                >
                    <div className='parentOS'>
                        <div className='divOS1'>
                            <Form.Item
                                name="nombreCliente"
                                label="Nombre"
                                rules={[{ required: true, message: 'Por favor ingrese un nombre' }]}
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="fecha"
                                label="Fecha"
                                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" y />
                            </Form.Item>


                            <Form.Item
                                name="motivo"
                                label="Motivo"
                                rules={[{ required: true, message: 'Por favor ingrese un motivo de la perdidad del cliente' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default RegistrarOrdenServicio;
