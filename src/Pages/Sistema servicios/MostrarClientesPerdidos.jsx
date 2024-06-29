import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css';
import BotonMostrarCliente from './VerCliente';

const MostrarClientesPerdidos = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
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

    // - - - - - - - - - - - - - - -  E   L   I   M   I   N   A    R  - - - - - - - - - - - - - - - -
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar la información del cliente perdido?',
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
        const docRef = doc(db, "ListaClientesPerdidos", id);
        try {
            await deleteDoc(docRef);
            //console.log("Document deleted");
            actualizarClientesPerdidos();
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    // - - - - - - - - - - - - - - -  O T R A S     F U N C I O N A L I D A D E S  - - - - - - - - - - - - - - - -
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    const dataCliente = (record) => {
        if (dataFirebaseCliente.length > 0) {
            const filteredData = dataFirebaseCliente.find(item => item.id === record.id);
            return filteredData;
        } else {
            return record
        }
    }

    const habilitarClientePerdido = async (record) => {
        const docRef2 = doc(db, "ListaClientes", record.id);
        try {
            await updateDoc(docRef2, {
                Estado: "Activo",
            });
            //console.log("Document updated");
            handleDelete(record.id)
            ModalExito();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }

    const ModalExito = () => {
        Modal.success({
            title: 'Habilitar cliente perdido',
            content: 'El cliente perdido se ha habilitado correctamente.',
            onOk: () => { }
        });
    }

    const actualizarClientesPerdidos = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaClientesPerdidos"));
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        // console.log(dataList);
        setDataFirebase(dataList);
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientesPerdidos"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();

        const fetchDataCliente = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebaseCliente(dataList);
        };
        fetchDataCliente();
    }, []);

    return (
        <>
            <div>
                <h2 className="form-title">Mostrar clientes perdidos</h2>
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

export default MostrarClientesPerdidos;
