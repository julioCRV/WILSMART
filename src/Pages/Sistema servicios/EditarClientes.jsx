import React, { useEffect, useState } from 'react';
import { Form, Table, Input, Button, Checkbox, DatePicker, Select, Space, Modal, message } from 'antd';
import { doc, getDocs, deleteDoc, collection, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistrarCliente.css';
import BotonOrdenServicio from './RegistrarOrdenServicio.jsx';
import BotonEditarOrden from './EditarOrdenServicio.jsx'

const EditarCliente = () => {
    const { Option } = Select; // Define opciones para un menú desplegable de Ant Design.
    const { confirm } = Modal; // Permite mostrar un cuadro de diálogo de confirmación.
    const location = useLocation(); // Obtiene la ubicación actual en la app.
    const dataCliente = location.state && location.state.objetoProp; // Extrae datos pasados por navegación.
    const navigate = useNavigate(); // Habilita la navegación entre vistas.
    const [dataFirebase, setDataFirebase] = useState([]); // Almacena datos obtenidos de Firebase.
    const [confimarcion, setConfirmacion] = useState(""); // Maneja el estado de mensajes de confirmación.
    
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
                <Space>
                    <Button onClick={() => showDetails(record)}>Mostrar</Button>
                    {/* <Button onClick={() => editRecord(record)}>Editar</Button> */}
                    <BotonEditarOrden nombre={dataCliente.NombreCliente} actualizar={recibirRespuesta} record={record} />
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
    useEffect(() => {
        // Función para obtener datos de Firestore
        const fetchData = async () => {
            // Obtiene todos los documentos de la colección "ListaOrdenServicio"
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));
            // Mapea los documentos obtenidos para estructurar los datos
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(), // Obtiene los datos del documento
                id: doc.id     // Añade el ID del documento al objeto
            }));
            // Filtra la lista de datos según el nombre del cliente proporcionado
            const filteredDataList = dataList.filter(item => item.NombreCliente === dataCliente.NombreCliente);
            // Actualiza el estado con los datos filtrados
            setDataFirebase(filteredDataList);
        };

        // Llama a la función para obtener los datos
        fetchData();
        // Resetea el estado de confirmación
        setConfirmacion("");

        // Este efecto se ejecutará cada vez que cambie la variable "confirmacion"
    }, [confimarcion]);
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // Función que se ejecuta al finalizar el formulario
    const onFinish = async (values) => {
        // Muestra un mensaje de carga mientras se realiza la actualización
        const hide = message.loading('Editando la información del cliente...', 0);

        // Referencia al documento en la base de datos con el ID del cliente
        const docRef = doc(db, "ListaClientes", dataCliente.id);

        try {
            // Actualiza el documento en Firestore con los valores del formulario
            await updateDoc(docRef, {
                CodCliente: values.codCliente, // Código del cliente
                NombreCliente: values.nombreCliente, // Nombre completo
                CI: values.ci, // Carnet de identidad
                TelefonoCelular: values.telefono, // Número de teléfono
                Correo: values.correo, // Correo electrónico
                Estado: values.estado, // Estado actual del cliente
                Domicilio: values.domicilio, // Dirección del cliente

                // Información del dispositivo
                NombreDispositivo: values.nombreDispositivo,
                Modelo: values.modelo,
                Marca: values.marca,
                NumeroSerie: values.numeroSerie,
                FechaRecepcion: formatearFecha(values.fechaRecepcion.toDate()), // Fecha de recepción formateada
                DescripcionProblema: values.descripcionProblema, // Descripción del problema
                NotasAdicionales: values.notasAdicionales, // Notas adicionales
                OtrosDatos: values.otrosDatosRelevantes, // Información adicional
                Diagnostico: values.diagnostico, // Diagnóstico del dispositivo

                // Pendientes relacionados con el servicio
                PendienteRepuestos: values.pendienteRepuestos,
                PendienteReparar: values.pendienteReparar,
                PendienteEntrega: values.pendienteEntrega,
                PendientePagar: values.pendientePagar,
                PendienteOtro: values.pendienteOtro,
            });

            // Oculta el mensaje de carga
            hide();

            // Muestra un modal de éxito
            ModalExito();
        } catch (e) {
            // Oculta el mensaje de carga en caso de error
            hide();

            // Muestra el error en la consola
            console.error("Error updating document: ", e);
        }
    };

    // Función para formatear una fecha a un formato 'YYYY/MM/DD'
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        // Obtiene el día con ceros iniciales si es necesario
        const dia = fecha.getDate().toString().padStart(2, '0');
        // Obtiene el mes (sumando 1 porque los meses empiezan desde 0 en JavaScript)
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        // Obtiene el año
        const año = fecha.getFullYear();

        // Retorna la fecha en formato 'YYYY/MM/DD'
        return `${año}/${mes}/${dia}`;
    }

    // Función para mostrar un modal de éxito
    const ModalExito = () => {
        Modal.success({
            title: 'Actualización de información del cliente', // Título del modal
            content: 'Los datos del cliente se han actualizado correctamente.', // Mensaje del modal
            onOk: () => { navigate('/sistema-servicios/mostrar-clientes'); } // Redirige al listado de clientes al cerrar el modal
        });
    };

    // Función para navegar a la lista de clientes
    const backList = () => {
        navigate('/sistema-servicios/mostrar-clientes'); // Redirige a la ruta correspondiente
    }

    // Función para mostrar los detalles de una orden de servicio
    const showDetails = async (record) => {
        var DataOrdenRepuestos = []; // Array para almacenar los datos de los repuestos de la orden

        try {
            // Referencia a la subcolección "ListaRepuestos" dentro de la orden de servicio específica
            const subcollectionRef = collection(db, `ListaOrdenServicio/${record.id}/ListaRepuestos`);
            // Obtiene los documentos de la subcolección
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            let repuestosList = []; // Array temporal para almacenar los datos de los repuestos
            // Itera sobre los documentos de la subcolección y los añade al array
            subcollectionSnapshot.forEach(subDoc => {
                repuestosList.push({
                    idRepuesto: subDoc.id, // ID único del repuesto
                    ...subDoc.data()       // Datos del repuesto
                });
            });
            DataOrdenRepuestos = repuestosList; // Asigna los datos al array principal
            // Si deseas actualizar el estado, puedes usar setDataOrdenRepuestos(repuestosList);
        } catch (error) {
            console.error("Error fetching subcollection data: ", error); // Maneja errores al obtener los datos
        }

        // Muestra un modal con los detalles de la orden de servicio
        Modal.info({
            title: 'Detalles de la orden de servicio', // Título del modal
            width: 500, // Ancho del modal
            content: (
                <div>
                    {/* Información general del técnico y de la orden */}
                    <p style={{ fontSize: "18px" }}><strong>Técnico encargado: </strong> {record.TecnicoEncargado}</p>
                    <p><strong>Código de orden: </strong>{record.CodOrden}</p>
                    <p><strong>Fecha de recepción: </strong>{record.FechaReparacion}</p>
                    <p><strong>Fecha de entrega: </strong>{record.FechaEntrega}</p>
                    <p><strong>Garantía: </strong>{record.Garantia}</p>

                    {/* Listado de repuestos asociados a la orden */}
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

                    {/* Información adicional sobre costos */}
                    <p> --------------------------------------------------------------- </p>
                    <p><strong>Costo de repuestos: </strong> {record.MontoRepuestos} Bs.</p>
                    <p><strong>Costo del servicio: </strong> {record.MontoServicio} Bs.</p>
                </div>
            ),
            onOk() { }, // Acción al presionar "OK" en el modal
        });
    };

    // Función para confirmar la eliminación de una orden de servicio
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar esta orden de servicio?', // Título del mensaje de confirmación
            content: 'Esta acción no se puede deshacer.', // Contenido del mensaje de confirmación
            okText: 'Eliminar', // Texto del botón para confirmar
            okType: 'danger', // Tipo de estilo del botón para confirmar
            cancelText: 'Cancelar', // Texto del botón para cancelar
            onOk() {
                handleDelete(record.id); // Llama a la función para eliminar la orden si se confirma
            },
            onCancel() { }, // Acción al cancelar
        });
    };

    // Función para manejar la eliminación de una orden de servicio y sus repuestos asociados
    const handleDelete = async (id) => {
        try {
            // Referencia a la subcolección "ListaRepuestos" dentro de la orden de servicio especificada
            const subcollectionRef = collection(db, `ListaOrdenServicio/${id}/ListaRepuestos`);
            // Obtiene los documentos de la subcolección
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            // Extrae los datos de los documentos de la subcolección en un array
            const dataList = subcollectionSnapshot.docs.map(doc => ({
                ...doc.data(), // Obtiene los datos del documento
            }));

            // Actualiza los repuestos de la lista principal con base en los datos extraídos
            actualizarRepuestos(dataList);

            // Elimina cada documento de la subcolección
            subcollectionSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref); // Elimina el documento específico
            });

            // Referencia al documento principal en "ListaOrdenServicio"
            const docRef = doc(db, "ListaOrdenServicio", id);
            await deleteDoc(docRef); // Elimina el documento principal

            // Llama a la función para actualizar la lista de órdenes de servicio en la interfaz
            actualizarListaOrdeServicio();
        } catch (error) {
            console.error("Error deleting document: ", error); // Maneja errores en la operación
        }
    };

    // Función que se ejecuta al interactuar con los elementos de la tabla (paginación, filtros, etc.)
    const onChange = (pagination, filters, sorter, extra) => {
        // Puede usarse para manejar cambios en los parámetros de la tabla
        // console.log('params', pagination, filters, sorter, extra);
    };

    // Función para actualizar la cantidad de repuestos en la lista general
    const actualizarRepuestos = async (data) => {
        // Mapea los datos y crea una lista de promesas para actualizar los repuestos
        const promises = data.map(async (item) => {
            const productRef = doc(db, "ListaRepuestos", item.id); // Referencia al documento del repuesto

            try {
                // Obtiene el documento del repuesto
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    // Si el documento existe, actualiza la cantidad
                    const currentCantidad = productSnap.data().Cantidad || 0; // Cantidad actual o 0 por defecto
                    const newCantidad = currentCantidad + item.cantidadSeleccionada; // Suma la cantidad seleccionada

                    await updateDoc(productRef, { Cantidad: newCantidad }); // Actualiza la cantidad en Firestore
                } else {
                    console.log(`Producto con ID ${item.id} no encontrado.`);
                }
            } catch (error) {
                console.error(`Error al actualizar el producto con ID ${item.id}:`, error); // Maneja errores al actualizar
            }
        });

        try {
            // Espera a que todas las promesas se completen
            await Promise.all(promises);
            console.log('Todos los repuestos han sido actualizados.');
        } catch (error) {
            console.error('Error al actualizar los repuestos:', error); // Maneja errores en el proceso
        }
    };

    // Función para actualizar la lista de órdenes de servicio
    const actualizarListaOrdeServicio = () => {
        // Función asíncrona para obtener los datos de la colección "ListaOrdenServicio" desde Firestore
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio")); // Obtiene todos los documentos de la colección
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(), // Obtiene los datos del documento
                id: doc.id // Añade el ID del documento como parte de los datos
            }));

            // Filtra los datos para incluir solo los que coinciden con el nombre del cliente actual
            const filteredDataList = dataList.filter(item => item.NombreCliente === dataCliente.NombreCliente);

            // Actualiza el estado con los datos filtrados
            setDataFirebase(filteredDataList);
        };

        // Llama a la función para obtener y procesar los datos
        fetchData();
    };

    // Función para manejar la recepción de una respuesta y actualizar el estado de confirmación
    const recibirRespuesta = (mensaje) => {
        setConfirmacion(mensaje); // Actualiza el estado "confirmacion" con el mensaje recibido
    };

    // Función para calcular el total de los montos (repuestos + servicio) en la lista de órdenes
    const calcularTotal = () => {
        // Usa el método `reduce` para iterar sobre los datos de Firebase y calcular el total
        return dataFirebase.reduce((acc, item) => {
            // Obtiene los montos de repuestos y servicio, asignando 0 si están indefinidos o nulos
            const montoRepuesto = item.MontoRepuestos || 0;
            const montoServicio = item.MontoServicio || 0;

            // Suma los montos al acumulador
            return acc + montoRepuesto + montoServicio;
        }, 0); // Inicializa el acumulador en 0
    };
    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    // Objeto que define los valores iniciales de los campos del formulario
    const initialValues = {
        codCliente: dataCliente.CodCliente,
        nombreCliente: dataCliente.NombreCliente,
        ci: dataCliente.CI,
        telefono: dataCliente.TelefonoCelular,
        correo: dataCliente.Correo,
        estado: dataCliente.Estado,
        domicilio: dataCliente.Domicilio,

        nombreDispositivo: dataCliente.NombreDispositivo,
        modelo: dataCliente.Modelo,
        marca: dataCliente.Marca,
        numeroSerie: dataCliente.NumeroSerie,
        fechaRecepcion: dayjs(dataCliente.FechaRecepcion),
        descripcionProblema: dataCliente.DescripcionProblema,
        notasAdicionales: dataCliente.NotasAdicionales,
        otrosDatosRelevantes: dataCliente.OtrosDatos,
        diagnostico: dataCliente.Diagnostico,

        pendienteRepuestos: dataCliente.PendienteRepuestos,
        pendienteReparar: dataCliente.PendienteReparar,
        pendienteEntrega: dataCliente.PendienteEntrega,
        pendientePagar: dataCliente.PendientePagar,
        pendienteOtro: dataCliente.PendienteOtro,
    };

    return (
        <div >
            <h2 className="form-title">Ediar información de cliente</h2>

            <Form
                name="editar_producto"
                layout="horizontal"
                initialValues={initialValues}
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
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
                        <BotonOrdenServicio nombre={dataCliente.NombreCliente} actualizar={recibirRespuesta} />
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
                                    Actualizar
                                </Button>
                            </Form.Item>
                        </div>
                    </div>

                </div>
            </Form >
        </div >
    );
};

export default EditarCliente;
