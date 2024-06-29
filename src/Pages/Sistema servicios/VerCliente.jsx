import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Table, Checkbox, Space } from 'antd';
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './RegistrarCliente.css'

import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import BotonOrdenServicio from './RegistrarOrdenServicio.jsx';
import BotonEditarOrden from './EditarOrdenServicio.jsx'

const { Option } = Select;

const RegistrarOrdenServicio = ({ record }) => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { confirm } = Modal;
    const [dataFirebase, setDataFirebase] = useState([]);
    const [dataEmpleados, setDataEmpleados] = useState([]);
    const [dataOrdenServicio, setDataOrdenServicio] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [costoTotal, setCostoTotal] = useState(0);

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
            const docRef = await addDoc(collection(db, "ListaClientes"), {

                CodCliente: values.codCliente,
                NombreCliente: values.nombreCliente,
                CI: values.ci,
                TelefonCelular: values.telefono,
                Correo: values.correo,
                Estado: values.estado,
                Domicilio: values.domicilio,

                NombreDispositivo: values.nombreDispositivo,
                Modelo: values.modelo,
                Marca: values.marca,
                NumeroSerie: values.numeroSerie,
                FechaRecepcion: formatearFecha(values.fechaRecepcion.toDate()),
                DescripcionProblema: values.descripcionProblema,
                NotasAdicionales: values.notasAdicionales,
                OtrosDatos: values.otrosDatosRelevantes,
                Diagnostico: values.diagnostico,

                PendienteRepuestos: values.pendienteRepuestos,
                PendienteReparar: values.pendienteReparar,
                PendienteEntrega: values.pendienteEntrega,
                PendientePagar: values.pendientePagar,
                PendienteOtro: values.pendienteOtro,
            });
            //console.log("Document written with ID: ", docRef.id);
            ModalExito();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const columns = [
        {
            title: 'Codigo',
            dataIndex: 'CodOrden',
            defaultSortOrder: 'descend',
            width: '50px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Técnico encargado',
            dataIndex: 'TecnicoEncargado',
            defaultSortOrder: 'descend',
            width: '180px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha reparación',
            dataIndex: 'FechaReparacion',
            defaultSortOrder: 'descend',
            width: '120px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha entrega',
            dataIndex: 'FechaEntrega',
            defaultSortOrder: 'descend',
            width: '120px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Monto repuestos',
            dataIndex: 'MontoRepuestos',
            defaultSortOrder: 'descend',
            render: (text) => `Bs.  ${text}`,
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Monto servicio',
            dataIndex: 'MontoServicio',
            defaultSortOrder: 'descend',
            render: (text) => `Bs.  ${text}`,
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Space >
                    <Button onClick={() => showDetails(record)}>Mostrar</Button>
                    {/* <Button onClick={() => editRecord(record)}>Editar</Button> */}
                    <BotonEditarOrden nombre={record.NombreCliente} actualizar={recibirRespuesta} record={record} />
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear();

        return `${año}/${mes}/${dia}`;
    }

    const ModalExito = () => {
        Modal.success({
            title: 'Registro de cliente',
            content: 'Los datos del cliente se han guardado correctamente.',
            onOk: () => { navigate('/sistema-servicios/mostrar-tickets'); }
        });
    }

    const backList = () => {
        navigate('/sistema-servicios/mostra-tickets');
    }



    const showDetails = async (record) => {
        var DataOrdenRepuestos = [];

        try {
            const subcollectionRef = collection(db, `ListaOrdenServicio/${record.id}/ListaRepuestos`);
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            let repuestosList = [];
            subcollectionSnapshot.forEach(subDoc => {
                repuestosList.push({
                    idRepuesto: subDoc.id,
                    ...subDoc.data()
                });
            });
            DataOrdenRepuestos = repuestosList;
            // setDataOrdenRepuestos(repuestosList);
        } catch (error) {
            console.error("Error fetching subcollection data: ", error);
        }

        Modal.info({
            title: 'Detalles de la orden de servicio',
            width: 500,
            content: (
                <div>
                    {/* <img src={record.FotoEmpleado} alt="Empleado" style={{ width: '200px', marginLeft: '15%' }} /> */}
                    <p style={{ fontSize: "18px" }}><strong>Técnico encargado: </strong> {record.TecnicoEncargado}</p>
                    <p><strong>Código de orden:  </strong>{record.CodOrden}</p>
                    <p><strong>Fecha de recepción: </strong> {record.FechaReparacion}</p>
                    <p><strong>Fecha de entrega: </strong>{record.FechaEntrega}</p>
                    <p><strong>Garantía: </strong>{record.Garantia}</p>
                    <div>
                        {DataOrdenRepuestos.map(repuesto => (
                            <div key={repuesto.id}>
                                <p> --------------------------------------------------------------- </p>
                                <p><strong>Código de repuesto: </strong>{repuesto.CodRepuesto}</p>
                                <p><strong>Nombre del repuesto: </strong> {repuesto.NombreRepuesto}</p>
                                <p><strong>Precio: </strong> {repuesto.PrecioRepuesto} Bs.</p>
                                <p><strong>Cantidad: </strong> {repuesto.cantidadSeleccionada} unidades</p>
                            </div>
                        ))}
                    </div>
                    <p> --------------------------------------------------------------- </p>
                    <p><strong>Costo de repustos: </strong> {record.MontoRepuestos} Bs.</p>
                    <p><strong>Costo del servicio: </strong> {record.MontoServicio} Bs.</p>
                </div>
            ),
            onOk() { },
        });
    };

    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar esta orden de servicio?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                //console.log('Eliminar:', record);
                handleDelete(record.id);
            },
            onCancel() { },
        });
    };

    const handleDelete = async (id) => {
        try {
            const subcollectionRef = collection(db, `ListaOrdenServicio/${id}/ListaRepuestos`);
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            subcollectionSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                //console.log("Document deleted from subcollection ListaRepuestos");
            });

            const docRef = doc(db, "ListaOrdenServicio", id);
            await deleteDoc(docRef);
            //console.log("Document deleted from collection ListaOrdenServicio");

            actualizarListaOrdeServicio();

        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    const actualizarListaOrdeServicio = () => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            const filteredDataList = dataList.filter(item => item.NombreCliente === record.NombreCliente);

            setDataFirebase(filteredDataList);
        };
        fetchData();
    }

    const initialValues = {
        codCliente: record.CodCliente,
        nombreCliente: record.NombreCliente,
        ci: record.CI,
        telefono: record.TelefonoCelular,
        correo: record.Correo,
        estado: record.Estado,
        domicilio: record.Domicilio,

        nombreDispositivo: record.NombreDispositivo,
        modelo: record.Modelo,
        marca: record.Marca,
        numeroSerie: record.NumeroSerie,
        fechaRecepcion: dayjs(record.FechaRecepcion),
        descripcionProblema: record.DescripcionProblema,
        notasAdicionales: record.NotasAdicionales,
        otrosDatosRelevantes: record.OtrosDatos,
        diagnostico: record.Diagnostico,

        pendienteRepuestos: record.PendienteRepuestos,
        pendienteReparar: record.PendienteReparar,
        pendienteEntrega: record.PendienteEntrega,
        pendientePagar: record.PendientePagar,
        pendienteOtro: record.PendienteOtro,
    };

    const recibirRespuesta = (mensaje) => {
        setConfirmacion(mensaje);
    };

    const calcularTotal = () => {
        return dataFirebase.reduce((acc, item) => {
            const montoRepuesto = item.MontoRepuestos || 0; // Asignar 0 si es undefined o null
            const montoServicio = item.MontoServicio || 0; // Asignar 0 si es undefined o null
            return acc + montoRepuesto + montoServicio;
        }, 0);
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            const filteredDataList = dataList.filter(item => item.NombreCliente === record.NombreCliente);

            setDataFirebase(filteredDataList);
        };
        fetchData();
        // console.log("control");
        setConfirmacion("");
    }, [confimarcion]);

    return (
        <div>
            <Button onClick={showModal}>
                Mostrar
            </Button>
            <Modal
                title="Mostrar información del cliente"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Ok
                    </Button>,
                    // <Button key="submit" type="primary" onClick={handleOk}>
                    //     Registrar
                    // </Button>,
                ]}
                width={960}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 15 }}
                    onFinish={onFinish}
                    initialValues={initialValues}
                >
                    <div style={{ width: '100%', background: '#FFFFFF', border: '0px solid #000' }} className='parentRC'>
                        <div className='divRC1'>
                            <h3>Información del cliente</h3>
                        </div>

                        <div className='divRC23'></div>
                        <div className="divRC2">
                            <Form.Item
                                name="codCliente"
                                label="Código"
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="nombreCliente"
                                label="Nombre"
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="ci"
                                label="C.I."
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="telefono"
                                label="Teléfono/Celular"
                            >
                                <Input readOnly />
                            </Form.Item>
                        </div>

                        <div className="divRC3">

                            <Form.Item
                                name="correo"
                                label="Correo"
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="estado"
                                label="Estado"
                            >
                                <Select disabled>
                                    <Option value="Activo" >Activo</Option>
                                    <Option value="Inactivo">Inactivo</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="domicilio"
                                label="Domicilio"
                            >
                                <Input.TextArea rows={3} readOnly />
                            </Form.Item>
                        </div>

                        <div className='divRC4'>
                            <h3>Detalles del dispositivo a reparar</h3>
                        </div>
                        <div className='divRC56'></div>
                        <div className='divRC5'>
                            <Form.Item
                                name="nombreDispositivo"
                                label="Nombre de dispositivo"
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="modelo"
                                label="Modelo"
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="marca"
                                label="Marca"
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="numeroSerie"
                                label="Número de serie"
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="fechaRecepcion"
                                label="Fecha de recepción"
                            >
                                <DatePicker disabled format="YYYY-MM-DD" y />
                            </Form.Item>


                            <Form.Item
                                name="descripcionProblema"
                                label="Descripción del problema"
                            >
                                <Input.TextArea rows={3} readOnly />
                            </Form.Item>
                        </div>
                        <div className='divRC6'>
                            <Form.Item
                                name="notasAdicionales"
                                label="Notas adicionales"
                            >
                                <Input.TextArea rows={3} readOnly />
                            </Form.Item>

                            <Form.Item
                                name="otrosDatosRelevantes"
                                label="Otros datos relevantes"
                            >
                                <Input.TextArea rows={3} readOnly />
                            </Form.Item>

                            <Form.Item
                                name="diagnostico"
                                label="Diagnóstico"
                            >
                                <Input.TextArea rows={3} readOnly />
                            </Form.Item>
                        </div>

                        <div className='divRC7'>
                            <h3>Detalles de orden de servicio</h3>
                        </div>
                        <div className='divRC8'>
                            <BotonOrdenServicio nombre={record.NombreCliente} actualizar={recibirRespuesta} />
                            <Table
                                columns={columns}
                                dataSource={dataFirebase}
                                pagination={false}
                                onChange={onChange}
                                showSorterTooltip={{
                                    target: 'sorter-icon',
                                }}
                                scroll={{ x: true }}
                            />
                            <h3 style={{ textAlign: 'right', marginRight: '100px' }}>Costo total del servicio: {calcularTotal()} Bs.</h3>
                        </div>

                        <div className='divRC9'>
                            <h3>Estado de orden de servicio</h3>
                        </div>
                        <div className='divRC1011'></div>
                        <div className='divRC10'>
                            <Form.Item label="Pendiente repuestos" name="pendienteRepuestos" valuePropName="checked">
                                <Checkbox disabled />
                            </Form.Item>

                            <Form.Item label="Pendiente reparar" name="pendienteReparar" valuePropName="checked">
                                <Checkbox disabled />
                            </Form.Item>

                            <Form.Item label="Pendiente entrega" name="pendienteEntrega" valuePropName="checked">
                                <Checkbox disabled />
                            </Form.Item>
                        </div>
                        <div className='divRC11'>

                            <Form.Item label="Pendiente pagar" name="pendientePagar" valuePropName="checked">
                                <Checkbox disabled />
                            </Form.Item>

                            <Form.Item label="Pendiente otro" name="pendienteOtro" valuePropName="checked">
                                <Checkbox disabled />
                            </Form.Item>
                        </div>

                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default RegistrarOrdenServicio;
