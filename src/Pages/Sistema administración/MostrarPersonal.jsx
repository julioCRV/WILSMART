import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs,  doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarPersonal.css'

const MostrarEmpleado = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [dataFirebase, setDataFirebase] = useState([]);

  const columns = [
    {
      title: 'Foto',
      dataIndex: 'FotoEmpleado',
      render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '100px' }} />,
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Nombre completo',
      dataIndex: 'Nombre',
      defaultSortOrder: 'descend',
      width: '250px'
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Puesto o cargo',
      dataIndex: 'PuestoOcargo',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Número de teléfono',
      dataIndex: 'NumeroTeléfono',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'C.I.',
      dataIndex: 'CI',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Salario',
      dataIndex: 'Salario',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showDetails(record)}>Mostrar</Button>
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
    navigate('/sistema-administración/editar-empleado', { state: { objetoProp: record } });
    // Aquí puedes implementar la lógica para editar el registro
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "ListaEmpleados", id);
    try {
      await deleteDoc(docRef);
      console.log("Document deleted");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const confirmDelete = (record) => {
    confirm({
      title: '¿Estás seguro de eliminar este registro?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        console.log('Eliminar:', record);
        handleDelete(record.id)
        // Aquí puedes implementar la lógica para eliminar el registro
      },
      onCancel() { },
    });
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      // console.log(dataList);
      setDataFirebase(dataList);
    };
    fetchData();
  }, [handleDelete]);

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

export default MostrarEmpleado;
