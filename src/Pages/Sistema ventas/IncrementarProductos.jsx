import { Table, Button, InputNumber, Space, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarProducto.css'

const MostrarProducto = () => {
    // Importación del método "confirm" de Modal y configuración de estados y navegación
    const { confirm } = Modal; // Desestructuración para usar la función "confirm" del componente Modal
    const navigate = useNavigate(); // Hook de React Router para manejar la navegación entre rutas
    const [dataFirebase, setDataFirebase] = useState([]); // Estado para almacenar los datos obtenidos de Firebase, inicializado como un arreglo vacío
    //Definición de datos para la tabla
    const columns = [
        {
            title: 'Imagen',
            dataIndex: 'Imagen',
            render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '50px' }} />,
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
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

    // useEffect: Cargar lista de productos desde Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener documentos de la colección "ListaProductos" en Firestore
                const querySnapshot = await getDocs(collection(db, "ListaProductos"));

                // Mapear los documentos para agregar propiedades adicionales
                const dataList = querySnapshot.docs.map(doc => ({
                    ...doc.data(), // Datos del documento
                    id: doc.id, // ID del documento
                    nuevaCantidad: 0, // Nueva propiedad inicializada en 0
                    cantidadIncrementada: 0, // Otra nueva propiedad inicializada en 0
                }));

                setDataFirebase(dataList); // Actualizar el estado con la lista obtenida
            } catch (error) {
                console.error("Error fetching data from Firestore: ", error); // Manejo de errores
            }
        };

        fetchData(); // Llamar a la función para obtener los datos al montar el componente
    }, []);

    // Función para incrementar la cantidad de un producto
    const handleIncrement = (key, incrementValue) => {
        const updatedProductos = dataFirebase.map((producto) => {
            // Verifica si el producto actual coincide con el ID proporcionado (key)
            if (producto.id === key) {
                const newNuevaCantidad = producto.cantidadIncrementada + incrementValue;
                // Actualiza el valor de "cantidadIncrementada" asegurándose de que no sea negativo
                return { ...producto, cantidadIncrementada: newNuevaCantidad >= 0 ? newNuevaCantidad : 0 };
            }
            return producto; // Retorna el producto sin cambios si no coincide el ID
        });
        setDataFirebase(updatedProductos); // Actualiza el estado con la nueva lista de productos
    };

    // Función para calcular y actualizar la nueva cantidad de un producto
    const handleActualizar = (key) => {
        const updatedProductos = dataFirebase.map((producto) => {
            // Verifica si el producto actual coincide con el ID proporcionado (key)
            if (producto.id === key) {
                // Calcula la nueva cantidad sumando la cantidad inicial y la cantidad incrementada
                return { ...producto, nuevaCantidad: parseInt(producto.Cantidad) + producto.cantidadIncrementada };
            }
            return producto; // Retorna el producto sin cambios si no coincide el ID
        });
        setDataFirebase(updatedProductos); // Actualiza el estado con la nueva lista de productos
    };

    // Función para manejar cambios en la tabla (filtros, paginación, ordenación)
    const onChange = (pagination, filters, sorter, extra) => {
        // Por ahora no realiza ninguna acción, pero se pueden agregar manejadores aquí
        // console.log('params', pagination, filters, sorter, extra);
    };

    // Función para guardar los cambios en Firestore
    const handleSaveAll = async () => {
        // Genera un array de promesas para actualizar solo los productos con cantidades modificadas
        const promises = dataFirebase.map((item) => {
            const productRef = doc(db, "ListaProductos", item.id); // Referencia al documento en Firestore
            if (item.nuevaCantidad !== 0) { // Solo actualiza productos con cambios en la cantidad
                return updateDoc(productRef, { Cantidad: item.nuevaCantidad }); // Actualiza el campo "Cantidad"
            }
            return null; // Ignora productos sin cambios
        }).filter(promise => promise !== null); // Filtra las promesas nulas

        try {
            await Promise.all(promises); // Espera a que todas las actualizaciones se completen
        } catch (error) {
            console.error('Error al actualizar los productos:', error); // Manejo de errores
        }
    };

    // Función para mostrar una confirmación antes de guardar los cambios
    const confirmDelete = () => {
        confirm({
            title: 'Confirmar guardado', // Título del modal
            content: '¿Está seguro de guardar las modificaciones?', // Mensaje del modal
            okText: 'Guardar', // Texto del botón de confirmación
            okType: 'ghost', // Estilo del botón de confirmación
            cancelText: 'Cancelar', // Texto del botón de cancelación
            onOk() {
                handleSaveAll(); // Llama a la función para guardar todos los cambios
                message.success('¡Productos incrementados con éxito!'); // Mensaje de éxito
                navigate('/sistema-ventas/mostrar-productos'); // Navega a la lista de productos
            },
            onCancel() { }, // No realiza ninguna acción si se cancela
        });
    };

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
