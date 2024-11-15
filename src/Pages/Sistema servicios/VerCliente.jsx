import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Table, Checkbox, Space } from 'antd';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './RegistrarCliente.css'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import BotonOrdenServicio from './RegistrarOrdenServicio.jsx';
import BotonEditarOrden from './EditarOrdenServicio.jsx'


const RegistrarOrdenServicio = ({ record }) => {
    // Importación de componentes y hooks
    const { Option } = Select; // Desestructuración del componente Option del Select, usado para crear opciones dentro de un Select.
    const navigate = useNavigate(); // Hook de React Router para navegar entre diferentes rutas de la aplicación.
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal (ventana emergente).
    const [form] = Form.useForm(); // Hook de Ant Design para manejar el formulario y su validación.
    const { confirm } = Modal; // Desestructuración del método confirm de Modal, usado para mostrar confirmaciones de acción.
    const [dataFirebase, setDataFirebase] = useState([]); // Estado para almacenar los datos de Firebase (probablemente de una colección).
    const [confimarcion, setConfirmacion] = useState(""); // Estado para almacenar el mensaje de confirmación, probablemente usado para mostrar una notificación o un mensaje al usuario.
    // Definimos la información de la tabla
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
                    <BotonEditarOrden nombre={record.NombreCliente} actualizar={recibirRespuesta} record={record} />
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
    // useEffect se ejecuta al montar el componente o cuando cambia la dependencia 'confirmarcion'.
    useEffect(() => {
        // Función asincrónica para obtener los datos desde Firebase.
        const fetchData = async () => {
            // Obtener todos los documentos de la colección "ListaOrdenServicio" desde Firestore.
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));

            // Mapear los documentos obtenidos a un formato de datos con los campos de cada documento y su id.
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(), // Obtenemos los datos del documento.
                id: doc.id // Agregamos el id del documento a los datos.
            }));

            // Filtrar los datos para que solo incluyan aquellos que tienen el mismo 'NombreCliente' que el registro actual.
            const filteredDataList = dataList.filter(item => item.NombreCliente === record.NombreCliente);

            // Guardamos los datos filtrados en el estado de 'dataFirebase'.
            setDataFirebase(filteredDataList);
        };

        // Llamamos a la función asincrónica para cargar los datos.
        fetchData();

        // Limpiamos el estado de 'confirmacion' (probablemente se utiliza más tarde para mostrar un mensaje de confirmación).
        setConfirmacion("");
    }, [confimarcion]); // Este efecto se vuelve a ejecutar cuando la variable 'confimarcion' cambia.
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // Función que muestra el modal y resetea los campos del formulario.
    const showModal = () => {
        form.resetFields(); // Reseteamos los campos del formulario antes de abrir el modal.
        setIsModalVisible(true); // Abrimos el modal al cambiar el estado 'isModalVisible' a true.
    };

    // Función para cerrar el modal sin guardar cambios.
    const handleCancel = () => {
        setIsModalVisible(false); // Cerramos el modal al cambiar el estado 'isModalVisible' a false.
    };

    // Función que se ejecuta al finalizar el formulario con los valores proporcionados.
    const onFinish = async (values) => {
        try {
            // Agregamos un nuevo cliente a la colección "ListaClientes" de Firebase.
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
                FechaRecepcion: formatearFecha(values.fechaRecepcion.toDate()), // Formateamos la fecha a 'yyyy/MM/dd'.
                DescripcionProblema: values.descripcionProblema,
                NotasAdicionales: values.notasAdicionales,
                OtrosDatos: values.otrosDatosRelevantes,
                Diagnostico: values.diagnostico,
                // Información relacionada con el estado de la reparación.
                PendienteRepuestos: values.pendienteRepuestos,
                PendienteReparar: values.pendienteReparar,
                PendienteEntrega: values.pendienteEntrega,
                PendientePagar: values.pendientePagar,
                PendienteOtro: values.pendienteOtro,
            });

            // Mostramos un mensaje de éxito después de guardar los datos.
            ModalExito();
        } catch (error) {
            // En caso de error al agregar el documento, mostramos el error en la consola.
            console.error("Error adding document: ", error);
        }
    };

    // Función para formatear la fecha a un formato específico 'yyyy/MM/dd'.
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString); // Convertimos la fecha string a objeto Date.

        const dia = fecha.getDate().toString().padStart(2, '0'); // Formateamos el día.
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Formateamos el mes (sumamos 1 ya que JavaScript empieza desde 0 para los meses).
        const año = fecha.getFullYear(); // Obtenemos el año.

        return `${año}/${mes}/${dia}`; // Retornamos la fecha formateada en 'yyyy/MM/dd'.
    }

    // Función para mostrar un modal de éxito cuando los datos se han guardado correctamente.
    const ModalExito = () => {
        Modal.success({
            title: 'Registro de cliente',
            content: 'Los datos del cliente se han guardado correctamente.',
            // Al hacer clic en "OK", redirigimos a la página de mostrar tickets.
            onOk: () => { navigate('/sistema-servicios/mostrar-tickets'); }
        });
    }

    // Función que muestra los detalles de una orden de servicio al abrir un modal con la información.
    const showDetails = async (record) => {
        var DataOrdenRepuestos = []; // Variable para almacenar los repuestos de la orden.

        try {
            // Obtenemos la subcolección de repuestos de la orden de servicio.
            const subcollectionRef = collection(db, `ListaOrdenServicio/${record.id}/ListaRepuestos`);
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            // Creamos una lista de repuestos con los datos obtenidos de la subcolección.
            let repuestosList = [];
            subcollectionSnapshot.forEach(subDoc => {
                repuestosList.push({
                    idRepuesto: subDoc.id,
                    ...subDoc.data()
                });
            });
            DataOrdenRepuestos = repuestosList; // Asignamos la lista de repuestos a la variable.
        } catch (error) {
            console.error("Error fetching subcollection data: ", error); // Manejamos cualquier error al obtener los datos.
        }

        // Mostramos un modal con los detalles de la orden de servicio, incluyendo los repuestos.
        Modal.info({
            title: 'Detalles de la orden de servicio',
            width: 500,
            content: (
                <div>
                    <p style={{ fontSize: "18px" }}><strong>Técnico encargado: </strong> {record.TecnicoEncargado}</p>
                    <p><strong>Código de orden:  </strong>{record.CodOrden}</p>
                    <p><strong>Fecha de recepción: </strong> {record.FechaReparacion}</p>
                    <p><strong>Fecha de entrega: </strong>{record.FechaEntrega}</p>
                    <p><strong>Garantía: </strong> {record.Garantia}</p>
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
                    <p> .................................................. TOTAL ................................................ </p>
                    <p><strong>Costo de repustos: </strong> {record.MontoRepuestos} Bs.</p>
                    <p><strong>Costo del servicio: </strong> {record.MontoServicio} Bs.</p>
                </div>
            ),
            onOk() { }, // No se realiza ninguna acción cuando se cierra el modal.
        });
    };

    // Función que muestra una confirmación antes de eliminar una orden de servicio.
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar esta orden de servicio?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                handleDelete(record.id); // Si se confirma, se llama a la función para eliminar la orden.
            },
            onCancel() { },
        });
    };

    // Función para eliminar una orden de servicio y sus repuestos asociados.
    const handleDelete = async (id) => {
        try {
            // Obtenemos los repuestos asociados a la orden de servicio.
            const subcollectionRef = collection(db, `ListaOrdenServicio/${id}/ListaRepuestos`);
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const dataList = subcollectionSnapshot.docs.map(doc => ({
                ...doc.data(),
            }));

            // Actualizamos los repuestos antes de eliminar la orden.
            actualizarRepuestos(dataList);

            // Eliminamos todos los documentos de la subcolección de repuestos.
            subcollectionSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Eliminamos la orden de servicio de la colección principal.
            const docRef = doc(db, "ListaOrdenServicio", id);
            await deleteDoc(docRef);

            // Actualizamos la lista de órdenes de servicio después de eliminar la orden.
            actualizarListaOrdeServicio();
        } catch (error) {
            console.error("Error deleting document: ", error); // Manejamos cualquier error al eliminar la orden.
        }
    };

    // Función para manejar cambios en la tabla (por ejemplo, ordenación o filtrado).
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    // Función para actualizar la cantidad de repuestos después de eliminar una orden.
    const actualizarRepuestos = async (data) => {
        const promises = data.map(async (item) => {
            const productRef = doc(db, "ListaRepuestos", item.id);

            try {
                // Obtenemos el documento del repuesto para actualizar su cantidad.
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    const currentCantidad = productSnap.data().Cantidad || 0;
                    const newCantidad = currentCantidad + item.cantidadSeleccionada;

                    // Actualizamos la cantidad del repuesto en la base de datos.
                    await updateDoc(productRef, { Cantidad: newCantidad });
                } else {
                    console.log(`Producto con ID ${item.id} no encontrado.`);
                }
            } catch (error) {
                console.error(`Error al actualizar el producto con ID ${item.id}:`, error);
            }
        });

        try {
            // Esperamos a que todos los repuestos se actualicen.
            await Promise.all(promises);
            console.log('Todos los repuestos han sido actualizados.');
        } catch (error) {
            console.error('Error al actualizar los repuestos:', error);
        }
    };

    // Función para actualizar la lista de órdenes de servicio para un cliente específico.
    const actualizarListaOrdeServicio = () => {
        const fetchData = async () => {
            // Obtenemos todos los documentos de la colección "ListaOrdenServicio" de Firebase.
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));

            // Mapeamos los documentos obtenidos para extraer sus datos y agregar el ID de cada documento.
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            // Filtramos los documentos para solo incluir aquellos que pertenecen al cliente actual.
            const filteredDataList = dataList.filter(item => item.NombreCliente === record.NombreCliente);

            // Actualizamos el estado con la lista de datos filtrados.
            setDataFirebase(filteredDataList);
        };

        // Llamamos a la función para obtener y filtrar los datos.
        fetchData();
    };

    // Valores iniciales para un formulario con los datos de la orden de servicio y el cliente.
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
        fechaRecepcion: dayjs(record.FechaRecepcion), // Convertimos la fecha a un formato con dayjs
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

    // Función para recibir y mostrar un mensaje de confirmación.
    const recibirRespuesta = (mensaje) => {
        setConfirmacion(mensaje); // Establecemos el mensaje de confirmación en el estado.
    };

    // Función para calcular el total de la orden de servicio, sumando el costo de los repuestos y el servicio.
    const calcularTotal = () => {
        return dataFirebase.reduce((acc, item) => {
            // Obtenemos los montos de repuestos y servicio, asignando 0 si son undefined o null.
            const montoRepuesto = item.MontoRepuestos || 0;
            const montoServicio = item.MontoServicio || 0;

            // Sumamos los montos y los acumulamos en el acumulador (acc).
            return acc + montoRepuesto + montoServicio;
        }, 0); // Inicializamos el acumulador en 0.
    };
    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

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
