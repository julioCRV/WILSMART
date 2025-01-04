import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './MostrarRepuestos.css';
import BotonMostrarCliente from './VerCliente';

const MostrarClientesPerdidos = () => {
    const { confirm } = Modal;
    const [dataFirebase, setDataFirebase] = useState([]);
    const [dataFirebaseCliente, setDataFirebaseCliente] = useState([]);

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
            width: '150px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Motivo',
            dataIndex: 'Motivo',
            defaultSortOrder: 'descend',
            width: '280px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha',
            dataIndex: 'Fecha',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <BotonMostrarCliente record={dataCliente(record)} />
                    <Button onClick={() => habilitarClientePerdido(record)}>Habilitar</Button>
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
    useEffect(() => {
        // Función para obtener los datos de "ListaClientesPerdidos" desde Firestore
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientesPerdidos"));
            // Mapear los documentos obtenidos para incluir su id y los datos
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // Establecer el estado con los datos obtenidos
            setDataFirebase(dataList);
        };

        // Llamar a la función que obtiene los datos de la colección "ListaClientesPerdidos"
        fetchData();

        // Función para obtener los datos de "ListaClientes" desde Firestore
        const fetchDataCliente = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));
            // Mapear los documentos obtenidos para incluir su id y los datos
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // Establecer el estado con los datos obtenidos
            setDataFirebaseCliente(dataList);
        };

        // Llamar a la función que obtiene los datos de la colección "ListaClientes"
        fetchDataCliente();
    }, []);

    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // - - - - - - - - - - - - - - -  E   L   I   M   I   N   A    R  - - - - - - - - - - - - - - - -
    // Método para confirmar la eliminación de un cliente perdido
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar la información del cliente perdido?', // Título de la confirmación
            content: 'Esta acción no se puede deshacer.', // Mensaje informativo sobre la acción irreversible
            okText: 'Eliminar', // Texto del botón para confirmar eliminación
            okType: 'danger', // Tipo de botón (rojo, para indicar que es una acción destructiva)
            cancelText: 'Cancelar', // Texto del botón para cancelar la acción
            onOk() {
                // Si el usuario confirma, se llama a la función handleDelete para eliminar el registro
                handleDelete(record.id);
            },
            onCancel() { },
        });
    };

    // Método para eliminar un cliente perdido de la base de datos
    const handleDelete = async (id) => {
        const docRef = doc(db, "ListaClientesPerdidos", id); // Obtener la referencia al documento en Firestore
        try {
            await deleteDoc(docRef); // Intentar eliminar el documento de Firestore
            actualizarClientesPerdidos(); // Actualizar la lista de clientes perdidos después de la eliminación
        } catch (e) {
            console.error("Error deleting document: ", e); // En caso de error, lo mostramos en la consola
        }
    };

    // Método para manejar los cambios en la tabla (paginación, filtros, ordenación)
    const onChange = (pagination, filters, sorter, extra) => {
        // Función para manejar cambios en la tabla (como la paginación, filtros o el orden de los datos)
        //console.log('params', pagination, filters, sorter, extra); // Descomentar para depurar los cambios
    };

    // Método para obtener los datos de un cliente, si existen en la lista de clientes
    const dataCliente = (record) => {
        if (dataFirebaseCliente.length > 0) {
            // Si la lista de clientes no está vacía, buscamos el cliente por su id
            const filteredData = dataFirebaseCliente.find(item => item.id === record.id);
            return filteredData; // Retorna el cliente encontrado
        } else {
            // Si no se encuentra, devuelve el registro tal cual
            return record;
        }
    }

    // Método para habilitar un cliente perdido, cambiando su estado a "Activo"
    const habilitarClientePerdido = async (record) => {
        const docRef2 = doc(db, "ListaClientes", record.id); // Referencia al documento del cliente
        try {
            // Actualizamos el estado del cliente a "Activo" en la colección de clientes
            await updateDoc(docRef2, {
                Estado: "Activo",
            });
            // Eliminamos el cliente de la lista de clientes perdidos
            handleDelete(record.id);
            // Mostramos un modal de éxito
            ModalExito();
        } catch (e) {
            console.error("Error updating document: ", e); // En caso de error, mostramos un mensaje en consola
        }
    }

    // Método para mostrar un modal de éxito cuando el cliente perdido es habilitado
    const ModalExito = () => {
        Modal.success({
            title: 'Habilitar cliente perdido', // Título del modal
            content: 'El cliente perdido se ha habilitado correctamente.', // Mensaje del modal
            onOk: () => { } // Acción al presionar el botón de OK (vacío en este caso)
        });
    }

    // Método para actualizar la lista de clientes perdidos
    const actualizarClientesPerdidos = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaClientesPerdidos")); // Obtiene todos los documentos de clientes perdidos
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })); // Mapea los datos obtenidos y agrega los ids
        setDataFirebase(dataList); // Actualiza el estado con la lista de clientes perdidos
    };
    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    return (
        <>
            <div>
                <h2 className="form-title">Mostrar clientes perdidos</h2>
                <div className='parentMostrar'>
                    <Table
                        columns={columns}
                        dataSource={dataFirebase.map((data, index) => ({
                            ...data,
                            key: index,
                        }))}
                        pagination={false}
                        onChange={onChange}
                        showSorterTooltip={{
                            target: 'sorter-icon',
                        }}
                        scroll={{ x: 1200 }}  // Establece el ancho máximo de la tabla, ajusta según lo necesario
                        size="middle"
                        bordered
                        style={{ maxWidth: '100%' }}  // Asegura que la tabla no se desborde

                    />
                </div>
            </div>
        </>
    );
};

export default MostrarClientesPerdidos;
