import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs,  doc, deleteDoc } from "firebase/firestore";
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
      defaultSortOrder: 'descend',
      width: '250px'
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Descripción',
      dataIndex: 'Descripcion',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Marca',
      dataIndex: 'Marca',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Categoria',
      dataIndex: 'Categoria',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Precio',
      dataIndex: 'Precio',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Cantidad',
      dataIndex: 'Cantidad',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Fecha',
      dataIndex: 'Fecha',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Imagen',
      dataIndex: 'Imagen',
      render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '100px' }} />,
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          {/* <Button onClick={() => showDetails(record)}>Mostrar</Button> */}
          <Button onClick={() => editRecord(record)}>Editar</Button>
          <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  const showDetails = (record) => {
    Modal.info({
      title: 'Detalles del Registro',
      content: (
        <div>
          <img src={record.FotoEmpleado} alt="Empleado" style={{ width: '200px', marginLeft: '15%' }} />
          <p>{record.Nombre}</p>
          <p>{record.PuestoOcargo}</p>
          <p>Salario: {record.Salario}</p>

          <p>Fecha nacimiento: {record.FechaNacimiento}</p>
          <p>C.I.: {record.CI}</p>
          <p>Género: {record.Genero}</p>
          <p>Estado civil: {record.EstadoCivil}</p>
          <p>Número de teléfono{record.NumeroTeléfono}</p>
          <p>Correo electrónico{record.CorreoElectrónico}</p>
          <p>Dirección de domicilio: {record.DirecciónDeDomicilio}</p>
        </div>
      ),
      onOk() { },
    });
  };

  const editRecord = (record) => {
    console.log('Editar:', record);
    navigate('/sistema-ventas/editar-producto', { state: { objetoProp: record } });
    // Aquí puedes implementar la lógica para editar el registro
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "ListaProductos", id);
    try {
      await deleteDoc(docRef);
      console.log("Document deleted");
      actualizarListaEmpleados();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const confirmDelete = (record) => {
    confirm({
      title: '¿Estás seguro de eliminar este producto?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        console.log('Eliminar:', record);
        handleDelete(record.id);
      },
      onCancel() { },
    });
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const actualizarListaEmpleados = async () => {
    const querySnapshot = await getDocs(collection(db, "ListaProductos"));
    const dataList = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    // console.log(dataList);
    setDataFirebase(dataList);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ListaProductos"));
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
        <h2 className="form-title">Mostrar empleados</h2>
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

export default MostrarProducto;
