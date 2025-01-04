import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css'

const MostrarRepuestos = () => {
    const { confirm } = Modal; // Desestructura el método confirm de Modal para usarlo en confirmaciones
    const navigate = useNavigate(); // Utiliza el hook useNavigate de React Router para la navegación
    const [dataFirebase, setDataFirebase] = useState([]); // Estado para almacenar los datos obtenidos de Firebase

    // Definición de las columnas de la tabla para mostrar los datos
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

    // useEffect para cargar los datos de repuestos desde Firestore al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            // Consulta los repuestos desde la colección "ListaRepuestos" en Firestore
            const querySnapshot = await getDocs(collection(db, "ListaRepuestos"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataFirebase(dataList); // Almacena los datos obtenidos en el estado
        };
        fetchData(); // Llama a la función para cargar los datos
    }, []);

    // Método para mostrar los detalles de un repuesto en un Modal
    const showDetails = (record) => {
        Modal.info({
            title: 'Detalles del repuesto', // Título del modal
            content: (
                <div>
                    {/* Aquí se podrían mostrar más detalles, como la imagen del repuesto */}
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

    // Método para navegar a la vista de edición del repuesto
    const editRecord = (record) => {
        navigate('/sistema-servicios/editar-repuesto', { state: { objetoProp: record } });
    };

    // Método para confirmar la eliminación de un repuesto mediante un Modal
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar este repuesto?', // Título del modal de confirmación
            content: 'Esta acción no se puede deshacer.', // Mensaje de advertencia
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                handleDelete(record.id); // Llama a la función de eliminación si el usuario confirma
            },
            onCancel() { },
        });
    };

    // Método para eliminar un repuesto de la base de datos de Firestore
    const handleDelete = async (id) => {
        const docRef = doc(db, "ListaRepuestos", id); // Referencia al documento a eliminar
        try {
            await deleteDoc(docRef); // Elimina el documento de Firestore
            actualizarListaRepuestos(); // Actualiza la lista de repuestos después de la eliminación
        } catch (e) {
            console.error("Error deleting document: ", e); // Muestra el error en caso de fallo
        }
    };

    // Método que maneja cambios en la tabla (paginación, filtros, ordenamiento)
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra); // Puede usarse para depurar o personalizar la tabla
    };

    // Método para actualizar la lista de repuestos obteniendo los datos nuevamente desde Firestore
    const actualizarListaRepuestos = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaRepuestos"));
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        setDataFirebase(dataList); // Actualiza el estado con los nuevos datos de los repuestos
    };

    return (
        <>
            <div>
                <h2 className="form-titleRepuestos">Mostrar repuestos</h2>
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

export default MostrarRepuestos;
