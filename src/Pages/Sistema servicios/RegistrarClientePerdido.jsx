import { Table, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './MostrarRepuestos.css';
import BotonRegistro from './RegistroCliPerdido';

const RegistrarClientePerdido = () => {
    // Estado para almacenar los datos obtenidos de Firebase y el mensaje de confirmación.
    const [dataFirebase, setDataFirebase] = useState([]); // Almacena los datos de la lista de clientes.
    const [confimarcion, setConfirmacion] = useState(""); // Almacena el mensaje de confirmación.

    // Definición de las columnas de la tabla.
    const columns = [
        {
            title: 'Código', // Título de la columna para el código del cliente.
            dataIndex: 'CodCliente', // El campo de datos que se mostrará en esta columna.
            defaultSortOrder: 'descend', // Orden de clasificación por defecto.
            width: '150px', // Ancho de la columna.
        },
        {
            title: 'Nombre', // Título de la columna para el nombre del cliente.
            dataIndex: 'NombreCliente', // Campo que se mostrará en esta columna.
            defaultSortOrder: 'descend', // Orden por defecto de clasificación.
            width: '200px', // Ancho de la columna.
        },
        {
            title: 'Dispositivo', // Título de la columna para el nombre del dispositivo.
            dataIndex: 'NombreDispositivo', // Campo que se mostrará en esta columna.
            defaultSortOrder: 'descend', // Orden de clasificación por defecto.
        },
        {
            title: 'Teléfono/celular', // Título de la columna para el teléfono celular.
            dataIndex: 'TelefonoCelular', // Campo que se mostrará en esta columna.
            defaultSortOrder: 'descend', // Orden de clasificación por defecto.
        },
        {
            title: 'Correo', // Título de la columna para el correo electrónico.
            dataIndex: 'Correo', // Campo que se mostrará en esta columna.
            defaultSortOrder: 'descend', // Orden de clasificación por defecto.
        },
        {
            title: 'Acciones', // Título de la columna para las acciones.
            key: 'actions', // Clave para identificar la columna de acciones.
            render: (text, record) => (
                <Space size="middle">
                    {/* Botón de registro que se deshabilita si el cliente está inactivo. */}
                    <BotonRegistro record={record} disabled={record.Estado === "Inactivo"} confirmacion={confirmarRecarga} />
                </Space>
            ),
        },
    ];

    // Primer useEffect que se ejecuta al montar el componente para obtener los datos de la colección "ListaClientes" de Firebase.
    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Se incluye el ID del documento como parte de los datos.
            }));
            setDataFirebase(dataList); // Se establece el estado de dataFirebase con los datos obtenidos.
        };
        fetchData();
    }, []); // Se ejecuta solo una vez al montar el componente.

    // Segundo useEffect que se ejecuta cada vez que cambia la variable de confirmación (confimarcion) para actualizar los clientes.
    useEffect(() => {
        const actualizarClientes = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Se incluye el ID del documento como parte de los datos.
            }));
            setDataFirebase(dataList); // Se establece el estado de dataFirebase con los datos actualizados.
        };
        actualizarClientes();
        setConfirmacion(""); // Resetea el estado de confirmación después de actualizar los clientes.
    }, [confimarcion]); // Se ejecuta cada vez que cambia confimarcion.

    // Función que recibe un valor y establece el mensaje de confirmación.
    const confirmarRecarga = (value) => {
        setConfirmacion(value); // Establece el valor de confirmación.
    }

    // Función que maneja el cambio de la tabla (por ejemplo, paginación, filtros o clasificación).
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra); // Puedes descomentar esto para depurar los parámetros de cambio.
    };


    return (
        <>
            <div>
                <h2 className="form-title">Lista de clientes</h2>
                <div className='parentMostrar'>
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

export default RegistrarClientePerdido;
