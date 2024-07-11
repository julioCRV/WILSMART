import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css'

const MostrarRepuestos = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);

    const columns = [
        {
            title: 'Código',
            dataIndex: 'CodRepuesto',
            // defaultSortOrder: 'descend',
            width: '50px',
            sorter: (a, b) => a.CodRepuesto.localeCompare(b.CodRepuesto),
        },
        {
            title: 'Nombre',
            dataIndex: 'NombreRepuesto',
            defaultSortOrder: 'ascend',
            width: '150px',
            sorter: (a, b) => a.NombreRepuesto.localeCompare(b.NombreRepuesto),
        },
        {
            title: 'Categoria',
            dataIndex: 'Categoria',
            // defaultSortOrder: 'descend',
            width: '200px',
            sorter: (a, b) => a.Categoria.localeCompare(b.Categoria),
        },
        {
            title: 'Cantidad',
            dataIndex: 'Cantidad',
            // defaultSortOrder: 'descend',
            sorter: (a, b) => a.Cantidad - b.Cantidad,
        },
        {
            title: 'Precio de compra',
            dataIndex: 'PrecioCompra',
            // defaultSortOrder: 'descend',
            render: (text) => `Bs.   ${text}`,
            width: '50px',
            sorter: (a, b) => a.CostoUnitario - b.CostoUnitario,
        },
        {
            title: 'Precio de repuesto',
            dataIndex: 'PrecioRepuesto',
            // defaultSortOrder: 'descend',
            render: (text) => `Bs.  ${text}`,
            width: '50px',
            sorter: (a, b) => a.PrecioRepuesto - b.PrecioRepuesto,
        },
        {
            title: 'Proveedor',
            dataIndex: 'Proveedor',
            // defaultSortOrder: 'descend',
            width: '150px',
            sorter: (a, b) => a.Proveedor.localeCompare(b.Proveedor),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Space >
                    <Button onClick={() => showDetails(record)}>Mostrar</Button>
                    <Button onClick={() => editRecord(record)}>Editar</Button>
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

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
                    <p><strong>Precio de compra: </strong>{record.PrecioCompra}</p>
                    <p><strong>Precio del repuesto: </strong>{record.PrecioRepuesto}</p>
                    <p><strong>Fecha de ingreso: </strong> {record.Fecha}</p>
                    <p><strong>Ubicación en almacén: </strong> {record.UbicacionAlmacen}</p>
                </div>
            ),
            onOk() { },
        });
    };

    const editRecord = (record) => {
        //console.log('Editar:', record);
        navigate('/sistema-servicios/editar-repuesto', { state: { objetoProp: record } });
        // Aquí puedes implementar la lógica para editar el registro
    };

    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar este respuesto?',
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
        const docRef = doc(db, "ListaRepuestos", id);
        try {
            await deleteDoc(docRef);
            //console.log("Document deleted");
            actualizarListaRepuestos();
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    const actualizarListaRepuestos = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaRepuestos"));
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        // console.log(dataList);
        setDataFirebase(dataList);
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaRepuestos"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();
    }, []);

    return (
        <>
            <div>
                <h2 className="form-titleRepuestos">Mostrar repuestos</h2>
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

export default MostrarRepuestos;
