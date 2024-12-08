import React, { useEffect, useState } from 'react';
import { Form, Table, Input, Button, Checkbox, DatePicker, Select, Space, Modal, message } from 'antd';
import { doc, addDoc, getDocs, deleteDoc, collection, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistrarCliente.css';
import BotonOrdenServicio from './RegistrarOrdenServicio.jsx';
import BotonEditarOrden from './EditarOrdenServicio.jsx'

const { Option } = Select;

const RegistrarCliente = () => {
    // Modal de confirmación de Ant Design
    const { confirm } = Modal;
    // useLocation para obtener el estado pasado a través de la navegación (location)
    const location = useLocation();
    // Obteniendo 'objetoProp' y 'numeroCliente' del estado pasado a través de la navegación
    const dataTicket = location.state && location.state.objetoProp; // El objeto 'dataTicket' contiene los datos del ticket
    const numeroCli = location.state && location.state.numeroCliente; // El 'numeroCli' obtiene el número de cliente
    // Función 'useNavigate' de React Router para realizar navegación programática
    const navigate = useNavigate();
    // Estado para almacenar los datos obtenidos de Firebase
    const [dataFirebase, setDataFirebase] = useState([]);
    // Estado para almacenar la confirmación o cualquier mensaje relacionado con la operación
    const [confimarcion, setConfirmacion] = useState(""); // Este estado se usa para mostrar una confirmación (vacío en este caso)
    // Definición de las columnas para la tabla
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
                    <BotonEditarOrden nombre={dataTicket.NombreCliente} actualizar={recibirRespuesta} record={record} />
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
    // useEffect para cargar los datos de la colección 'ListaOrdenServicio' desde Firebase, filtrados por el nombre del cliente
    useEffect(() => {
        // Función para obtener los datos de la colección 'ListaOrdenServicio'
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio")); // Obtiene los documentos de la colección 'ListaOrdenServicio'
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(), // Extrae los datos de cada documento
                id: doc.id // Añade el ID del documento
            }));

            // Filtra los datos para obtener solo aquellos cuyo nombre del cliente coincida con el nombre en 'dataTicket'
            const filteredDataList = dataList.filter(item => item.NombreCliente === dataTicket.NombreCliente);

            setDataFirebase(filteredDataList); // Actualiza el estado con la lista de órdenes filtradas
        };

        fetchData(); // Llama a la función para cargar los datos filtrados
        setConfirmacion(""); // Resetea la confirmación a una cadena vacía

    }, [confimarcion]); // Dependencia de 'confimarcion' para ejecutar nuevamente el efecto cuando cambie
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // Función 'onFinish' que se ejecuta cuando el formulario se envía correctamente
    const onFinish = async (values) => {
        // Muestra un mensaje de carga mientras se realiza la operación de registro
        const hide = message.loading('Registrando cliente...', 0);

        try {
            // Se agrega un nuevo documento a la colección 'ListaClientes' en Firebase
            const docRef = await addDoc(collection(db, "ListaClientes"), {
                CodCliente: values.codCliente,           // Código del cliente
                NombreCliente: values.nombreCliente,     // Nombre del cliente
                CI: values.ci,                           // Cédula de identidad
                TelefonoCelular: values.telefono,        // Teléfono celular
                Correo: values.correo,                   // Correo electrónico
                Estado: values.estado,                   // Estado del cliente (activo, inactivo, etc.)
                Domicilio: values.domicilio,             // Domicilio del cliente

                NombreDispositivo: values.nombreDispositivo, // Nombre del dispositivo
                Modelo: values.modelo,                    // Modelo del dispositivo
                Marca: values.marca,                      // Marca del dispositivo
                NumeroSerie: values.numeroSerie,          // Número de serie del dispositivo
                FechaRecepcion: formatearFecha(values.fechaRecepcion.toDate()), // Fecha de recepción del dispositivo
                DescripcionProblema: values.descripcionProblema, // Descripción del problema
                NotasAdicionales: values.notasAdicionales,   // Notas adicionales
                OtrosDatos: values.otrosDatosRelevantes,      // Otros datos relevantes
                Diagnostico: values.diagnostico,             // Diagnóstico del dispositivo

                PendienteRepuestos: values.pendienteRepuestos,  // Repuestos pendientes
                PendienteReparar: values.pendienteReparar,      // Reparaciones pendientes
                PendienteEntrega: values.pendienteEntrega,      // Entrega pendiente
                PendientePagar: values.pendientePagar,          // Pago pendiente
                PendienteOtro: values.pendienteOtro,            // Otros pendientes

                IdCliente: dataTicket.id // ID del cliente relacionado con el ticket
            });
            // Oculta el mensaje de carga
            hide();
            // Muestra el modal de éxito
            ModalExito();
        } catch (error) {
            console.error("Error adding document: ", error); // En caso de error, se muestra en la consola
        }
    };

    // Función que se ejecuta si el formulario no se envía correctamente
    const onFinishFailed = () => {
        // Muestra un mensaje de error si el formulario no es válido
        message.error('Por favor complete el formulario correctamente.');
    };

    // Función para formatear la fecha en el formato 'yyyy-mm-dd'
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        const dia = fecha.getDate().toString().padStart(2, '0'); // Asegura que el día sea de dos dígitos
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses son base 0, por lo que sumamos 1
        const año = fecha.getFullYear(); // Año en formato completo

        return `${año}-${mes}-${dia}`; // Retorna la fecha en formato 'yyyy-mm-dd'
    }

    // Función que muestra el modal de éxito después de guardar los datos
    const ModalExito = () => {
        Modal.success({
            title: 'Registro de cliente', // Título del modal
            content: 'Los datos del cliente se han guardado correctamente.', // Mensaje dentro del modal
            onOk: () => { navigate('/sistema-servicios/mostrar-tickets'); } // Navega a otra ruta después de hacer clic en 'Ok'
        });
    }

    // Función que permite regresar a la lista de tickets
    const backList = () => {
        navigate('/sistema-servicios/mostrar-tickets'); // Navega a la pantalla de mostrar tickets
    }



    // Función para mostrar los detalles de una orden de servicio
    const showDetails = async (record) => {
        let DataOrdenRepuestos = []; // Inicializa un array vacío para almacenar los repuestos de la orden

        try {
            // Referencia a la subcolección 'ListaRepuestos' dentro de una orden de servicio específica
            const subcollectionRef = collection(db, `ListaOrdenServicio/${record.id}/ListaRepuestos`);
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            // Crea una lista con los repuestos obtenidos de la subcolección
            let repuestosList = [];
            subcollectionSnapshot.forEach(subDoc => {
                repuestosList.push({
                    idRepuesto: subDoc.id,
                    ...subDoc.data()
                });
            });

            // Asigna la lista de repuestos a la variable global 'DataOrdenRepuestos'
            DataOrdenRepuestos = repuestosList;
        } catch (error) {
            console.error("Error fetching subcollection data: ", error); // Manejo de errores al obtener los datos
        }

        // Muestra un modal con los detalles de la orden de servicio
        Modal.info({
            title: 'Detalles de la orden de servicio',
            width: 500,
            content: (
                <div>
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
                    <p><strong>Costo de repuestos: </strong> {record.MontoRepuestos} Bs.</p>
                    <p><strong>Costo del servicio: </strong> {record.MontoServicio} Bs.</p>
                </div>
            ),
            onOk() { },
        });
    };

    // Función que se ejecuta cuando se confirma la eliminación de una orden de servicio
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar esta orden de servicio?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                // Si se confirma, se ejecuta la función 'handleDelete'
                handleDelete(record.id);
            },
            onCancel() { },
        });
    };

    // Función para manejar la eliminación de la orden de servicio y sus repuestos asociados
    const handleDelete = async (id) => {
        try {
            // Obtiene todos los repuestos asociados a la orden
            const subcollectionRef = collection(db, `ListaOrdenServicio/${id}/ListaRepuestos`);
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const dataList = subcollectionSnapshot.docs.map(doc => ({
                ...doc.data(),
            }));

            // Actualiza la lista de repuestos y elimina los repuestos de la subcolección
            actualizarRepuestos(dataList);
            subcollectionSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Elimina el documento de la orden de servicio
            const docRef = doc(db, "ListaOrdenServicio", id);
            await deleteDoc(docRef);

            // Actualiza la lista de órdenes de servicio
            actualizarListaOrdeServicio();
        } catch (error) {
            console.error("Error deleting document: ", error); // Manejo de errores al eliminar los documentos
        }
    };

    // Función de cambio para manejar la paginación, filtros, y ordenamiento
    const onChange = (pagination, filters, sorter, extra) => {
        // Se pueden mostrar parámetros como 'pagination', 'filters', 'sorter', y 'extra' en la consola para depuración
        // console.log('params', pagination, filters, sorter, extra);
    };

    // Función para actualizar los repuestos en la base de datos.
    const actualizarRepuestos = async (data) => {
        // Se generan promesas para cada item en el array 'data'.
        const promises = data.map(async (item) => {
            const productRef = doc(db, "ListaRepuestos", item.id); // Referencia al documento del repuesto.

            try {
                // Se obtiene el documento del producto.
                const productSnap = await getDoc(productRef);

                // Si el producto existe, se actualiza la cantidad.
                if (productSnap.exists()) {
                    const currentCantidad = productSnap.data().Cantidad || 0; // Se obtiene la cantidad actual (0 si no existe).
                    const newCantidad = currentCantidad + item.cantidadSeleccionada; // Se calcula la nueva cantidad.

                    // Actualiza la cantidad del producto en la base de datos.
                    await updateDoc(productRef, { Cantidad: newCantidad });
                } else {
                    console.log(`Producto con ID ${item.id} no encontrado.`); // Mensaje si no se encuentra el producto.
                }
            } catch (error) {
                console.error(`Error al actualizar el producto con ID ${item.id}:`, error); // Manejo de errores.
            }
        });

        try {
            // Se espera que todas las promesas se resuelvan.
            await Promise.all(promises);
            console.log('Todos los repuestos han sido actualizados.'); // Mensaje de éxito.
        } catch (error) {
            console.error('Error al actualizar los repuestos:', error); // Manejo de errores al esperar las promesas.
        }
    };

    // Función para obtener y filtrar la lista de órdenes de servicio.
    const actualizarListaOrdeServicio = () => {
        const fetchData = async () => {
            // Se obtienen todos los documentos de la colección "ListaOrdenServicio".
            const querySnapshot = await getDocs(collection(db, "ListaOrdenServicio"));

            // Se mapea el resultado para agregar el ID al documento.
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            // Filtra los datos para obtener solo las órdenes de servicio que coincidan con el cliente.
            const filteredDataList = dataList.filter(item => item.NombreCliente === dataTicket.NombreCliente);

            // Se actualiza el estado con los datos filtrados.
            setDataFirebase(filteredDataList);
        };
        fetchData(); // Se llama a la función para obtener y filtrar los datos.
    }

    // Función para recibir y mostrar un mensaje de confirmación.
    const recibirRespuesta = (mensaje) => {
        setConfirmacion(mensaje); // Actualiza el estado con el mensaje recibido.
    };

    // Función para calcular el total de la factura.
    const calcularTotal = () => {
        // Se recorre la lista de repuestos y servicios, sumando el monto de cada uno.
        return dataFirebase.reduce((acc, item) => {
            const montoRepuesto = item.MontoRepuestos || 0; // Se asigna 0 si el monto no está definido.
            const montoServicio = item.MontoServicio || 0; // Se asigna 0 si el monto no está definido.
            return acc + montoRepuesto + montoServicio; // Se devuelve la suma total.
        }, 0);
    };
    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 


    const initialValues = {
        codCliente: numeroCli,
        correo: '',
        estado: 'Activo',
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
