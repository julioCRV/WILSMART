import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './MostrarProducto.css'

const MostrarProducto = () => {
  // Desestructuración del objeto Modal para obtener la función confirm, usada para mostrar modales de confirmación
  const { confirm } = Modal;
  // Usamos useNavigate de React Router para poder realizar redirecciones de la navegación
  const navigate = useNavigate();
  // Declaramos el estado para almacenar los datos que provienen de Firebase
  const [dataFirebase, setDataFirebase] = useState([]);
  //Definimos los datos de la tabla
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'NombreProducto',
      defaultSortOrder: 'ascend',
      width: '100px',
      sorter: (a, b) => a.NombreProducto.localeCompare(b.NombreProducto),
    },
    {
      title: 'Descripción',
      dataIndex: 'Descripcion',
      // defaultSortOrder: 'descend',
      // sorter: (a, b) => a.Descripcion.localeCompare(b.Descripcion),
    },
    {
      title: 'Marca',
      dataIndex: 'Marca',
      // defaultSortOrder: 'descend',
      width: '150px',
      // sorter: (a, b) => a.Marca.localeCompare(b.Marca),
    },
    {
      title: 'Categoria',
      dataIndex: 'Categoria',
      // defaultSortOrder: 'descend',
      sorter: (a, b) => a.Categoria.localeCompare(b.Categoria),
    },
    {
      title: 'Precio compra',
      dataIndex: 'PrecioCompra',
      // defaultSortOrder: 'descend',
      render: (text) => `Bs   ${text}`,
      width: '80px',
      sorter: (a, b) => a.Precio - b.Precio,
    },
    {
      title: 'Precio venta',
      dataIndex: 'Precio',
      // defaultSortOrder: 'descend',
      render: (text) => `Bs   ${text}`,
      width: '80px',
      sorter: (a, b) => a.Precio - b.Precio,
    },
    {
      title: 'Cantidad',
      dataIndex: 'Cantidad',
      // defaultSortOrder: 'descend',
      width: '80px',
      sorter: (a, b) => a.Cantidad - b.Cantidad,
    },
    {
      title: 'Fecha',
      dataIndex: 'Fecha',
      // defaultSortOrder: 'descend',
      sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
    },
    {
      title: 'Imagen',
      dataIndex: 'Imagen',
      render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '50px' }} />,
      // defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button onClick={() => editRecord(record)}>Editar</Button>
          <Button style={{ border: '1px solid red', color: 'red' }} onClick={() => confirmDelete(record)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  // useEffect se ejecuta cuando el componente se monta (por la dependencia vacía [])
  useEffect(() => {
    // Función asíncrona para obtener los productos de la colección "ListaProductos" en Firebase
    const fetchData = async () => {
      // Realizamos una consulta a la colección "ListaProductos" en Firestore
      const querySnapshot = await getDocs(collection(db, "ListaProductos"));
      // Mapeamos los documentos obtenidos y los agregamos al estado con el id del documento
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Agregamos el id del documento a los datos
      }));
      // Actualizamos el estado con la lista de productos
      setDataFirebase(dataList);
    };
    fetchData(); // Llamamos la función para obtener los datos de Firebase
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar el componente

  // Función para editar un producto. Redirige a la página de edición pasando el producto como estado.
  const editRecord = (record) => {
    navigate('/sistema-ventas/editar-producto', { state: { objetoProp: record } });
  };

  // Función para eliminar un producto de Firestore usando su ID
  const handleDelete = async (id) => {
    const docRef = doc(db, "ListaProductos", id); // Referencia al documento en Firebase
    try {
      await deleteDoc(docRef); // Elimina el documento de Firestore
      actualizarListaProductos(); // Actualiza la lista de productos después de la eliminación
    } catch (e) {
      console.error("Error deleting document: ", e); // Muestra error si falla la eliminación
    }
  };

  // Función de confirmación de eliminación de producto. Se muestra un modal de confirmación.
  const confirmDelete = (record) => {
    confirm({
      title: '¿Estás seguro de eliminar este producto?', // Título del modal
      content: 'Esta acción no se puede deshacer.', // Contenido del modal
      okText: 'Eliminar', // Texto del botón de confirmación
      okType: 'danger', // Estilo del botón de confirmación
      cancelText: 'Cancelar', // Texto del botón de cancelación
      onOk() {
        handleDelete(record.id); // Llama a handleDelete si el usuario confirma la eliminación
      },
      onCancel() { }, // No hace nada al cancelar
    });
  };

  // Función que maneja cambios en la tabla, como paginación, filtros o clasificación (sin implementación en este código)
  const onChange = (pagination, filters, sorter, extra) => {
    //console.log('params', pagination, filters, sorter, extra); // Aquí podrías manejar cambios si lo necesitas
  };

  // Función para actualizar la lista de productos obtenida desde Firebase
  const actualizarListaProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "ListaProductos")); // Obtiene los productos de la colección
    const dataList = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id // Mapea los productos añadiendo su id
    }));
    setDataFirebase(dataList); // Actualiza el estado con la nueva lista de productos
  };

  return (
    <>
      <div>
        <h2 className="form-titleProductos">Mostrar productos</h2>
        <div className='parentMostrarProductos'>
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

export default MostrarProducto;
