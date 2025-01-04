import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Table, InputNumber, AutoComplete, message } from 'antd';
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './RegistrarOrdenServicio.css'

const { Option } = Select;

const RegistrarOrdenServicio = ({ nombre, actualizar }) => {
    // Estado para controlar la visibilidad del modal.
    const [isModalVisible, setIsModalVisible] = useState(false);
    // Crea un formulario usando `Form.useForm()` para manejar la validación y los datos del formulario.
    const [form] = Form.useForm();
    // Desestructura `confirm` de `Modal` para mostrar mensajes de confirmación en modales.
    const { confirm } = Modal;
    // Estado para almacenar los datos de Firebase (probablemente de repuestos o productos).
    const [dataFirebase, setDataFirebase] = useState([]);
    // Estado para almacenar los datos de los empleados (probablemente para asignar técnicos).
    const [dataEmpleados, setDataEmpleados] = useState([]);
    // Estado para almacenar los datos de la orden de servicio, como los repuestos seleccionados y sus cantidades.
    const [dataOrdenServicio, setDataOrdenServicio] = useState([]);
    // Estado para las opciones de búsqueda filtradas cuando el usuario busca repuestos.
    const [options, setOptions] = useState([]);
    // Estado para la opción seleccionada por el usuario en el formulario o búsqueda.
    const [selectedOption, setSelectedOption] = useState(null);
    // Estado para calcular el costo total de la orden de servicio con base en los repuestos seleccionados.
    const [costoTotal, setCostoTotal] = useState(0);
    // Estado para generar y mantener el número de orden de servicio, posiblemente incrementado automáticamente.
    const [numeroOrden, setNumeroOrden] = useState(0);
    // Control para manejar el estado de otras interacciones en el formulario o el flujo de trabajo (por ejemplo, "run").
    const [control, setControl] = useState("");
    // Definición de las columnas de una tabla.
    const columns = [
        {
            title: 'Código',
            dataIndex: 'CodRepuesto',
            defaultSortOrder: 'descend',
            // width: '250px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nombre de repuesto',
            dataIndex: 'NombreRepuesto',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Precio ',
            dataIndex: 'PrecioRepuesto',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidadSeleccionada',
            key: 'incrementar',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleIncrement(record.id, -1)}>-</Button>
                    <InputNumber
                        min={0}
                        value={record.cantidadSeleccionada}
                        onChange={(value) => handleIncrement(record.id, value - record.cantidadSeleccionada)}
                    />
                    <Button onClick={() => handleIncrement(record.id, 1)}>+</Button>
                </div>
            ),
        },
        {
            title: 'Acción',
            dataIndex: 'accion',
            key: 'accion',
            render: (_, record) => (
                <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
            ),
        },
    ];

    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
    // useEffect que se ejecuta cuando cambia el valor de `numeroOrden` o `setNumeroOrden`.
    // Esta función llama a la función `showModal` para mostrar el modal cuando cambian estas variables.
    useEffect(() => {
        showModal(); // Muestra el modal al detectar un cambio en `numeroOrden` o `setNumeroOrden`.
    }, [numeroOrden, setNumeroOrden]); // Se ejecuta cuando `numeroOrden` o `setNumeroOrden` cambian.

    // Función que maneja el cierre del modal, estableciendo `isModalVisible` a `false`.
    const handleCancel = () => {
        setIsModalVisible(false); // Establece el estado para ocultar el modal.
    };

    // useEffect que se ejecuta cada vez que cambia `costoTotal`.
    // Esta función llama a `handleIncrement`, probablemente para manejar el incremento de un valor relacionado con el costo total.
    useEffect(() => {
        handleIncrement(); // Llama a `handleIncrement` cuando `costoTotal` cambia.
    }, [costoTotal]); // Se ejecuta cuando `costoTotal` cambia.

    // useEffect que se ejecuta cuando cambia el valor de `control`.
    // Esta función recupera datos de Firebase y actualiza los estados correspondientes.
    useEffect(() => {
        setDataOrdenServicio([]); // Resetea el estado `dataOrdenServicio` a un array vacío al cambiar `control`.

        // Función que obtiene los datos de la colección "ListaRepuestos" en Firebase.
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaRepuestos"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id, // Agrega el ID del documento a los datos.
                cantidadSeleccionada: 0, // Inicializa `cantidadSeleccionada` como 0.
            }));
            setDataFirebase(dataList); // Actualiza el estado `dataFirebase` con los datos obtenidos.
        };
        fetchData(); // Llama a la función para obtener los datos de los repuestos.

        // Función que obtiene los datos de las colecciones "ListaEmpleados" y "ListaCredenciales" en Firebase.
        const fetchDataEmpleados = async () => {
            // Obtén los datos de los empleados
            const empleadosSnapshot = await getDocs(collection(db, "ListaEmpleados"));
            const empleadosList = empleadosSnapshot.docs.map(doc => ({ ...doc.data() }));

            // Obtén los datos de las credenciales
            const credencialesSnapshot = await getDocs(collection(db, "ListaCredenciales"));
            const credencialesList = credencialesSnapshot.docs.map(doc => doc.data());

            // Combina los datos de empleados y credenciales, asignando el sistema correspondiente.
            const dataList = empleadosList.map(empleado => {
                const credencial = credencialesList.find(cred => cred.Nombre === empleado.Nombre);
                return {
                    ...empleado,
                    SistemaAsignado: credencial ? credencial.SistemaAsignado : null, // Asigna el sistema si existe la credencial.
                };
            });

            // Filtra los empleados que están asignados al "Sistema de servicios", "Ninguno" o no tienen sistema asignado.
            const dataFilterServicios = dataList.filter(empleado =>
                ["Sistema de servicios", "Ninguno", null].includes(empleado.SistemaAsignado)
            );

            setDataEmpleados(dataFilterServicios); // Actualiza el estado `dataEmpleados` con los empleados filtrados.
        };
        fetchDataEmpleados(); // Llama a la función para obtener los empleados.

        setControl(""); // Resetea el valor de `control`.
        setCostoTotal(0); // Resetea el valor de `costoTotal`.
    }, [control]); // Se ejecuta cada vez que cambia `control`.
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // Función que maneja la confirmación del modal. Llama a `form.submit()` para enviar el formulario.
    const handleOk = () => {
        form.submit(); // Envía el formulario cuando se confirma.
    };

    // Función que maneja la búsqueda de repuestos. Filtra los repuestos de acuerdo al valor de búsqueda y si la cantidad es mayor que 0.
    const handleSearch = (value) => {
        if (value) {
            const filtered = dataFirebase
                .filter(item => (item.NombreRepuesto.toLowerCase().includes(value.toLowerCase()) && parseInt(item.Cantidad) > 0))
                .map(item => ({ value: item.NombreRepuesto })); // Filtra por nombre y cantidad disponible
            setOptions(filtered); // Actualiza las opciones con los resultados filtrados.
        } else {
            setOptions([]); // Si no hay valor, limpia las opciones.
        }
    };

    // Función que maneja la selección de un repuesto. Actualiza el estado `selectedOption` con el valor seleccionado.
    const onSelect = (value) => {
        setSelectedOption(value); // Actualiza el estado `selectedOption` con el valor seleccionado.
    };

    // Función que muestra el modal. Resetea los campos del formulario y establece el control para "run".
    // También genera el número de orden de servicio basado en el tamaño actual de la colección de órdenes.
    const showModal = async () => {
        form.resetFields(); // Resetea los campos del formulario.
        setIsModalVisible(true); // Muestra el modal.
        setControl("run"); // Establece el control en "run".
        const querySnapshot2 = await getDocs(collection(db, "ListaOrdenServicio")); // Obtiene los datos de la colección de órdenes de servicio.
        const dataList2 = querySnapshot2.docs.map(doc => ({
            ...doc.data(),
            id: doc.id, // Mapea los datos y agrega el ID.
        }));
        setNumeroOrden(`2024-${dataList2.length + 1}`); // Establece el número de orden basado en la longitud de los documentos en la colección.
    };

    // Función que maneja el envío del formulario para registrar la orden de servicio en la base de datos.
    // Además, maneja la adición de los repuestos a la subcolección de cada orden de servicio.
    const handleFinish = async (values) => {
        const tiempoActual = obtenerFechaHoraActual(); // Obtiene la fecha y hora actual.
        const hide = message.loading('Registrando orden de servicio...', 0); // Muestra un mensaje de carga.
        try {
            // Agrega la orden de servicio a la colección "ListaOrdenServicio"
            const docRef = await addDoc(collection(db, "ListaOrdenServicio"), {
                CodOrden: values.codOrden,
                NombreCliente: nombre, // Usa el nombre previamente definido.
                TecnicoEncargado: values.tecnicoEncargado,
                FechaReparacion: formatearFecha(values.fechaReparacion.toDate()),
                FechaEntrega: formatearFecha(values.fechaEntrega.toDate()),
                MontoServicio: parseInt(values.costoServicio), // Convierte el costo del servicio a entero.
                MontoRepuestos: costoTotal, // Usa el valor total de los repuestos.
                Garantia: values.garantia,

                Fecha: tiempoActual.fecha, // Fecha actual.
                Hora: tiempoActual.hora, // Hora actual.
            });

            // Agrega los repuestos a la subcolección de la orden de servicio.
            const subcollectionRef = collection(db, `ListaOrdenServicio/${docRef.id}/ListaRepuestos`);
            await Promise.all(
                dataOrdenServicio.map(async (repuesto) => {
                    await addDoc(subcollectionRef, repuesto); // Agrega cada repuesto a la subcolección.
                })
            );

            actualizarRepuestos(); // Actualiza los datos de los repuestos.
            hide(); // Oculta el mensaje de carga.
            ModalExito(); // Muestra el modal de éxito.
        } catch (error) {
            hide(); // Oculta el mensaje de carga en caso de error.
            console.error("Error adding document: ", error); // Muestra el error en consola.
        }
    };

    // Función que maneja el error cuando el formulario no se completa correctamente. Muestra un mensaje de error.
    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.'); // Muestra un mensaje de error cuando el formulario falla.
    };

    // Función que actualiza la cantidad de repuestos en la base de datos después de cada orden de servicio.
    // Usa `map` para crear una lista de promesas que actualizan los repuestos en Firebase.
    const actualizarRepuestos = async () => {
        // Crea una lista de promesas para actualizar la cantidad de cada repuesto.
        const promises = dataOrdenServicio.map((item) => {
            const productRef = doc(db, "ListaRepuestos", item.id); // Obtiene la referencia del producto en la colección "ListaRepuestos".
            return updateDoc(productRef, { Cantidad: parseInt(item.Cantidad) - item.cantidadSeleccionada }); // Actualiza la cantidad de repuesto.
        }).filter(promise => promise !== null); // Filtra cualquier promesa nula (si existiera).

        try {
            await Promise.all(promises); // Espera a que todas las promesas se resuelvan.
            console.log('Todos los repuestos han sido actualizados.'); // Muestra un mensaje de éxito en consola.
        } catch (error) {
            console.error('Error al actualizar los repuestos:', error); // Muestra el error en consola si falla la actualización.
        }
    };

    // Función que formatea una fecha en formato 'YYYY-MM-DD' a partir de un string de fecha.
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString); // Convierte el string de fecha a un objeto Date.

        const dia = fecha.getDate().toString().padStart(2, '0'); // Obtiene el día y lo formatea con 2 dígitos.
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtiene el mes (sumando 1 ya que es base 0 en JS).
        const año = fecha.getFullYear(); // Obtiene el año.

        return `${año}-${mes}-${dia}`; // Retorna la fecha en formato 'YYYY-MM-DD'.
    }

    // Función que maneja la adición de repuestos a la lista de orden de servicio.
    const agregarLista = () => {
        if (options.length > 0 && selectedOption) { // Verifica si hay opciones y una opción seleccionada.
            const filteredData = dataFirebase.filter(item => item.NombreRepuesto === selectedOption); // Filtra los repuestos por nombre.
            const newItems = filteredData.filter(item =>
                !dataOrdenServicio.some(existingItem => existingItem.id === item.id) // Filtra los repuestos que no están en la lista de la orden de servicio.
            );
            if (newItems.length > 0) { // Si hay nuevos repuestos para agregar:
                setDataOrdenServicio([...dataOrdenServicio, ...newItems]); // Los agrega a la lista de la orden de servicio.
            }
        }
    };

    // Función que muestra una confirmación para eliminar un repuesto de la lista.
    // Al confirmar, ejecuta la función `handleDelete` para eliminar el repuesto.
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar este respuesto?', // Título del modal de confirmación.
            content: 'Esta acción no se puede deshacer.', // Mensaje de advertencia.
            okText: 'Eliminar', // Texto del botón para confirmar.
            okType: 'danger', // Tipo de botón para mostrarlo como peligroso.
            cancelText: 'Cancelar', // Texto del botón para cancelar la acción.
            onOk() { // Acción cuando se confirma.
                handleDelete(record.id); // Llama a `handleDelete` pasando el `id` del repuesto.
            },
            onCancel() { }, // Acción cuando se cancela (no se hace nada).
        });
    };

    // Función que maneja la eliminación de un repuesto de la lista de orden de servicio.
    // Filtra la lista de `dataOrdenServicio` para eliminar el repuesto por su `id`.
    // Luego, recalcula el costo total de la orden de servicio.
    const handleDelete = (id) => {
        const updatedOrdenServicio = dataOrdenServicio.filter(item => item.id !== id); // Filtra el repuesto a eliminar.
        const total = updatedOrdenServicio.reduce((acc, repuesto) => {
            return acc + (repuesto.PrecioRepuesto * repuesto.cantidadSeleccionada); // Calcula el nuevo costo total.
        }, 0);
        setCostoTotal(total); // Actualiza el costo total.
        setDataOrdenServicio(updatedOrdenServicio); // Actualiza la lista de la orden de servicio.
    };

    // Función para manejar la cantidad de repuestos seleccionados. Incrementa o decrementa según `incrementValue`.
    // Se asegura de que la cantidad no exceda el límite de la cantidad disponible en el repuesto.
    const handleIncrement = (key, incrementValue) => {
        const updatedOrdenServicio = dataOrdenServicio.map((repuesto) => {
            if (repuesto.id === key) {
                const newNuevaCantidad = repuesto.cantidadSeleccionada + incrementValue; // Calcula la nueva cantidad.
                const cantidadFinal = Math.min(Math.max(newNuevaCantidad, 0), repuesto.Cantidad); // Asegura que la cantidad esté en el rango permitido.
                return { ...repuesto, cantidadSeleccionada: cantidadFinal }; // Actualiza la cantidad seleccionada.
            }
            return repuesto; // De lo contrario, retorna el repuesto sin cambios.
        });
        setDataOrdenServicio(updatedOrdenServicio); // Actualiza la lista de repuestos.
        const total = updatedOrdenServicio.reduce((acc, repuesto) => {
            return acc + (repuesto.PrecioRepuesto * repuesto.cantidadSeleccionada); // Recalcula el costo total.
        }, 0);
        setCostoTotal(total); // Actualiza el costo total.
    };

    // Función que maneja el cambio de la tabla (paginación, filtros, ordenamiento).
    // En este caso, solo se ha colocado un comentario sobre los parámetros sin implementación.
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra); // Aquí se podrían imprimir los parámetros si se necesitara.
    };

    // Función que muestra un modal de éxito cuando la orden de servicio se guarda correctamente.
    // Reinicia el costo total y limpia la lista de la orden de servicio al confirmar.
    const ModalExito = () => {
        setCostoTotal(0); // Reinicia el costo total.
        Modal.success({
            title: 'Registro de orden de servicio', // Título del modal de éxito.
            content: 'Los datos de la orden de servicio se han guardado correctamente.', // Contenido del modal.
            onOk: () => {
                actualizar("Si"); // Llama a la función `actualizar` (no está definida en el código proporcionado, pero se asume que actualiza alguna parte de la interfaz).
                setDataOrdenServicio([]); // Limpia la lista de la orden de servicio.
                setIsModalVisible(false); // Cierra el modal.
            }
        });
    };

    // Función que obtiene la fecha y hora actual en formato 'YYYY-MM-DD' y 'HH:mm:ss'.
    // Devuelve un objeto con `fecha` y `hora` formateados.
    const obtenerFechaHoraActual = () => {
        const ahora = new Date(); // Crea un objeto de fecha con la fecha y hora actuales.

        const dia = ahora.getDate().toString().padStart(2, '0'); // Obtiene el día y lo formatea a 2 dígitos.
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0'); // Obtiene el mes (sumando 1 porque en JS los meses son base 0) y lo formatea a 2 dígitos.
        const año = ahora.getFullYear(); // Obtiene el año.
        const hora = ahora.getHours().toString().padStart(2, '0'); // Obtiene la hora y la formatea a 2 dígitos.
        const minutos = ahora.getMinutes().toString().padStart(2, '0'); // Obtiene los minutos y los formatea a 2 dígitos.
        const segundos = ahora.getSeconds().toString().padStart(2, '0'); // Obtiene los segundos y los formatea a 2 dígitos.

        const tiempo = {
            fecha: `${año}-${mes}-${dia}`, // Formatea la fecha como 'YYYY-MM-DD'.
            hora: `${hora}:${minutos}:${segundos}` // Formatea la hora como 'HH:mm:ss'.
        };

        return tiempo; // Retorna un objeto con la fecha y la hora actuales.
    };
    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    const initialValues = {
        codOrden: numeroOrden
    }

    return (
        <div style={{ marginRight: '20px', marginBottom: '10px' }}>
            <Button type="primary" onClick={showModal}>
                Registrar orden de servicio
            </Button>
            <Modal
                title="Registrar orden de servicio"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Registrar
                    </Button>,
                ]}
                width={800}
            >
                <Form
                    form={form}
                    layout="horizontal"
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
                    onFinish={handleFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialValues}
                >
                    <div className='parentOS'>
                        <div className='divOS1'>
                            <Form.Item
                                name="codOrden"
                                label="Código de orden de servicio"
                                rules={[{ required: true, message: 'Por favor ingrese un código de orden de servicio' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="tecnicoEncargado"
                                label="Técnico encargado"
                                rules={[{ required: true, message: 'Por favor seleccione un técnico encargado' }]}
                            >
                                <Select placeholder="Seleccione un técnico">
                                    {dataEmpleados.map(empleado => (
                                        <Option key={empleado.id} value={empleado.Nombre}>
                                            {empleado.Nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="buscarRepuestos"
                                label="Buscar repuestos"
                            >
                                <AutoComplete
                                    options={options}
                                    onSelect={onSelect}
                                    onSearch={handleSearch}
                                    placeholder="Ingrese el nombre del repuesto"
                                />
                                <Button style={{ width: '150px', marginTop: '10px' }} type='primary' onClick={agregarLista}>Agregar</Button>
                            </Form.Item>

                            <Table
                                columns={columns}
                                dataSource={dataOrdenServicio.map((data, index) => ({
                                    ...data,
                                    key: index,
                                  }))}
                                pagination={false}
                                onChange={onChange}
                                showSorterTooltip={{
                                    target: 'sorter-icon',
                                }}
                                scroll={{ x: true }}
                            />
                            <h3 style={{ textAlign: 'right', marginRight: '100px' }}>Costo total repuestos: {costoTotal} Bs.</h3>

                            <Form.Item
                                name="fechaReparacion"
                                label="Fecha de reparación"
                                rules={[{ required: true, message: 'Por favor seleccione la fecha de reparación' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" />
                            </Form.Item>

                            <Form.Item
                                name="fechaEntrega"
                                label="Fecha de entrega"
                                rules={[{ required: true, message: 'Por favor seleccione la fecha de entrega' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" />
                            </Form.Item>

                            <Form.Item
                                name="garantia"
                                label="Garantía"
                                rules={[{ required: true, message: 'Por favor ingrese la garantía' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="costoServicio"
                                label="Costo del servicio"
                                rules={[{ required: true, message: 'Por favor ingrese el costo del servicio' }]}
                            >
                                <Input prefix="Bs" type="number" />
                            </Form.Item>
                        </div>

                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default RegistrarOrdenServicio;
