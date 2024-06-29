import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css';
import BotonVer from './VerCliente';

const MostrarClientes = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);

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
                    <BotonVer record={record} />
                    {/* <Button onClick={() => showDetails(record)}>Mostrar</Button> */}
                    <Button onClick={() => editRecord(record)}>Editar</Button>
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    // - - - - - - - - - - - - - - -  M   O   S   T   R   A   R  - - - - - - - - - - - - - - - -
    const showDetails = (record) => {
        Modal.info({
            title: 'Detalles del repuesto',
            content: (
                <div>
                    {/* <img src={record.FotoEmpleado} alt="Empleado" style={{ width: '200px', marginLeft: '15%' }} /> */}
                    <p><strong>Cod.  </strong>{record.CodRepuesto}</p>
                    <p><strong>Cantidad: </strong>{record.Cantidad}</p>

                    <p style={{ fontSize: "20px" }}><strong>{record.NombreRepuesto}</strong></p>
                    <p><strong>Descripción: </strong> {record.Descripcion}</p>
                    <p><strong>Categoría: </strong> {record.Categoria}</p>
                    <p><strong>Estado: </strong> {record.Estado}</p>
                    <p><strong>Proveedor: </strong> {record.Proveedor}</p>
                    <p><strong>Costo unitario: </strong>{record.CostoUnitario}</p>
                    <p><strong>Precio del repuestos: </strong>{record.PrecioRepuesto}</p>
                    <p><strong>Fecha de ingreso: </strong> {record.Fecha}</p>
                    <p><strong>Ubicación en almacén: </strong> {record.UbicacionAlmacen}</p>
                </div>
            ),
            onOk() { },
        });
    };

    // - - - - - - - - - - - - - - -  E   D   I   T   A   R  - - - - - - - - - - - - - - - -
    const editRecord = (record) => {
        //console.log('Editar:', record);
        navigate('/sistema-servicios/editar-cliente', { state: { objetoProp: record } });
        // Aquí puedes implementar la lógica para editar el registro
    };

    // - - - - - - - - - - - - - - -  E   L   I   M   I   N   A    R  - - - - - - - - - - - - - - - -
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar la información del cliente?',
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
        const docRef = doc(db, "ListaClientes", id);
        try {
            await deleteDoc(docRef);
            //console.log("Document deleted");
            actualizarClientes();
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    // - - - - - - - - - - - - - - -  O T R A S     F U N C I O N A L I D A D E S  - - - - - - - - - - - - - - - -
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    const actualizarClientes = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaClientes"));
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        // console.log(dataList);
        setDataFirebase(dataList);
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaClientes"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            const filteredDataList = dataList.filter(item => item.Estado === "Activo");

            setDataFirebase(filteredDataList);


        };
        fetchData();
    }, []);

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
