import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css';
import BotonVer from './VerCliente';

const MostrarClientes = () => {
    // Desestructuración de Modal para obtener el método confirm
    const { confirm } = Modal;
    // Hook de React Router para navegación
    const navigate = useNavigate();
    // Estado para almacenar los datos obtenidos de Firebase
    const [dataFirebase, setDataFirebase] = useState([]);

    // Definición de las columnas para la tabla
    const columns = [
        {
            title: 'Código',
            dataIndex: 'CodCliente',
            defaultSortOrder: 'descend',
            width: '100px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nombre',
            dataIndex: 'NombreCliente',
            defaultSortOrder: 'descend',
            width: '150px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Dispositivo',
            dataIndex: 'NombreDispositivo',
            defaultSortOrder: 'descend',
            width: '300px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Pendiente repuesto',
            dataIndex: 'PendienteRepuestos',
            defaultSortOrder: 'descend',
            render: (pendiente) => (
                <span>
                    {pendiente ? 'Sí' : 'No'}
                </span>
            ),
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Pendiente reparar',
            dataIndex: 'PendienteReparar',
            defaultSortOrder: 'descend',
            render: (pendiente) => (
                <span>
                    {pendiente ? 'Sí' : 'No'}
                </span>
            ),
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Pendiente entregar',
            dataIndex: 'PendienteEntrega',
            defaultSortOrder: 'descend',
            render: (pendiente) => (
                <span>
                    {pendiente ? 'Sí' : 'No'}
                </span>
            ),
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Pendiente pagar',
            dataIndex: 'PendientePagar',
            defaultSortOrder: 'descend',
            render: (pendiente) => (
                <span>
                    {pendiente ? 'Sí' : 'No'}
                </span>
            ),
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Pendiente otro',
            dataIndex: 'PendienteOtro',
            defaultSortOrder: 'descend',
            render: (pendiente) => (
                <span>
                    {pendiente ? 'Sí' : 'No'}
                </span>
            ),
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button onClick={() => navegarRegistrarCliente(record)}>Registrar ticket</Button>
                    <BotonVer record={record} />
                    <Button onClick={() => editRecord(record)}>Editar</Button>
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>

                </Space>
            ),
        },
    ];

    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
    // useEffect para cargar los datos de clientes activos desde Firebase
    useEffect(() => {
        // Función asíncrona que obtiene los datos de la colección "ListaClientes" desde Firebase
        const fetchData = async () => {
            // Obtener los documentos de la colección "ListaClientes"
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));

            // Mapear los documentos obtenidos a un formato más adecuado, agregando el ID de cada documento
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            // Filtrar los datos para obtener solo los clientes cuyo estado sea "Activo"
            const filteredDataList = dataList.filter(item => item.Estado === "Activo");

            // Almacenar los datos filtrados en el estado `dataFirebase`
            setDataFirebase(filteredDataList);
        };

        // Llamada a la función asíncrona para obtener los datos
        fetchData();
    }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // - - - - - - - - - - - - - - -  E   D   I   T   A   R  - - - - - - - - - - - - - - - -
    // Función para navegar a la página de editar cliente, pasando un objeto como estado
    const editRecord = (record) => {
        // Navega a la ruta '/sistema-servicios/editar-cliente' y pasa el objeto `record` como estado
        navigate('/sistema-servicios/editar-cliente', { state: { objetoProp: record } });
    };

    // - - - - - - - - - - - - - - -  E   L   I   M   I   N   A    R  - - - - - - - - - - - - - - - -
    // Función para confirmar la eliminación de un cliente
    const confirmDelete = (record) => {
        // Muestra una confirmación antes de proceder con la eliminación
        confirm({
            title: '¿Estás seguro de eliminar la información del cliente?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            okType: 'danger', // El botón de eliminación tiene un estilo peligroso (rojo)
            cancelText: 'Cancelar', // El botón de cancelación
            onOk() {
                // Si el usuario confirma la eliminación, se llama a la función `handleDelete`
                handleDelete(record.id);
            },
            onCancel() {
                // Acción que se toma si el usuario cancela (en este caso no hace nada)
            },
        });
    };


    // Función para eliminar un cliente de la base de datos
    const handleDelete = async (id) => {
        // Referencia al documento que se va a eliminar en la colección "ListaClientes" usando su ID
        const docRef = doc(db, "ListaClientes", id);
        try {
            // Intentar eliminar el documento
            await deleteDoc(docRef);
            // console.log("Document deleted"); // Puedes descomentar esta línea si deseas verificar en la consola que se eliminó
            actualizarClientes(); // Después de eliminar, se actualizan los clientes en la interfaz
        } catch (e) {
            // Si ocurre un error, se muestra en la consola
            console.error("Error deleting document: ", e);
        }
    };

    // - - - - - - - - - - - - - - -  O T R A S     F U N C I O N A L I D A D E S  - - - - - - - - - - - - - - - -

    // Función que se ejecuta cuando se cambia la paginación, filtros o el orden de los datos
    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra); // Puedes descomentar esta línea para ver los parámetros de cambio en la consola
    };

    // Función para actualizar la lista de clientes activos
    const actualizarClientes = async () => {
        // Obtiene todos los documentos de la colección "ListaClientes"
        const querySnapshot = await getDocs(collection(db, "ListaClientes"));
        // Mapea los documentos para agregar el ID y obtener los datos
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        // Filtra los datos para solo obtener los clientes con estado "Activo"
        const filteredDataList = dataList.filter(item => item.Estado === "Activo");
        // Actualiza el estado local con los clientes activos
        setDataFirebase(filteredDataList);
    };

    // Función para navegar a la página de registrar ticket, pasando un objeto como estado
    const navegarRegistrarCliente = (record) => {
        // Navega a la ruta '/sistema-servicios/registrar-ticket' y pasa el objeto `record` como estado
        navigate('/sistema-servicios/registrar-ticket', { state: { objetoProp: record } });
    };

    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    return (
        <>
            <div>
                <h2 className="form-titleRepuestos">Mostrar clientes</h2>
                <div className='parentMostrarRepuestos'>
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
                </div>
            </div>
        </>
    );
};

export default MostrarClientes;
