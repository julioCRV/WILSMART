import { Table, Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css'

const MostrarRegistrarClientes = () => {
    // Hook de navegación para redirigir a otras vistas
    const navigate = useNavigate();

    // Hooks de estado para manejar los datos obtenidos desde Firebase
    const [dataFirebase, setDataFirebase] = useState([]); // Lista de tickets de atención
    const [dataCliente, setDataClientes] = useState([]); // Lista de clientes
    const [numeroCliente, setNumeroClientes] = useState([]); // Número de cliente generado dinámicamente
    // Definición de las columnas de la tabla para mostrar los datos
    const columns = [
        {
            title: 'Nombre del cliente', // Título de la columna
            dataIndex: 'NombreCliente', // Campo que se usará para la columna
            defaultSortOrder: 'descend', // Orden de clasificación por defecto
            width: '180px', // Ancho de la columna
            sorter: (a, b) => a.NombreCliente.localeCompare(b.NombreCliente), // Función para ordenar los clientes por nombre
        },
        {
            title: 'Nombre del dispositivo',
            dataIndex: 'NombreDispositivo',
            defaultSortOrder: 'descend',
            width: '120px'
        },
        {
            title: 'Descripción del problema',
            dataIndex: 'DescripcionProblema',
            defaultSortOrder: 'descend',
            width: '180px'
        },
        {
            title: 'Teléfono/celular',
            dataIndex: 'TelefonoCelular',
            defaultSortOrder: 'descend',
        },
        {
            title: 'Fecha ingreso',
            dataIndex: 'FechaIngreso',
            defaultSortOrder: 'descend',
            width: '110px'
        },
        {
            title: 'Fecha entrega',
            dataIndex: 'FechaEntrega',
            defaultSortOrder: 'descend',
            width: '110px'
        },
        {
            title: 'Costo del servicio',
            dataIndex: 'CostoServicio',
            defaultSortOrder: 'descend',
            render: (text) => `Bs.  ${text}`, // Muestra el costo con el símbolo de Bs.
        },
        {
            title: 'Acciones', // Título para la columna de acciones
            key: 'actions', // Clave para la columna de acciones
            render: (text, record) => ( // Renderiza el botón de acción para cada fila
                <Space>
                    <Button disabled={verificarRegistrado(record)} onClick={() => navegarRegistrarCliente(record)}>Registrar</Button>
                </Space>
            ),
        },
    ];


    // useEffect que se ejecuta al montar el componente, obteniendo los datos desde Firestore
    useEffect(() => {
        const fetchData = async () => {
            // Obtiene los tickets de atención desde la colección de Firestore
            const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataFirebase(dataList); // Almacena los datos de los tickets de atención

            // Obtiene los clientes desde la colección de Firestore
            const querySnapshot2 = await getDocs(collection(db, "ListaClientes"));
            const dataList2 = querySnapshot2.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataClientes(dataList2); // Almacena los datos de los clientes
            setNumeroClientes(`2024-${dataList2.length + 1}`); // Genera el número de cliente basado en la longitud de la lista de clientes
        };
        fetchData();
    }, []);


    // Método para verificar si un cliente ya está registrado
    const verificarRegistrado = (records) => {
        const aux = dataCliente.some(cliente => cliente.IdCliente === records.id);
        return aux; // Retorna verdadero si el cliente ya está registrado, de lo contrario falso
    }

    // Método para navegar a la vista de registrar cliente
    const navegarRegistrarCliente = (record) => {
        navigate('/sistema-servicios/registrar-cliente', { state: { objetoProp: record, numeroCliente: numeroCliente } });
    };

    // Método para manejar cambios en la tabla (paginación, filtros, ordenamiento)
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };


    return (
        <>
            <div>
                <h2 className="form-titleRepuestos">Lista de clientes con ticket</h2>
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

export default MostrarRegistrarClientes;
