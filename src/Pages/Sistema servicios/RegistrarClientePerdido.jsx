import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css';
import BotonRegistro from './RegistroCliPerdido';

const RegistrarClientePerdido = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);
    const [confimarcion, setConfirmacion] = useState("");

    const columns = [
        {
            title: 'Código',
            dataIndex: 'CodCliente',
            defaultSortOrder: 'descend',
            width: '150px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nombre',
            dataIndex: 'NombreCliente',
            defaultSortOrder: 'descend',
            width: '200px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Dispositivo',
            dataIndex: 'NombreDispositivo',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Teléfono/celular',
            dataIndex: 'TelefonoCelular',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Correo',
            dataIndex: 'Correo',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <BotonRegistro record={record} disabled={record.Estado === "Inactivo"} confirmacion={confirmarRecarga} />
                </Space>
            ),
        },
    ];

    const confirmarRecarga = (value) => {
        setConfirmacion(value);
    }
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };



    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const actualizarClientes = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        actualizarClientes();
        setConfirmacion("");
    }, [confimarcion]);
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
