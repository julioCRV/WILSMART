import { Table, Button, InputNumber, Space, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarProducto.css'

const MostrarProducto = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'NombreProducto',
            defaultSortOrder: 'ascend',
            width: '200px',
            sorter: (a, b) => a.NombreProducto.localeCompare(b.NombreProducto),
        },
        {
            title: 'Cantidad',
            dataIndex: 'Cantidad',
            // defaultSortOrder: 'descend',
            sorter: (a, b) => a.Cantidad - b.Cantidad,
        },
        {
            title: 'Nueva cantidad',
            dataIndex: 'nuevaCantidad',
            // defaultSortOrder: 'descend',
            sorter: (a, b) => a.nuevaCantidad - b.nuevaCantidad,
        },
        {
            title: 'Incrementar',
            dataIndex: 'cantidadIncrementada',
            key: 'incrementar',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleIncrement(record.id, -1)}>-</Button>
                    <InputNumber
                        min={0}
                        value={record.cantidadIncrementada}
                        onChange={(value) => handleIncrement(record.id, value - record.cantidadIncrementada)}
                    />
                    <Button onClick={() => handleIncrement(record.id, 1)}>+</Button>
                </div>
            ),
        },
        {
            title: 'Acción',
            dataIndex: 'accion',
            key: 'accion',
            render: (_, record) => (
                <Button onClick={() => handleActualizar(record.id)}>Actualizar</Button>
            ),
        },
    ];

    const handleIncrement = (key, incrementValue) => {
        const updatedProductos = dataFirebase.map((producto) => {
            if (producto.id === key) {
                const newNuevaCantidad = producto.cantidadIncrementada + incrementValue;
                return { ...producto, cantidadIncrementada: newNuevaCantidad >= 0 ? newNuevaCantidad : 0 };
            }
            return producto;
        });
        setDataFirebase(updatedProductos);
    };

    const handleActualizar = (key) => {
        const updatedProductos = dataFirebase.map((producto) => {
            if (producto.id === key) {
                return { ...producto, nuevaCantidad: parseInt(producto.Cantidad) + producto.cantidadIncrementada };
            }
            return producto;
        });
        setDataFirebase(updatedProductos);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    // const handleSaveAll = async () => {
    //     const batch = db.batch(); 
    //     dataFirebase.forEach((item) => {
    //         const productRef = doc(db, "ListaProductos", item.id);
    //         if(item.nuevaCantidad != 0){
    //             batch.update(productRef, { cantidad: item.nuevaCantidad });
    //         }
    //     });

    //     await batch.commit(); 
    //     console.log('Todos los productos han sido actualizados en Firebase.');
    // };

    const handleSaveAll = async () => {
        const promises = dataFirebase.map((item) => {
            const productRef = doc(db, "ListaProductos", item.id);
            if (item.nuevaCantidad !== 0) {
                return updateDoc(productRef, { Cantidad: item.nuevaCantidad });
            }
            return null;
        }).filter(promise => promise !== null);

        try {
            await Promise.all(promises); // Espera a que todas las actualizaciones se completen
            //console.log('Todos los productos han sido actualizados en Firebase.');
        } catch (error) {
            console.error('Error al actualizar los productos:', error);
        }
    };

    const confirmDelete = () => {
        confirm({
            title: 'Confirmar guardado',
            content: '¿Está seguro de guardar las modificaciones?',
            okText: 'Guardar',
            okType: 'ghost',
            cancelText: 'Cancelar',
            onOk() {
                handleSaveAll();
                message.success('¡Productos incrementados con éxito!');
                navigate('/sistema-ventas/mostrar-productos');
            },
            onCancel() { },
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaProductos"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                nuevaCantidad: 0,
                cantidadIncrementada: 0,
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();
    }, []);


    return (
        <div>
            <h2 className="form-titleIncr">Incrementar productos</h2>
            <div className='parentMostrarIncre'>
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
            <div className='BotIncrementar'>
                <Button type='primary' onClick={confirmDelete} >Guardar modificaciones</Button>
            </div>
        </div>
    );
};

export default MostrarProducto;
