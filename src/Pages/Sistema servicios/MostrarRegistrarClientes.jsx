import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css'

const MostrarRegistrarClientes = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);
    const [numeroCliente, setNumeroClientes] = useState([]);

    const columns = [
        {
            title: 'Nombre del cliente',
            dataIndex: 'NombreCliente',
            defaultSortOrder: 'descend',
            width: '180px',
            sorter: (a, b) => a.NombreCliente.localeCompare(b.NombreCliente),
        },
        {
            title: 'Nombre del dispositivo',
            dataIndex: 'NombreDispositivo',
            defaultSortOrder: 'descend',
            width: '120px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Descripción del problema',
            dataIndex: 'DescripcionProblema',
            defaultSortOrder: 'descend',
            with: '180px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Teléfono/celular',
            dataIndex: 'TelefonoCelular',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha ingreso',
            dataIndex: 'FechaIngreso',
            defaultSortOrder: 'descend',
            width: '110px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha entrega',
            dataIndex: 'FechaEntrega',
            defaultSortOrder: 'descend',
            width: '110px'
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Costo del servicio',
            dataIndex: 'CostoServicio',
            defaultSortOrder: 'descend',
            render: (text) => `Bs.  ${text}`,
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    {/* <Button onClick={() => showDetails(record)}>Mostrar</Button> */}
                    <Button onClick={() => navegarRegistrarCliente(record)}>Registrar</Button>
                </Space>
            ),
        },
    ];

    const navegarRegistrarCliente = (record) => {
        // console.log('Editar:', record);
        navigate('/sistema-servicios/registrar-cliente', { state: { objetoProp: record, numeroCliente: numeroCliente } });
        // Aquí puedes implementar la lógica para editar el registro
    };

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
            
            const querySnapshot2 = await getDocs(collection(db, "ListaClientes"));
            const dataList2 = querySnapshot2.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setNumeroClientes(`2024-${dataList2.length+1}`);
        };
        fetchData();
    }, []);

    return (
        <>
            <div>
                <h2 className="form-titleRepuestos">Mostrar tickets de atención</h2>
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
