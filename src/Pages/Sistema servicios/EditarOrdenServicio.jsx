import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Table, InputNumber, AutoComplete, message } from 'antd';
import { collection, getDocs, addDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './RegistrarOrdenServicio.css'
import dayjs from 'dayjs';

const EditarOrdenServicio = ({ nombre, actualizar, record }) => {
    const { Option } = Select; // Define opciones para un menú desplegable de Ant Design.
    const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad de un modal.
    const [form] = Form.useForm(); // Maneja los datos y validaciones de un formulario.
    const { confirm } = Modal; // Muestra un cuadro de diálogo de confirmación.
    const [dataFirebase, setDataFirebase] = useState([]); // Almacena datos obtenidos de Firebase.
    const [dataEmpleados, setDataEmpleados] = useState([]); // Almacena datos de empleados.
    const [dataOrdenServicio, setDataOrdenServicio] = useState([]); // Almacena datos de órdenes de servicio.
    const [options, setOptions] = useState([]); // Almacena opciones disponibles para selección.
    const [selectedOption, setSelectedOption] = useState(null); // Almacena la opción seleccionada por el usuario.
    const [costoTotal, setCostoTotal] = useState(0); // Almacena el costo total calculado.   
    //Definimos el contenido y el titulo de las columnas de la tabla
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
    useEffect(() => {
        handleIncrement(); // Llama a una función para realizar una acción cada vez que cambia `costoTotal`.
    }, [costoTotal]);

    useEffect(() => {
        // Función para obtener datos de la colección "ListaRepuestos" en Firebase.
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaRepuestos")); // Obtiene los documentos de Firebase.
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                cantidadSeleccionada: 0 // Inicializa la cantidad seleccionada en 0.
            }));
            setDataFirebase(dataList); // Almacena los datos obtenidos en el estado `dataFirebase`.
        };
        fetchData(); // Ejecuta la función de obtención de datos.

        // Función para obtener datos de la colección "ListaEmpleados" en Firebase.
        const fetchDataEmpleados = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaEmpleados")); // Obtiene los documentos de Firebase.
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataEmpleados(dataList); // Almacena los datos obtenidos en el estado `dataEmpleados`.
        };
        fetchDataEmpleados(); // Ejecuta la función de obtención de datos.
    }, []); // Solo se ejecuta una vez al montar el componente.
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +


    // Función para manejar la búsqueda de repuestos
    const handleSearch = (value) => {
        // Verifica si el valor de búsqueda no está vacío
        if (value) {
            // Filtra la lista de repuestos según el nombre y actualiza las opciones con los resultados encontrados
            const filtered = dataFirebase
                .filter(item => item.NombreRepuesto.toLowerCase().includes(value.toLowerCase())) // Filtra por nombre de repuesto, ignorando mayúsculas/minúsculas
                .map(item => ({ value: item.NombreRepuesto })); // Mapea los resultados a un formato que contiene solo el nombre del repuesto
            setOptions(filtered); // Actualiza el estado de opciones con los resultados filtrados
        } else {
            // Si el valor de búsqueda está vacío, limpia las opciones
            setOptions([]);
        }
    };

    // Función que maneja la selección de un repuesto
    const onSelect = (value) => {
        // Cuando un usuario selecciona un valor de la lista, se guarda el valor seleccionado
        setSelectedOption(value);
    };

    // Función que abre el modal con los detalles de los repuestos asociados a la orden de servicio
    const showModal = async () => {
        // Resetea los campos del formulario antes de mostrar el modal
        form.resetFields();
        try {
            // Obtiene los repuestos asociados a la orden de servicio desde la subcolección
            const subcollectionRef = collection(db, `ListaOrdenServicio/${record.id}/ListaRepuestos`);
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            let repuestosList = [];
            // Recopila los datos de los repuestos en un arreglo
            subcollectionSnapshot.forEach(subDoc => {
                repuestosList.push({
                    idRepuesto: subDoc.id,
                    ...subDoc.data() // Desestructura los datos del documento para agregarlos al arreglo
                });
            });

            setDataOrdenServicio(repuestosList); // Actualiza el estado con la lista de repuestos
        } catch (error) {
            // Muestra el error si ocurre
            console.error("Error fetching subcollection data: ", error);
        }
        // Establece el costo total de los repuestos y muestra el modal
        setCostoTotal(record.MontoRepuestos);
        setIsModalVisible(true);
    };

    // Función para cerrar el modal sin realizar cambios
    const handleCancel = () => {
        // Cambia el estado para cerrar el modal
        setIsModalVisible(false);
    };

    // Función para confirmar y enviar el formulario
    const handleOk = () => {
        // Al hacer clic en "OK", se envía el formulario
        form.submit();
    };

    // Función que se ejecuta al finalizar el formulario y actualizar los datos
    const handleFinish = async (values) => {
        // Muestra un mensaje de carga mientras se actualiza la orden de servicio
        const hide = message.loading('Actualizando orden de servicio...', 0);
        const id = record.id; // Obtiene el ID de la orden de servicio a actualizar
        try {
            // Actualiza los datos de la orden de servicio en Firestore
            const docRef = doc(db, "ListaOrdenServicio", id); // Referencia al documento de la orden de servicio
            await updateDoc(docRef, {
                CodOrden: values.codOrden,
                NombreCliente: nombre,
                TecnicoEncargado: values.tecnicoEncargado,
                FechaReparacion: formatearFecha(values.fechaReparacion.toDate()), // Convierte las fechas
                FechaEntrega: formatearFecha(values.fechaEntrega.toDate()),
                MontoServicio: parseInt(values.costoServicio), // Convierte a número
                MontoRepuestos: costoTotal, // Asigna el total de repuestos
                Garantia: values.garantia, // Asigna la garantía
            });

            // Para actualizar la subcolección de repuestos asociados
            const subcollectionRef = collection(db, `ListaOrdenServicio/${docRef.id}/ListaRepuestos`);

            // Elimina los documentos existentes en la subcolección de repuestos
            const existingDocsSnapshot = await getDocs(subcollectionRef);
            const batch = writeBatch(db); // Crea un batch para eliminar todos los documentos en la subcolección

            existingDocsSnapshot.forEach(docSnapshot => {
                batch.delete(docSnapshot.ref); // Elimina cada documento en la subcolección
            });

            await batch.commit(); // Ejecuta el batch de eliminación

            // Añadir los nuevos repuestos a la subcolección
            await Promise.all(
                dataOrdenServicio.map(async (repuesto) => {
                    await addDoc(subcollectionRef, repuesto); // Agrega cada repuesto a la subcolección
                })
            );

            hide(); // Oculta el mensaje de carga
            ModalExito(); // Muestra un modal de éxito si la operación fue exitosa
        } catch (error) {
            hide(); // Oculta el mensaje de carga si ocurre un error
            console.error("Error updating document: ", error); // Muestra el error en la consola
        }
    };

    // Función para formatear la fecha en formato YYYY-MM-DD
    function formatearFecha(fechaString) {
        // Convierte la fecha string en un objeto Date
        const fecha = new Date(fechaString);

        // Extrae el día, mes y año
        const dia = fecha.getDate().toString().padStart(2, '0'); // Asegura que el día tenga dos dígitos
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear(); // Obtiene el año completo

        // Devuelve la fecha en el formato 'YYYY-MM-DD'
        return `${año}-${mes}-${dia}`;
    }

    // Función para agregar un repuesto a la lista de la orden de servicio
    const agregarLista = () => {
        // Si hay opciones disponibles y una opción seleccionada, agrega el repuesto
        if (options.length > 0 && selectedOption) {
            // Filtra los datos de repuestos que coinciden con la opción seleccionada
            const filteredData = dataFirebase.filter(item => item.NombreRepuesto === selectedOption);

            // Filtra los elementos nuevos que no están ya en la lista de orden de servicio
            const newItems = filteredData.filter(item =>
                !dataOrdenServicio.some(existingItem => existingItem.id === item.id)
            );

            // Si hay repuestos nuevos, los agrega a la lista de orden de servicio
            if (newItems.length > 0) {
                setDataOrdenServicio([...dataOrdenServicio, ...newItems]);
            }
        }
    };

    // Función para mostrar una confirmación antes de eliminar un repuesto
    const confirmDelete = (record) => {
        // Muestra un modal de confirmación para eliminar el repuesto
        confirm({
            title: '¿Estás seguro de eliminar este repuesto?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar', // Texto del botón de confirmación
            okType: 'danger', // Tipo de botón (peligroso)
            cancelText: 'Cancelar', // Texto del botón de cancelación
            onOk() {
                // Si se confirma, llama a la función para eliminar el repuesto
                handleDelete(record.id);
            },
            onCancel() { },
        });
    };



    // Función para eliminar un repuesto de la lista de la orden de servicio
    const handleDelete = (id) => {
        // Filtra los repuestos eliminando el que tiene el id especificado
        const updatedOrdenServicio = dataOrdenServicio.filter(item => item.id !== id);

        // Calcula el costo total de los repuestos restantes en la lista
        const total = updatedOrdenServicio.reduce((acc, repuesto) => {
            return acc + (repuesto.PrecioRepuesto * repuesto.cantidadSeleccionada);
        }, 0);

        // Actualiza el estado con los nuevos datos de la lista y el costo total
        setCostoTotal(total);
        setDataOrdenServicio(updatedOrdenServicio);
    };

    // Función para incrementar o decrementar la cantidad seleccionada de un repuesto
    const handleIncrement = (key, incrementValue) => {
        // Actualiza la cantidad seleccionada del repuesto especificado
        const updatedOrdenServicio = dataOrdenServicio.map((repuesto) => {
            if (repuesto.id === key) {
                // Calcula la nueva cantidad, asegurándose de que esté dentro del rango permitido
                const newNuevaCantidad = repuesto.cantidadSeleccionada + incrementValue;
                const cantidadFinal = Math.min(Math.max(newNuevaCantidad, 0), repuesto.Cantidad);
                return { ...repuesto, cantidadSeleccionada: cantidadFinal };
            }
            return repuesto;
        });

        // Actualiza el estado con la nueva lista de repuestos
        setDataOrdenServicio(updatedOrdenServicio);

        // Calcula el costo total de los repuestos actualizados
        const total = updatedOrdenServicio.reduce((acc, repuesto) => {
            return acc + (repuesto.PrecioRepuesto * repuesto.cantidadSeleccionada);
        }, 0);

        // Actualiza el costo total
        setCostoTotal(total);
    };

    // Función que maneja los cambios de la tabla, como paginación y filtros
    const onChange = (pagination, filters, sorter, extra) => {
        // Aquí se podrían manejar las actualizaciones relacionadas con la paginación y filtros
        // console.log('params', pagination, filters, sorter, extra);
    };

    // Función que muestra un modal de éxito al actualizar los datos de la orden de servicio
    const ModalExito = () => {
        Modal.success({
            title: 'Actualizar datos del orden de servicio', // Título del modal
            content: 'Los datos del orden de servicio se han actualizado correctamente.', // Mensaje de éxito
            onOk: () => {
                actualizar("Si");  // Ejecuta la función de actualización si el usuario acepta
                setDataOrdenServicio([]); // Limpia la lista de orden de servicio
                setIsModalVisible(false); // Cierra el modal
            }
        });
    };
    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    // Valores iniciales para el formulario de la orden de servicio
    const initialValues = {
        codOrden: record.CodOrden,
        nombre: record.NombreCliente,
        tecnicoEncargado: record.TecnicoEncargado,
        fechaReparacion: dayjs(record.FechaReparacion),
        fechaEntrega: dayjs(record.FechaEntrega),
        costoServicio: record.MontoServicio,
        garantia: record.Garantia,
    };

    return (
        <div>
            <Button onClick={showModal}>
                Editar
            </Button>
            <Modal
                title="Registrar orden de servicio"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Actualizar
                    </Button>,
                ]}
                width={800}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    initialValues={initialValues}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                    onFinish={handleFinish}
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
                                dataSource={dataOrdenServicio}
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

export default EditarOrdenServicio;
