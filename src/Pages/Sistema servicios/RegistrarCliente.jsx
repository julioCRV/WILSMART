import React, { useEffect, useState } from 'react';
import { Form, Table, Input, Button, Checkbox, DatePicker, Select, Space, Modal, message } from 'antd';
import { doc, addDoc, getDocs, deleteDoc, collection, updateDoc,getDoc } from "firebase/firestore";
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistrarCliente.css';
import BotonOrdenServicio from './RegistrarOrdenServicio.jsx';
import BotonEditarOrden from './EditarOrdenServicio.jsx'

const { Option } = Select;

const RegistrarCliente = () => {
    const { confirm } = Modal;
    const location = useLocation();
    const dataTicket = location.state && location.state.objetoProp;
    const numeroCli = location.state && location.state.numeroCliente;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);
    const [confimarcion, setConfirmacion] = useState("");

    const onFinish = async (values) => {
        const hide = message.loading('Registrando cliente...', 0);
        //console.log(values);
        try {
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

                IdCliente: dataTicket.id
            });
            //console.log("Document written with ID: ", docRef.id);
            hide();
            ModalExito();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.');
    };

    const columns = [
        {
            title: 'Codigo',
            dataIndex: 'CodOrden',
            defaultSortOrder: 'descend',
            width: '80px'
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
                <Space>
                    <Button onClick={() => showDetails(record)}>Mostrar</Button>
                    {/* <Button onClick={() => editRecord(record)}>Editar</Button> */}
                    <BotonEditarOrden nombre={dataTicket.NombreCliente} actualizar={recibirRespuesta} record={record} />
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

        return `${año}-${mes}-${dia}`;
    }

    const ModalExito = () => {
        Modal.success({
            title: 'Registro de cliente',
            content: 'Los datos del cliente se han guardado correctamente.',
            onOk: () => { navigate('/sistema-servicios/mostrar-tickets'); }
        });
    }

    const backList = () => {
        navigate('/sistema-servicios/mostrar-tickets');
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
                    <p></p>
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
            const dataList = subcollectionSnapshot.docs.map(doc => ({
                ...doc.data(),
            }));
            actualizarRepuestos(dataList);
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

    const actualizarRepuestos = async (data) => {
        const promises = data.map(async (item) => {
            const productRef = doc(db, "ListaRepuestos", item.id);

            try {
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    const currentCantidad = productSnap.data().Cantidad || 0;
                    const newCantidad = currentCantidad + item.cantidadSeleccionada;

                    await updateDoc(productRef, { Cantidad: newCantidad });
                } else {
                    console.log(`Producto con ID ${item.id} no encontrado.`);
                }
            } catch (error) {
                console.error(`Error al actualizar el producto con ID ${item.id}:`, error);
            }
        });
        try {
            await Promise.all(promises);
            console.log('Todos los repuestos han sido actualizados.');
        } catch (error) {
            console.error('Error al actualizar los repuestos:', error);
        }
    };

    const actualizarListaOrdeServicio = () => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            const filteredDataList = dataList.filter(item => item.NombreCliente === dataTicket.NombreCliente);

            setDataFirebase(filteredDataList);
        };
        fetchData();
    }

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
            const filteredDataList = dataList.filter(item => item.NombreCliente === dataTicket.NombreCliente);

            setDataFirebase(filteredDataList);

        };

        fetchData();
        // console.log("control");
        setConfirmacion("");
    }, [confimarcion]);

    const initialValues = {
        codCliente: numeroCli,
        // nombreCliente: 'Juan Pérez',
        // ci: '12345678',
        // telefono: '0987654321',
        correo: '',
        estado: 'Activo',
        // domicilio: 'Calle Falsa 123',

        // nombreDispositivo: 'Laptop',
        // modelo: 'XPS 13',
        // marca: 'Dell',
        // numeroSerie: '12345ABC',
        // fechaRecepcion: dayjs('2023-06-01'),
        // descripcionProblema: 'Pantalla no enciende',
        // notasAdicionales: 'Cliente mencionó que ocurrió después de una actualización',
        // otrosDatosRelevantes: 'Se intentó reiniciar varias veces',
        // diagnostico: 'Pendiente',

        // notasAdicionales: ' ',   
        otrosDatosRelevantes: ' ',
        diagnostico: ' ',

        pendienteRepuestos: false,
        pendienteReparar: false,
        pendienteEntrega: false,
        pendientePagar: false,
        pendienteOtro: false,

        ci: dataTicket.CI,
        descripcionProblema: dataTicket.DescripcionProblema,
        fechaRecepcion: dayjs(dataTicket.FechaIngreso),
        nombreCliente: dataTicket.NombreCliente,
        nombreDispositivo: dataTicket.NombreDispositivo,
        notasAdicionales: dataTicket.NotasAdicionales,
        telefono: dataTicket.TelefonoCelular,
    };

    return (
        <div >
            <h2 className="form-title">Registrar cliente</h2>

            <Form
                name="editar_producto"
                layout="horizontal"
                initialValues={initialValues}
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            // className="form-columns"
            >
                <div className='parentRC'>
                    <div className='divRC1'>
                        <h3>Información del cliente</h3>
                    </div>

                    <div className='divRC23'></div>
                    <div className="divRC2">
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

                    <div className="divRC3">

                        <Form.Item
                            name="correo"
                            label="Correo"
                        // rules={[
                        //     { required: true, message: 'Por favor ingrese el correo electrónico' },
                        //     { type: 'email', message: 'El correo no es válido' }
                        // ]}
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

                    <div className='divRC4'>
                        <h3>Detalles del dispositivo a reparar</h3>
                    </div>
                    <div className='divRC56'></div>
                    <div className='divRC5'>
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
                    <div className='divRC6'>
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

                    <div className='divRC7'>
                        <h3>Detalles de orden de servicio</h3>
                    </div>
                    <div className='divRC8'>
                        <BotonOrdenServicio nombre={dataTicket.NombreCliente} actualizar={recibirRespuesta} />
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
                            <Checkbox />
                        </Form.Item>

                        <Form.Item label="Pendiente reparar" name="pendienteReparar" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>

                        <Form.Item label="Pendiente entrega" name="pendienteEntrega" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                    </div>
                    <div className='divRC11'>

                        <Form.Item label="Pendiente pagar" name="pendientePagar" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>

                        <Form.Item label="Pendiente otro" name="pendienteOtro" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                    </div>

                    <div className='divRC12'>
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
